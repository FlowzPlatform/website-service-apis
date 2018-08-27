const assert = require('assert');
const app = require('../../src/app');

describe('\'gitlabservice\' service', () => {
  it('registered the service', () => {
    const service = app.service('gitlabservice');

    assert.ok(service, 'Registered the service');
  });
});
