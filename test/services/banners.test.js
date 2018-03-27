const assert = require('assert');
const app = require('../../src/app');

describe('\'banners\' service', () => {
  it('registered the service', () => {
    const service = app.service('banners');

    assert.ok(service, 'Registered the service');
  });
});
