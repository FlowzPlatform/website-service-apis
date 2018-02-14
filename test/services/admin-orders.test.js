const assert = require('assert');
const app = require('../../src/app');

describe('\'admin-orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin-orders');

    assert.ok(service, 'Registered the service');
  });
});
