const assert = require('assert');
const app = require('../../src/app');

describe('\'configdata-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('configdata-history');

    assert.ok(service, 'Registered the service');
  });
});
