const assert = require('assert');
const app = require('../../src/app');

describe('\'metalsmith\' service', () => {
  it('registered the service', () => {
    const service = app.service('metalsmith');

    assert.ok(service, 'Registered the service');
  });
});
