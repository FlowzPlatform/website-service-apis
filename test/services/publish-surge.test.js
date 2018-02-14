const assert = require('assert');
const app = require('../../src/app');

describe('\'publishSurge\' service', () => {
  it('registered the service', () => {
    const service = app.service('publish-surge');

    assert.ok(service, 'Registered the service');
  });
});
