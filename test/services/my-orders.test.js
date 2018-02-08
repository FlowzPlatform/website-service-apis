const assert = require('assert');
const app = require('../../src/app');

describe('\'myOrders\' service', () => {
  it('registered the service', () => {
    const service = app.service('myOrders');

    assert.ok(service, 'Registered the service');
  });
});
