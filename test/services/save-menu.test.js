const assert = require('assert');
const app = require('../../src/app');

describe('\'saveMenu\' service', () => {
  it('registered the service', () => {
    const service = app.service('save-menu');

    assert.ok(service, 'Registered the service');
  });
});
