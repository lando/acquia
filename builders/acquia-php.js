'use strict';

const path = require('path');
// Correctly resolve the path to the bundled @lando/php plugin
const landoPhpPath = path.dirname(require.resolve('@lando/php/package.json'));
const LandoPhp = require(path.join(landoPhpPath, 'builders', 'php.js')); // Assuming standard Lando plugin structure

/**
 * @file
 * Defines the Acquia PHP service builder.
 * This builder extends the core Lando PHP builder to ensure that the Acquia plugin
 * utilizes its own bundled version of the `@lando/php` plugin. This provides
 * stability and consistency for the Acquia environment, independent of other
 * PHP versions or configurations a user might have globally or in other Lando projects.
 *
 * @module acquia-php
 */
module.exports = {
  name: 'acquia-php',
  parent: '_appserver',
  /**
   * Builder function that returns the AcquiaPHP class.
   * @param {Function} parent The parent class this builder extends (typically a Service base class).
   * @returns {Function} The AcquiaPHP class, which extends the Lando PHP builder.
   */
  builder: parent => class AcquiaPHP extends LandoPhp.builder(parent, LandoPhp.config) {
    /**
     * Constructs a new AcquiaPHP service instance.
     * This class ensures that the Acquia PHP service uses the plugin's bundled `@lando/php` version.
     *
     * @param {string} id The unique identifier for this service instance.
     * @param {object} [options] Service-specific configuration options.
     * @param {object} factory The Lando application factory instance.
     */
    constructor(id, options = {}, factory) {
      super(id, options, factory);
    }
  },
};
