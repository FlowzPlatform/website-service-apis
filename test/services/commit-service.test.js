const assert = require('assert');
const app = require('../../src/app');

describe('\'commitService\' service', () => {
  it('registered the service', () => {
    const service = app.service('commit-service');

    assert.ok(service, 'Registered the service');
  });
});
