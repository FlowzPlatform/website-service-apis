const assert = require('assert');
const app = require('../../src/app');

describe('\'city-state-country-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('city-state-country-list');

    assert.ok(service, 'Registered the service');
  });
});
