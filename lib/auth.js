'use strict';

/**
 * @file
 * This file provides helper functions to generate command-line option configurations
 * for Acquia authentication, supporting both interactive and non-interactive modes.
 * It is used to gather Acquia API credentials (key and secret) from the user.
 */

// Modules
const _ = require('lodash');
const utils = require('./utils');

// Helper to get pantheon auth non-interactive options
/**
 * Generates configuration for interactive Acquia authentication prompts.
 * It provides options for selecting an existing saved key or entering a new key and secret.
 *
 * @param {Array<object>} [keys] An array of existing saved key objects.
 * Each object should have a `name` (for display) and `value` (the key itself or a combined key:secret string).
 * @returns {object} An object defining the interactive command-line options for `key`, `key-entry`, and `secret`.
 */
const getInteractiveOptions = (keys = []) => ({
  'key': {
    interactive: {
      choices: utils.getKeys(keys),
      when: () => !_.isEmpty(keys),
      weight: 100,
    },
  },
  'key-entry': {
    hidden: true,
    interactive: {
      name: 'key',
      type: 'input',
      message: 'Enter an Acquia API Client ID',
      when: answers => _.isEmpty(keys) || answers.key === 'more',
      validate: (input, answers) => {
        // If we end up here we likely need to ask for the secret as well
        if (answers['key'] === 'more') answers['needs-secret-entry'] = true;

        // @NOTE: this exists mostly to stealth add acquia-needs-secret-entry
        // but @TODO could actually validate the key as well
        return true;
      },
      weight: 110,
    },
  },
  'secret': {
    interactive: {
      type: 'password',
      message: 'Enter an Acquia API Client Secret',
      when: answers => {
        // If we are manually entering another key/secret pair
        if (answers['needs-secret-entry']) return answers['needs-secret-entry'];

        // Otherwise we only want to show this in a partial options pass in
        // eg lando init --source acquia --acquia-key my-key
        const authParts = answers['key'].split(':');
        if (authParts.length === 1) return true;

        // Otherwise i dont think we need to show this
        return false;
      },
      weight: 120,
    },
  },
});

// Helper to get pantheon auth non-interactive options
/**
 * Generates configuration for non-interactive Acquia authentication.
 * This is used when the key and secret are provided directly (e.g., via command-line flags or environment variables).
 *
 * @param {string} key The Acquia API client ID.
 * @param {string} secret The Acquia API client secret.
 * @param {string} email The email/label associated with the key, used for display purposes.
 * @returns {object} An object defining the non-interactive command-line options, pre-filled with the provided credentials.
 */
const getNonInteractiveOptions = (key, secret, email) => ({
  'key': {
    default: key,
    defaultDescription: email,
  },
  'secret': {
    default: secret,
    defaultDescription: '***',
  },
});

/*
 * Helper to build a pull command
 */
/**
 * Determines whether to return interactive or non-interactive authentication options.
 * If a key and secret are provided, it returns non-interactive options. Otherwise, it returns interactive options,
 * potentially pre-populated with a list of saved keys.
 *
 * @param {string|false} [key] The Acquia API client ID. If false, interactive mode is triggered for key input.
 * @param {string|false} [secret] The Acquia API client secret. If false (and key is also false or partial), interactive mode is triggered for secret input.
 * @param {string|false} [label] The label/email associated with the key, used for display in non-interactive mode.
 * @param {Array<object>} [keys] An array of existing saved key objects for interactive mode.
 * @returns {object} An object defining either interactive or non-interactive command-line options for Acquia authentication.
 */
exports.getAuthOptions = (key = false, secret = false, label = false, keys = []) => {
  if (key && secret) return getNonInteractiveOptions(key, secret, label);
  else return getInteractiveOptions(keys);
};
