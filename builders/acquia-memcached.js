'use strict';

/**
 * @file
 * Defines the Acquia Memcached service builder.
 * This builder extends the core Lando Memcached builder (from `@lando/memcached`).
 * Its primary purpose is to ensure that the Acquia plugin utilizes its
 * own bundled version of the Memcached service plugin, promoting stability and
 * version consistency for the Acquia development environment.
 */

const _ = require('lodash');
const path = require('path');
// Correctly resolve the path to the bundled @lando/memcached plugin
const landoMemcachedPath = path.dirname(require.resolve('@lando/memcached/package.json'));
const LandoMemcached = require(path.join(landoMemcachedPath, 'builders', 'memcached.js'));

/**
 * Lando builder definition for the Acquia Memcached service.
 */
module.exports = {
  name: 'acquia-memcached',
  parent: '_service',
  /**
   * Builder function that returns the AcquiaMemcached class.
   * @param {Function} parent The parent class this builder extends (typically a Service base class).
   * @returns {Function} The AcquiaMemcached class, which extends the Lando Memcached builder.
   */
  builder: parent => class AcquiaMemcached extends LandoMemcached.builder(parent, LandoMemcached.config) {
    /**
     * Constructs a new AcquiaMemcached service instance.
     * This class ensures that the Acquia Memcached service uses the plugin's bundled dependency if applicable,
     * or provides a consistent integration point for Memcached within the Acquia recipe.
     *
     * @param {string} id The unique identifier for this service instance.
     * @param {object} [options] Service-specific configuration options.
     * The constructor specifically passes `{services: _.set({}, options.name)}` as the third argument
     * to the super constructor, which might be a requirement of the LandoMemcached builder.
     */
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    }
  },
};
