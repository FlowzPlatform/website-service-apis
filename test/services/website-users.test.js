const assert = require('assert');
const app = require('../../src/app');

describe('\'website-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('website-users');

    assert.ok(service, 'Registered the service');
  });
});
