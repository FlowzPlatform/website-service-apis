const assert = require('assert');
const app = require('../../src/app');

describe('\'website-configuration\' service', () => {
  it('registered the service', () => {
    const service = app.service('website-configuration');

    assert.ok(service, 'Registered the service');
  });
});
