'use strict';

/**
 * @file
 * This file defines the `lando pull` command integration for Acquia.
 * It handles fetching available Acquia environments, constructing interactive prompts
 * for selecting which components (code, database, files) to pull and from which environment,
 * and then executing the pull operation via the `acquia-pull.sh` script.
 */

// Modules
const _ = require('lodash');
const auth = require('./auth');
const API = require('./api');
const {getBestEnv} = require('./utils');

// Acquia
const api = new API();
/** @type {Array<object>} Caches the Acquia environments to avoid redundant API calls. */
let acquiaEnvs = [];

/**
 * Fetches Acquia environments for a given application UUID, using provided credentials.
 * Results are cached in the `acquiaEnvs` variable for subsequent calls within the same Lando operation.
 * Adds a 'none' option to the list of environments.
 *
 * @param {string} key The Acquia API client ID.
 * @param {string} secret The Acquia API client secret.
 * @param {string} uuid The Acquia application UUID.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of environment objects,
 * each with `name` (for display) and `value` (the environment ID), plus a 'none' option.
 */
const getEnvs = (key, secret, uuid) => {
  // If we already have it, return it
  if (!_.isEmpty(acquiaEnvs)) return acquiaEnvs;

  // Otherwise fetch them
  return api.auth(key, secret, true, true)
      .then(() => api.getEnvironments(uuid))
      .then(envs => _(envs)
          .map(env => _.merge({}, env, {name: env.displayName, value: env.name}))
          .value(),
      )
      .then(envs => {
        acquiaEnvs = envs;
        acquiaEnvs.push({'name': 'none', 'value': 'none'});
        return envs;
      });
};

/**
 * Base configuration object for the `lando pull` command specific to Acquia.
 * Defines the service to run on, description, command script, execution level,
 * I/O handling, and static command-line options.
 */
const task = {
  service: 'appserver',
  description: 'Pull code, database and/or files from Acquia',
  cmd: '/helpers/acquia-pull.sh',
  level: 'app',
  stdio: ['inherit', 'pipe', 'pipe'],
  options: {
    key: {
      describe: 'An Acquia API Client ID',
      passthrough: true,
      string: true,
      interactive: {
        type: 'list',
        message: 'Choose an Acquia key',
        choices: [],
        when: () => false,
        weight: 100,
      },
    },
    secret: {
      describe: 'An Acquia API Client Secret',
      passthrough: true,
      password: true,
    },
    code: {
      description: 'The environment from which to pull the code',
      passthrough: true,
      alias: ['c'],
      interactive: {
        type: 'list',
        message: 'Pull code from?',
        weight: 200,
      },
    },
    database: {
      description: 'The environment from which to pull the database',
      passthrough: true,
      alias: ['d'],
      interactive: {
        type: 'list',
        message: 'Pull database from?',
        weight: 300,
      },
    },
    files: {
      description: 'The environment from which to pull the files',
      passthrough: true,
      alias: ['f'],
      interactive: {
        type: 'list',
        message: 'Pull files from?',
        weight: 400,
      },
    },
  },
};

/**
 * Dynamically populates the interactive choices and default values for the `lando pull` command.
 * It fetches Acquia environments and sets them as choices for code, database, and files pull operations.
 * It also sets a default environment (usually 'dev').
 *
 * @param {object} task The base task configuration object.
 * @param {object} options An object containing necessary details like `key`, `secret`, and `appUuid`.
 * @returns {object} The modified task configuration object with dynamic interactive options and environment variables set.
 */
const getDefaults = (task, options) => {
  // Set interactive options
  const {key, secret, appUuid} = options;
  _.forEach(['code', 'database', 'files'], name => {
    task.options[name].interactive.choices = answers => {
      // Break up auth into parts
      const authParts = answers['key'].split(':');
      // If we have two parts then we need to separate, otherwise we assume
      // secret and key were passed in separately
      if (authParts.length === 2) {
        answers['key'] = authParts[0];
        answers['secret'] = authParts[1];
      }
      // Use the inputed creds, otherwise fallback
      const bestKey = _.get(answers, 'key', key);
      const bestSecret = _.get(answers, 'secret', secret);
      // Get ENVS
      return getEnvs(bestKey, bestSecret, appUuid);
    };
    // Dev seems like the safest default for pull
    task.options[name].interactive.default = getBestEnv(acquiaEnvs);
  });

  // Set the task env
  task.env = {LANDO_DB_USER_TABLE: 'users'};

  // Return
  return task;
};

/**
 * Constructs the complete configuration for the `lando pull` command for Acquia.
 * It merges the base task configuration, dynamically populated defaults (including environment choices),
 * and authentication options (interactive or non-interactive).
 *
 * @param {object} options An object containing necessary details: `key`, `secret`, `account` (label for key), and `appUuid`.
 * @param {Array<object>} [keys] An array of existing saved key objects for interactive auth prompts.
 * @returns {object} The complete command configuration object for `lando pull`.
 */
exports.getAcquiaPull = (options, keys = []) => {
  const {key, secret, account} = options;
  return _.merge({}, getDefaults(task, options), {options: auth.getAuthOptions(key, secret, account, keys)});
};
