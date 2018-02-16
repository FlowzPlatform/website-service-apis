const assert = require('assert');
const app = require('../../src/app');

describe('\'change-city-state-country\' service', () => {
  it('registered the service', () => {
    const service = app.service('change-city-state-country');

    assert.ok(service, 'Registered the service');
  });
});
