'use strict';

/**
 * @file
 * Provides utility functions for the Lando Acquia plugin.
 * This includes functions for reading/writing Acquia CLI configuration,
 * managing and formatting API keys, finding suitable environments,
 * and constructing commands for Drush phar installation.
 */

// Modules
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Reads the Acquia CLI YAML configuration file (default: .acquia-cli.yml)
 * and returns the `cloud_app_uuid`.
 *
 * @param {string} [file] Path to the Acquia CLI config file.
 * @returns {string|null} The cloud_app_uuid if found, otherwise null.
 */
exports.getAcliUuid = (file = '.acquia-cli.yml') => {
  if (fs.existsSync(file)) {
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    return data.cloud_app_uuid;
  }
  return null;
};

/**
 * Writes the `cloud_app_uuid` to the Acquia CLI YAML configuration file.
 * Only writes the file if it does not already exist.
 *
 * @param {string} uuid The cloud_app_uuid to write.
 * @param {string} [file] Path to the Acquia CLI config file.
 * @returns {boolean} True if the file was written, false otherwise (e.g., if it already existed).
 */
exports.writeAcliUuid = (uuid, file = '.acquia-cli.yml') => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, `cloud_app_uuid: ${uuid}\n`);
    return true;
  }
  return false;
};

/**
 * Retrieves Acquia keys and formats them for use as Inquirer choices.
 * Adds an "add a key" option to the list.
 *
 * @param {object} lando The Lando instance.
 * @returns {Array<object>} An array of Inquirer choice objects, each with `name` and `value` properties.
 */
exports.getAcquiaKeyChoices = lando => {
  const keys = exports.getAcquiaKeys(lando);
  return _(keys)
      .map(key => ({name: key.label, value: key.uuid, secret: key.secret}))
      .thru(keys => keys.concat([{name: 'add a key', value: 'more'}]))
      .value();
};

/**
 * Reads the Acquia cloud API configuration from the appserver container
 * (specifically from `/var/www/.acquia/cloud_api.conf` mapped to the host)
 * and returns the currently active key object.
 *
 * @param {object} lando The Lando instance.
 * @param {object} appConfig The Lando application configuration object.
 * @returns {object|null} The active key object if found, otherwise null.
 */
exports.getAcquiaKeyFromApp = (lando, appConfig) => {
  const file = path.join(lando.config.home, '.lando', 'config', appConfig.name, '.acquia', 'cloud_api.conf');
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const activeKey = data.acli_key;
    return _.find(data.keys, key => key.uuid === activeKey);
  }
  return null;
};

/**
 * Selects the "best" environment from a list of environments.
 * Prefers an environment named 'dev'. If not found, returns the first environment in the list.
 *
 * @param {Array<object>} [envs] An array of environment objects. Each object should have a `name` property.
 * @returns {object | undefined} The best environment object, or undefined if the input array is empty.
 */
exports.getBestEnv = (envs = []) => {
  // Try to get the dev environment
  const dev = _.find(envs, env => env.name === 'dev');
  // Return dev environment if we have it otherwise just use the first one
  return (dev) ? dev : _.first(envs);
};

/**
 * Reads and parses the `composer.json` file from the current working directory.
 *
 * @returns {object|null} The parsed composer.json object if the file exists, otherwise null.
 */
exports.getComposerConfig = () => {
  const file = path.join('composer.json');
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return null;
};

/**
 * Retrieves Acquia API keys stored on the host machine from the `~/.acquia/cloud_api.conf` file.
 *
 * @param {string} home The user's home directory path.
 * @returns {Array<object>} An array of key objects found in the configuration file. Each object is augmented with a `key` property (its original key in the config object).
 */
exports.getHostKeys = home => {
  // Path to acli conf
  const file = path.join(home, '.acquia', 'cloud_api.conf');
  // If no keyfile return empty
  if (!fs.existsSync(file)) return [];
  // Otherwise lets try to get some data
  const keys = _.get(JSON.parse(fs.readFileSync(file, 'utf8')), 'keys', []);
  // Loop through keys to merge in the key of the keys
  _.forEach(keys, (value, key) => value.key = key);
  // Return an array of keys
  return _.map(keys);
};

/**
 * Formats an array of key objects into Inquirer choices, suitable for prompting the user.
 * Combines `key.key` and `key.secret` into a single `value` string for the choice.
 * Adds an "add or refresh a key" option.
 *
 * @param {Array<object>} [keys] An array of key objects. Each should have `label`, `key`, and `secret` properties.
 * @returns {Array<object>} An array of Inquirer choice objects.
 */
exports.getKeys = (keys = []) => _(keys)
    .map(key => ({name: key.label, value: `${key.key}:${key.secret}`}))
    .thru(keys => keys.concat([{name: 'add or refresh a key', value: 'more'}]))
    .value();

/**
 * Merges multiple arrays of key objects, ensuring uniqueness by `uuid`,
 * and then sorts them by `label`.
 *
 * @param {...Array<object>} sources One or more arrays of key objects.
 * @returns {Array<object>} A single array of unique, sorted key objects.
 */
exports.sortKeys = (...sources) => _(_.flattenDeep(sources))
    .uniqBy('uuid')
    .orderBy('label')
    .value();

/**
 * Constructs a shell command string to download and install a specific version of Drush phar.
 *
 * @param {string} version The Drush version to download (e.g., '10.x', '11.x').
 * @param {string|boolean} status A command or condition to check after installation (e.g., 'drush status').
 * @returns {string} A shell command string for installing Drush.
 */
exports.getDrush = (version, status) => exports.getPhar(
    getDrushUrl(version),
    '/tmp/drush.phar',
    '/usr/local/bin/drush',
    status,
);

/**
 * Constructs a shell command string to download a file (typically a .phar) and move it to a destination.
 * Optionally includes a check command to run after the move.
 *
 * @param {string} url The URL to download the file from.
 * @param {string} src The temporary path to save the downloaded file.
 * @param {string} dest The final destination path for the file.
 * @param {string|Array<string>} [check] A command or array of commands to run as a check after installation.
 * @returns {string} A combined shell command string.
 */
exports.getPhar = (url, src, dest, check = 'true') => {
  // Arrayify the check if needed
  if (_.isString(check)) check = [check];
  // Phar install command
  const pharInstall = [
    ['curl', url, '-LsS', '-o', src],
    ['chmod', '+x', src],
    ['mv', src, dest],
    check,
  ];
  // Return
  return _.map(pharInstall, cmd => cmd.join(' ')).join(' && ');
};

/**
 * Constructs the download URL for a specific Drush phar version from GitHub releases.
 *
 * @param {string} version The Drush version (e.g., '10.6.2', '11.0.0').
 * @returns {string} The full URL to the Drush phar file.
 */
const getDrushUrl = version => `https://github.com/drush-ops/drush/releases/download/${version}/drush.phar`;
