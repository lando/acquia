'use strict';

/**
 * @file
 * This file defines the base Lando builder for Acquia recipes.
 * It provides common configurations for services (appserver, database),
 * tooling (Composer, Drush, DB CLIs), and default file handling necessary
 * to emulate an Acquia environment locally.
 */

// Modules
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const utils = require('../lib/utils.js');
const warnings = require('../lib/warnings.js');

// "Constants"
/** Default Drush 8 version to use. */
const DRUSH8 = '8.4.10';
/** Default Drush 7 version to use (typically for older PHP versions). */
const DRUSH7 = '7.4.0';

/**
 * Default tooling definitions for Acquia recipes.
 * Includes configurations for Composer, database import/export, and PHP CLI.
 * @type {object}
 */
const toolingDefaults = {
  'composer': {
    service: 'appserver',
    cmd: 'composer --ansi',
  },
  'db-import <file>': {
    service: ':host',
    description: 'Imports a dump file into a database service',
    cmd: '/helpers/sql-import.sh',
    user: 'root',
    options: {
      'host': {
        description: 'The database service to use',
        default: 'database',
        alias: ['h'],
      },
      'no-wipe': {
        description: 'Do not destroy the existing database before an import',
        boolean: true,
      },
    },
  },
  'db-export [file]': {
    service: ':host',
    description: 'Exports database from a database service to a file',
    cmd: '/helpers/sql-export.sh',
    user: 'root',
    options: {
      host: {
        description: 'The database service to use',
        default: 'database',
        alias: ['h'],
      },
      stdout: {
        description: 'Dump database to stdout',
      },
    },
  },
  'php': {
    service: 'appserver',
    cmd: 'php',
  },
};

/**
 * Configuration for the MySQL command-line interface.
 * @type {object}
 */
const mysqlCli = {
  service: ':host',
  description: 'Drops into a MySQL shell on a database service',
  cmd: 'mysql -uroot',
  options: {
    host: {
      description: 'The database service to use',
      default: 'database',
      alias: ['h'],
    },
  },
};
/**
 * Configuration for the PostgreSQL (psql) command-line interface.
 * @type {object}
 */
const postgresCli = {
  service: ':host',
  description: 'Drops into a psql shell on a database service',
  cmd: 'psql -Upostgres',
  user: 'root',
  options: {
    host: {
      description: 'The database service to use',
      default: 'database',
      alias: ['h'],
    },
  },
};

/**
 * Determines the database type (e.g., 'mysql', 'postgres') based on Lando app configuration.
 *
 * @param {object} options The Lando recipe/service options.
 * @return {string} The database type string (e.g., 'mysql:8.0', 'postgres:13', defaults to 'mysql').
 */
const getDatabaseType = options => {
  return _.get(options, '_app.config.services.database.type', options.database) ?? 'mysql';
};

/**
 * Determines and verifies default configuration files (e.g., for vhosts, database) based on options.
 * Modifies `options.defaultFiles` in place if a Nginx vhost or specific MySQL versions are used,
 * and removes entries for files that don't exist at `options.confDest`.
 *
 * @param {object} options The Lando recipe options, including `via`, `database`, `defaultFiles`, and `confDest`.
 * @return {object} The modified `options.defaultFiles` object.
 */
const getConfigDefaults = options => {
  // Get the viaconf
  if (_.startsWith(options.via, 'nginx')) options.defaultFiles.vhosts = 'default.conf.tpl';

  // Get the default db conf
  const dbConfig = getDatabaseType(options);
  const database = _.first(dbConfig.split(':'));
  const version = _.last(dbConfig.split(':')).substring(0, 2);
  if (database.includes('mysql')) {
    if (version === '8.') {
      options.defaultFiles.database = 'mysql8.cnf';
    } else {
      options.defaultFiles.database = 'mysql.cnf';
    }
  }

  // Verify files exist and remove if it doesn't
  _.forEach(options.defaultFiles, (file, type) => {
    if (!fs.existsSync(`${options.confDest}/${file}`)) {
      delete options.defaultFiles[type];
    }
  });

  // Return
  return options.defaultFiles;
};

/**
 * Constructs the service definitions for the appserver and database based on recipe options.
 *
 * @param {object} options The Lando recipe options (e.g., `php` version, `database` type, `webroot`).
 * @return {object} An object containing definitions for `appserver` and `database` services.
 */
const getServices = options => ({
  appserver: {
    build_as_root_internal: options.build_root,
    build_internal: options.build,
    composer: options.composer,
    composer_version: options.composer_version,
    config: getServiceConfig(options),
    run_as_root_internal: options.run_root,
    ssl: true,
    type: `acquia-php:${options.php}`,
    via: options.via,
    xdebug: options.xdebug,
    webroot: options.webroot,
  },
  database: {
    config: getServiceConfig(options, ['database']),
    authentication: 'mysql_native_password',
    type: `acquia-${options.database}`,
    portforward: true,
    creds: {
      user: options.recipe,
      password: options.recipe,
      database: options.recipe,
    },
  },
});

/**
 * Provides the appropriate database CLI tooling configuration based on the database type.
 *
 * @param {string} database The database type string (e.g., 'mysql', 'postgres', 'mongo').
 * @return {object | undefined} An object containing the tooling definition for the specified database (e.g., `{mysql: mysqlCli}`), or undefined if not supported.
 */
const getDbTooling = database => {
  // Make sure we strip out any version number
  database = database.split(':')[0];
  // Choose wisely
  if (_.includes(['mysql'], database)) {
    return {mysql: mysqlCli};
  } else if (database === 'postgres') {
    return {psql: postgresCli};
  } else if (database === 'mongo') {
    return {mongo: {
      service: 'database',
      description: 'Drop into the mongo shell',
    }};
  }
};

/**
 * Gathers service-specific configuration file paths.
 * It checks for user-provided paths in `options.config` first, then falls back to default files
 * specified in `options.defaultFiles` located in `options.confDest`.
 *
 * @param {object} options The Lando recipe options.
 * @param {Array<string>} [types] The types of configuration to look for (e.g., 'php' for php.ini).
 * @return {object} An object mapping configuration types to their resolved file paths.
 */
const getServiceConfig = (options, types = ['php', 'server', 'vhosts']) => {
  const config = {};
  _.forEach(types, type => {
    if (_.has(options, `config.${type}`)) {
      config[type] = options.config[type];
    } else if (!_.has(options, `config.${type}`) && _.has(options, `defaultFiles.${type}`)) {
      if (_.has(options, 'confDest')) {
        config[type] = path.join(options.confDest, options.defaultFiles[type]);
      }
    }
  });
  return config;
};

/**
 * Merges default tooling with database-specific CLI tooling.
 *
 * @param {object} options The Lando recipe options, used to determine `options.database`.
 * @return {object} The complete tooling configuration object.
 */
const getTooling = options => _.merge({}, toolingDefaults, getDbTooling(options.database));


/*
 * Build Acquia base recipe
 */
/**
 * Lando builder definition for the Acquia base recipe.
 * This is intended to be extended by more specific Acquia recipe builders.
 * It sets up default configurations for PHP, database, web server, and common tooling like Drush and Composer.
 */
module.exports = {
  name: '_acquia-base',
  parent: '_recipe',
  /** Default configuration for the Acquia base recipe. */
  config: {
    /** @type {Array<string>} Array of shell commands to run during the build phase of the appserver. */
    build: [],
    /** @type {object} Composer requirements. Keys are package names, values are version constraints. */
    composer: {},
    /** @type {string} Source directory for default configuration files (e.g., php.ini, vhost templates). */
    confSrc: path.resolve(__dirname, '..', 'config'),
    /** @type {object} User-overrideable configuration file paths for services. */
    config: {},
    /** @type {string} Default database type and version (e.g., 'mysql:5.7', 'postgres:12'). */
    database: 'mysql',
    /** @type {object} Mapping of default configuration file names for different components. */
    defaultFiles: {
      php: 'php.ini',
    },
    /** @type {string} Default PHP version. */
    php: '7.2',
    /** @type {object} Default Drush tooling configuration. */
    tooling: {drush: {
      service: 'appserver',
    }},
    /** @type {string} Web server type ('apache' or 'nginx'). */
    via: 'apache',
    /** @type {string} Path to the webroot within the appserver. */
    webroot: '.',
    /** @type {boolean} Whether to enable Xdebug. */
    xdebug: false,
    /** @type {object} Proxy configuration. */
    proxy: {},
    /** @type {string|null} Custom Drush URI for DRUSH_OPTIONS_URI environment variable. */
    drush_uri: null,
  },
  /**
   * The builder function that returns the LandoAcquiaBase class.
   * @param {Function} parent The parent class this builder extends (_recipe).
   * @param {object} config The default configuration for this recipe.
   * @return {Function} The LandoAcquiaBase class.
   */
  builder: (parent, config) => class LandoAcquiaBase extends parent {
    /**
     * Constructor for the LandoAcquiaBase class.
     * Merges default and user-provided options, configures Drush installation (Composer or Phar),
     * sets up warnings for modern Drush versions, and defines legacy environment variables.
     *
     * @param {string} id The application instance ID.
     * @param {object} [options] User-provided options to override defaults.
     */
    constructor(id, options = {}) {
      options = _.merge({}, config, options);
      // Set the default drush version if we don't have it
      if (!_.has(options, 'drush')) options.drush = (options.php === '5.3') ? DRUSH7 : DRUSH8;

      // Figure out the drush situation
      if (options.drush !== false) {
        // Start by assuming a composer based install
        options.composer['drush/drush'] = options.drush;
        // Switch to phar based install if we can
        if (semver.valid(options.drush) && semver.major(options.drush) === 8) {
          delete options.composer['drush/drush'];
          options.build.unshift(utils.getDrush(options.drush, ['drush', '--version']));
        }
        // Attempt to set a warning if possible
        const coercedDrushVersion = semver.valid(semver.coerce(options.drush));
        if (!_.isNull(coercedDrushVersion) && semver.gte(coercedDrushVersion, '10.0.0')) {
          options._app.addWarning(warnings.drushWarn(options.drush));
        }
      }

      // Set legacy envars
      options.services = _.merge({}, options.services, {appserver: {overrides: {
        environment: {
          SIMPLETEST_BASE_URL: (options.via === 'nginx') ? 'https://appserver_nginx' : 'https://appserver',
          SIMPLETEST_DB: `mysql://${options.recipe}:${options.recipe}@database/${options.recipe}`,
        },
      }}});

      // Rebase on top of any default config we might already have
      options.defaultFiles = _.merge({}, getConfigDefaults(_.cloneDeep(options)), options.defaultFiles);
      options.services = _.merge({}, getServices(options), options.services);
      options.tooling = _.merge({}, getTooling(options), options.tooling);

      // Switch the proxy if needed
      if (!_.has(options, 'proxyService')) {
        if (_.startsWith(options.via, 'nginx')) options.proxyService = 'appserver_nginx';
        else if (_.startsWith(options.via, 'apache')) options.proxyService = 'appserver';
      }
      options.proxy = _.set(options.proxy, options.proxyService, [`${options.app}.${options._app._config.domain}`]);

      // Set DRUSH_OPTIONS_URI based on drush_uri config or proxy settings
      let drushUri = options.drush_uri;
      if (!drushUri) {
        const proxyUrl = options.proxy[options.proxyService]?.[0];
        if (proxyUrl) {
          const proxyServiceSsl = options.services[options.proxyService]?.ssl;
          const ssl = proxyServiceSsl !== undefined ? proxyServiceSsl : options.services.appserver?.ssl;
          const protocol = ssl ? 'https' : 'http';
          // Include port if non-standard (e.g. proxy on 444 instead of 443)
          const ports = _.get(options, '_app._config.proxyLastPorts');
          let port = '';
          if (ports) {
            const activePort = ssl ? ports.https : ports.http;
            if (activePort && ((ssl && activePort != 443) || (!ssl && activePort != 80))) {
              port = `:${activePort}`;
            }
          }
          drushUri = `${protocol}://${proxyUrl}${port}`;
        }
      }
      if (drushUri) {
        options.services.appserver.overrides = options.services.appserver.overrides || {};
        options.services.appserver.overrides.environment = options.services.appserver.overrides.environment || {};
        options.services.appserver.overrides.environment.DRUSH_OPTIONS_URI = drushUri;
      }

      // Send downstream
      super(id, _.merge({}, config, options));
    }
  },
};
