const assert = require('assert');
const app = require('../../src/app');

describe('\'bannertype\' service', () => {
  it('registered the service', () => {
    const service = app.service('bannertype');

    assert.ok(service, 'Registered the service');
  });
});
