const assert = require('assert');
const app = require('../../src/app');

describe('\'branch-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('branch-list');

    assert.ok(service, 'Registered the service');
  });
});
