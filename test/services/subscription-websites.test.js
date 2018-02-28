const assert = require('assert');
const app = require('../../src/app');

describe('\'subscription-websites\' service', () => {
  it('registered the service', () => {
    const service = app.service('subscription-websites');

    assert.ok(service, 'Registered the service');
  });
});
