const assert = require('assert');
const app = require('../../src/app');

describe('\'emailSubscribers\' service', () => {
  it('registered the service', () => {
    const service = app.service('emailSubscribers');

    assert.ok(service, 'Registered the service');
  });
});
