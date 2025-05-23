'use strict';

/**
 * @file
 * This file defines the `lando push` command integration for Acquia.
 * It handles fetching available Acquia environments (excluding 'prod' for safety),
 * constructing interactive prompts for selecting which components (code, database, files)
 * to push and to which environment, and then executing the push operation via the `acquia-push.sh` script.
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
 * Filters out the 'prod' environment. Results are cached in the `acquiaEnvs` variable
 * for subsequent calls within the same Lando operation. Adds a 'none' option.
 *
 * @param {string} key The Acquia API client ID.
 * @param {string} secret The Acquia API client secret.
 * @param {string} uuid The Acquia application UUID.
 * @return {Promise<Array<object>>} A promise that resolves to an array of environment objects
 * (excluding 'prod'), each with `name` (for display) and `value` (the environment ID), plus a 'none' option.
 */
const getEnvs = (key, secret, uuid) => {
  // If we already have it, return it
  if (!_.isEmpty(acquiaEnvs)) return acquiaEnvs;

  // Otherwise fetch them
  return api.auth(key, secret, true, true)
    .then(() => api.getEnvironments(uuid))
    .then(envs => _(envs)
      .filter(env => (env.name !== 'prod'))
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
 * Base configuration object for the `lando push` command specific to Acquia.
 * Defines the service to run on, description, command script, execution level,
 * I/O handling, and static command-line options.
 */
const task = {
  service: 'appserver',
  description: 'Push code, database and/or files to Acquia',
  cmd: '/helpers/acquia-push.sh',
  level: 'app',
  stdio: ['inherit', 'pipe', 'pipe'],
  options: {
    key: {
      describe: 'An Acquia API Client ID',
      passthrough: true,
      string: true,
      interactive: {
        type: 'list',
        message: 'Choose an Acquia API Client ID',
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
      description: 'The environment to which the local code will be pushed',
      passthrough: true,
      alias: ['c'],
      interactive: {
        type: 'list',
        message: 'Push code to?',
        weight: 200,
      },
    },
    database: {
      description: 'The environment to which the local database will be pushed',
      passthrough: true,
      alias: ['d'],
      interactive: {
        type: 'list',
        message: 'Push database to?',
        weight: 300,
      },
    },
    files: {
      description: 'The environment to which local files will be pushed',
      passthrough: true,
      alias: ['f'],
      interactive: {
        type: 'list',
        message: 'Push files to?',
        weight: 400,
      },
    },
  },
};

/**
 * Dynamically populates the interactive choices and default values for the `lando push` command.
 * It fetches Acquia environments (excluding 'prod') and sets them as choices.
 * Defaults to 'none' for database and files, and the best available non-prod environment (e.g., 'dev') for code.
 *
 * @param {object} task The base task configuration object.
 * @param {object} options An object containing necessary details like `key`, `secret`, and `appUuid`.
 * @return {object} The modified task configuration object with dynamic interactive options and environment variables set.
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
    // None seems like the safest default for push
    task.options[name].interactive.default = 'none';
  });

  // Override the default so code puses to dev
  task.options.code.interactive.default = getBestEnv(acquiaEnvs);
  // Set the task env
  task.env = {LANDO_DB_USER_TABLE: 'users'};

  // Return
  return task;
};

/**
 * Constructs the complete configuration for the `lando push` command for Acquia.
 * It merges the base task configuration, dynamically populated defaults (including environment choices
 * and specific defaults for push), and authentication options (interactive or non-interactive).
 *
 * @param {object} options An object containing necessary details: `key`, `secret`, `account` (label for key), and `appUuid`.
 * @param {Array<object>} [keys] An array of existing saved key objects for interactive auth prompts.
 * @return {object} The complete command configuration object for `lando push`.
 */
exports.getAcquiaPush = (options, keys = []) => {
  const {key, secret, account} = options;
  return _.merge({}, getDefaults(task, options), {options: auth.getAuthOptions(key, secret, account, keys)});
};
