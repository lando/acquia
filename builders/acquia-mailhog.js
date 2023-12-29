'use strict';

const _ = require('lodash');
const LandoMailhog = require('@lando/mailhog/builders/mailhog.js');

// Builder
module.exports = {
  name: 'acquia-mailhog',
  parent: '_service',
  builder: (parent, config) => class AcquiaMailhog extends LandoMailhog.builder(parent, LandoMailhog.config) {
    constructor(id, options = {}) {
      super(id, options, {services: _.set({}, options.name)});
    };
  },
};
