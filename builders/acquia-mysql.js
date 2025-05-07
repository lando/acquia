'use strict';

/**
 * @file
 * Defines the Acquia MySQL service builder.
 * This builder extends the core Lando MySQL builder (from `@lando/mysql`).
 * Its primary purpose is to ensure that the Acquia plugin utilizes its
 * own bundled version of the MySQL service plugin, promoting stability and
 * version consistency for the Acquia development environment.
 */

const _ = require('lodash');
const path = require('path');
// Correctly resolve the path to the bundled @lando/mysql plugin
const landoMysqlPath = path.dirname(require.resolve('@lando/mysql/package.json'));
const LandoMysql = require(path.join(landoMysqlPath, 'builders', 'mysql.js'));

/**
 * Lando builder definition for the Acquia MySQL service.
 */
module.exports = {
  name: 'acquia-mysql',
  parent: '_service',
  /**
   * Builder function that returns the AcquiaMySQL class.
   * @param {Function} parent The parent class this builder extends (typically a Service base class).
   * @return {Function} The AcquiaMySQL class, which extends the Lando MySQL builder.
   */
  builder: parent => class AcquiaMySQL extends LandoMysql.builder(parent, LandoMysql.config) {
    /**
     * Constructs a new AcquiaMysql service instance.
     * This class ensures that the Acquia MySQL service uses the plugin's bundled dependency if applicable,
     * or provides a consistent integration point for MySQL within the Acquia recipe.
     *
     * @param {string} id The unique identifier for this service instance.
     * @param {object} [options] Service-specific configuration options.
     * The constructor specifically passes `{services: _.set({}, options.name)}` as the third argument
     * to the super constructor, which might be a requirement of the LandoMySQL builder.
     */
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    }
  },
};
