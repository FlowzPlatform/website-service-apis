const assert = require('assert');
const app = require('../../src/app');

describe('\'change-country-state-city\' service', () => {
  it('registered the service', () => {
    const service = app.service('change-country-state-city');

    assert.ok(service, 'Registered the service');
  });
});
