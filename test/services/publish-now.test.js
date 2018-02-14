const assert = require('assert');
const app = require('../../src/app');

describe('\'publishNow\' service', () => {
  it('registered the service', () => {
    const service = app.service('publish-now');

    assert.ok(service, 'Registered the service');
  });
});
