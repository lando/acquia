'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');

// Load the builder module directly to inspect config
const acquiaBuilder = require(path.resolve(__dirname, '..', 'builders', 'acquia.js'));

describe('database config', () => {
  it('should have mysql:5.7 as the default database in config', () => {
    expect(acquiaBuilder.config.database).to.equal('mysql:5.7');
  });
});
