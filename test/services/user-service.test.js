const assert = require('assert');
const app = require('../../src/app');

describe('\'userService\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-service');

    assert.ok(service, 'Registered the service');
  });
});
