const assert = require('assert');
const app = require('../../src/app');

describe('\'deleteService\' service', () => {
  it('registered the service', () => {
    const service = app.service('delete-service');

    assert.ok(service, 'Registered the service');
  });
});
