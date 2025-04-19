'use strict';

/**
 * @file
 * Defines the Acquia PostgreSQL service builder.
 * This builder extends the core Lando PostgreSQL builder (from `@lando/postgres`).
 * Its primary purpose is likely to ensure that the Acquia plugin utilizes its
 * own bundled version of the PostgreSQL service plugin, promoting stability and
 * version consistency for the Acquia development environment.
 */

const _ = require('lodash');
const path = require('path');
// Correctly resolve the path to the bundled @lando/postgres plugin
const landoPostgresPath = path.dirname(require.resolve('@lando/postgres/package.json'));
const LandoPostgres = require(path.join(landoPostgresPath, 'builders', 'postgres.js'));

/**
 * Lando builder definition for the Acquia PostgreSQL service.
 */
module.exports = {
  name: 'acquia-postgres',
  parent: '_service',
  /**
   * Builder function that returns the AcquiaPostgres class.
   * @param {Function} parent The parent class this builder extends (typically a Service base class).
   * @returns {Function} The AcquiaPostgres class, which extends the Lando Postgres builder.
   */
  builder: parent => class AcquiaPostgres extends LandoPostgres.builder(parent, LandoPostgres.config) {
    /**
     * Constructs a new AcquiaPostgres service instance.
     * This class ensures that the Acquia PostgreSQL service uses the plugin's bundled dependency if applicable,
     * or provides a consistent integration point for PostgreSQL within the Acquia recipe.
     *
     * @param {string} id The unique identifier for this service instance.
     * @param {object} [options] Service-specific configuration options.
     * The constructor specifically passes `{services: _.set({}, options.name)}` as the third argument
     * to the super constructor, which might be a requirement of the LandoPostgres builder.
     */
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    }
  },
};
