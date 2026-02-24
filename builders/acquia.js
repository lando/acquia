'use strict';

/**
 * @file
 * Defines the main Lando recipe builder for Acquia environments.
 * This builder extends `acquia-base` and configures a comprehensive local
 * development environment that mimics Acquia Cloud, including services like
 * PHP (appserver), database (MySQL), Memcached, and MailHog. It also handles
 * the installation and configuration of the Acquia CLI (`acli`) and sets up
 * Lando tooling for `acli`, `pull`, and `push` operations.
 */

const _ = require('lodash');
const path = require('path');
const {getAcquiaPull} = require('./../lib/pull');
const {getAcquiaPush} = require('./../lib/push');
const utils = require('./../lib/utils');

/**
 * Lando recipe builder definition for Acquia.
 */
module.exports = {
  name: 'acquia',
  parent: 'acquia-base',
  /** Default configuration for the Acquia recipe. */
  config: {
    /** @type {boolean} Whether to enable Memcached service. */
    cache: true,
    /** @type {string} Default Composer version to use (e.g., '2', '1'). */
    composer_version: '2',
    /** @type {string} Source directory for default configuration files. */
    confSrc: path.resolve(__dirname, '..', 'config'),
    /** @type {object} Placeholder for default files, typically populated by the parent or specific logic. */
    defaultFiles: {},
    /** @type {string} Default database type and version (e.g., 'mysql:8.0', 'mysql:5.7'). */
    database: 'mysql:5.7',
    /** @type {string} Default Drush version or constraint (e.g., '8.4.10', '10.x'). */
    drush: '8.4.10',
    /** @type {boolean} Whether to enable MailHog service. */
    inbox: true,
    /** @type {string} Default PHP version. */
    php: '8.3',
    /** @type {object} Service configurations, especially for appserver build steps and overrides. */
    services: {appserver: {
      build: [],
      overrides: {volumes: [], environment: {}},
    }},
    /** @type {object} Proxy configurations for services like MailHog. */
    proxy: {},
  },
  /**
   * The builder function that returns the LandoAcquia class.
   * @param {Function} parent The parent class this builder extends (typically a Recipe base class).
   * @param {object} config The default configuration for this recipe.
   * @return {Function} The LandoAcquia class.
   */
  builder: (parent, config) => class LandoAcquia extends parent {
    /**
     * Constructor for the LandoAcquia recipe builder.
     * This orchestrates the entire setup of an Acquia-like Lando environment.
     * It initializes services, configures tooling (Drush, acli), handles Acquia CLI installation,
     * sets environment variables, mounts necessary files, and integrates pull/push functionalities.
     *
     * @param {string} id The application instance ID.
     * @param {object} [options] User-provided options to override defaults.
     */
    constructor(id, options = {}) {
      options = _.merge({}, config, options);
      // Set default database if not specified, and standard Acquia webroot and env file
      if (!options.database) options.database = 'mysql:8.0';
      options.env_file = ['.env'];
      options.webroot = 'docroot';

      // Gather Acquia keys from Lando's cache and host configuration
      const keys = utils.sortKeys(options._app.acquiaKeys, options._app.hostKeys);
      // Retrieve Acquia-specific metadata and configurations from Lando app options
      const account = _.get(options, '_app.meta.label', null);
      const acliVersion = _.get(options, '_app.config.config.acli_version', 'latest');
      const appUuid = _.get(options, '_app.config.config.ah_application_uuid', null);
      const group = _.get(options, '_app.config.config.ah_site_group', null);
      const key = _.get(options, '_app.meta.key', null);
      const runScripts = _.get(options, '_app.config.config.build.run_scripts', true);
      const secret = _.get(options, '_app.meta.secret', null);

      // Determine Acquia CLI installation method (Phar release or build from source)
      const regexVersion = /^[0-9]+\.[0-9]+\.[0-9]+$/g; // Regex for specific version numbers (e.g., 1.2.3)
      let acliDownload = null;
      if (acliVersion === 'latest') {
        acliDownload = 'https://github.com/acquia/cli/releases/latest/download/acli.phar';
      } else if (acliVersion.match(regexVersion)) {
        acliDownload = `https://github.com/acquia/cli/releases/download/${acliVersion}/acli.phar`;
      }

      // Add build steps to install Acquia CLI to the appserver service
      if (acliDownload !== null) {
        // Download and install specified/latest Phar release
        options.services.appserver.build.push(...[
          `curl -OL ${acliDownload}`,
          'chmod +x acli.phar',
          'mv acli.phar /usr/local/bin/acli',
        ]);
      } else {
        // Build Acquia CLI from a specific git branch/tag
        const gitHubUrl = 'https://github.com/acquia/cli.git';
        options.services.appserver.build.push(...[
          'rm -rf /usr/local/cli',
          `cd /usr/local/ && git clone ${gitHubUrl} -b "${acliVersion}" && cd cli && composer install`,
          'ln -sf /usr/local/cli/bin/acli /usr/local/bin/acli',
        ]);
      }

      // Add build step to symlink Acquia CLI configuration directories
      options.services.appserver.build.push('/helpers/acquia-config-symlink.sh');
      // Add build step to run Acquia CLI build scripts, if enabled
      if (runScripts !== false) {
        options.services.appserver.build.push('cd /app && /usr/local/bin/acli pull:run-scripts -n');
      }

      // Add build step to log in with Acquia CLI if API key and secret are available
      if (secret && key) {
        options.services.appserver.build.push(`/usr/local/bin/acli auth:login -k "${key}" -s "${secret}" -n`);
      }

      // Set Acquia-specific environment variables for the appserver
      options.services.appserver.overrides.environment = {
        AH_SITE_UUID: appUuid,
        AH_SITE_GROUP: group,
        AH_SITE_ENVIRONMENT: 'LANDO', // Identify the environment as Lando
        ACLI_DB_HOST: 'database', // Direct acli to the Lando database service
        ACLI_DB_USER: 'acquia', // Standard Acquia recipe DB credentials
        ACLI_DB_PASSWORD: 'acquia',
        ACLI_DB_NAME: 'acquia',
      };

      // Mount the Acquia settings.inc file to allow Lando to mimic Acquia environment details
      // This assumes `options.confDest` is set correctly by a parent builder or Lando core.
      const settingsMount = `${options.confDest}/acquia-settings.inc:/var/www/site-php/${group}/${group}-settings.inc`;
      options.services.appserver.overrides.volumes.push(settingsMount);

      // Conditionally add Memcached service if `options.cache` is true
      if (options.cache) {
        options.services.cache = {type: 'acquia-memcached:1', portforward: true, mem: 64};
      }

      // Conditionally add MailHog service if `options.inbox` is true
      if (options.inbox) {
        options.services.inbox = {type: 'acquia-mailhog:v1.0.0', portforward: true, hogfrom: ['appserver']};
        // Set up proxy for MailHog UI access
        options.proxy.inbox = [`inbox.${options.app}.${options._app._config.domain}`];
      }

      // Define Lando tooling: acli, pull, and push commands
      options.tooling = {
        'acli': {
          service: 'appserver',
          description: 'Run the Acquia acli command',
          cmd: 'acli',
        },
        'pull': getAcquiaPull({key, secret, account, appUuid}, keys),
        'push': getAcquiaPush({key, secret, account, appUuid}, keys),
      };

      // Call the parent constructor with the fully processed options
      super(id, options);
    }
  },
};
