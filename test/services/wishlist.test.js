const assert = require('assert');
const app = require('../../src/app');

describe('\'wishlist\' service', () => {
  it('registered the service', () => {
    const service = app.service('wishlist');

    assert.ok(service, 'Registered the service');
  });
});
