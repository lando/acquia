'use strict';

const _ = require('lodash');
const LandoPostgres = require('./../node_modules/@lando/postgres/builders/postgres.js');

// Builder
module.exports = {
  name: 'acquia-postgres',
  parent: '_service',
  builder: parent => class AcquiaPostgres extends LandoPostgres.builder(parent, LandoPostgres.config) {
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    }
  },
};
