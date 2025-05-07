'use strict';

/**
 * @file
 * Defines the Acquia MailHog service builder.
 * This builder extends the core Lando MailHog builder (from `@lando/mailhog`).
 * Its primary purpose is to ensure that the Acquia plugin utilizes its
 * own bundled version of the MailHog service plugin, promoting stability and
 * version consistency for the Acquia development environment.
 */

const _ = require('lodash');
const path = require('path');
// Correctly resolve the path to the bundled @lando/mailhog plugin
const landoMailhogPath = path.dirname(require.resolve('@lando/mailhog/package.json'));
const LandoMailhog = require(path.join(landoMailhogPath, 'builders', 'mailhog.js'));

/**
 * Lando builder definition for the Acquia MailHog service.
 */
module.exports = {
  name: 'acquia-mailhog',
  parent: '_service',
  /**
   * Builder function that returns the AcquiaMailhog class.
   * @param {Function} parent The parent class this builder extends (typically a Service base class).
   * @return {Function} The AcquiaMailhog class, which extends the Lando MailHog builder.
   */
  builder: parent => class AcquiaMailhog extends LandoMailhog.builder(parent, LandoMailhog.config) {
    /**
     * Constructs a new AcquiaMailhog service instance.
     * This class ensures that the Acquia MailHog service uses the plugin's bundled dependency if applicable,
     * or provides a consistent integration point for MailHog within the Acquia recipe.
     *
     * @param {string} id The unique identifier for this service instance.
     * @param {object} [options] Service-specific configuration options.
     * The constructor specifically passes `{services: _.set({}, options.name)}` as the third argument
     * to the super constructor, which might be a requirement of the LandoMailhog builder.
     */
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    }
  },
};
