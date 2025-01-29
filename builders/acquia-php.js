'use strict';

const path = require('path');
const landoPhpPath = path.join(__dirname, '../node_modules/@lando/php');
const LandoPhp = require(`${landoPhpPath}/builders/php.js`);

/**
 * Acquia PHP builder class that extends Lando PHP builder.
 * Uses the bundled version of @lando/php plugin instead of user's version.
 *
 * @module acquia-php
 */
module.exports = {
  name: 'acquia-php',
  parent: '_appserver',
  /**
   * Builder function that returns the AcquiaPhp class
   * @param {Object} parent - Parent builder class
   * @return {Class} AcquiaPhp class extending LandoPhp builder
   */
  builder: parent => class AcquiaPhp extends LandoPhp.builder(parent, LandoPhp.config) {
    /**
     * Create a new AcquiaPhp instance
     * @param {string} id - Service id
     * @param {Object} options - Service options
     * @param {Object} factory - App factory instance
     */
    constructor(id, options = {}, factory) {
      super(id, options, factory);
    }
  },
};
