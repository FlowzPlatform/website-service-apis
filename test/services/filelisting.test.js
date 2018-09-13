const assert = require('assert');
const app = require('../../src/app');

describe('\'filelisting\' service', () => {
  it('registered the service', () => {
    const service = app.service('filelisting');

    assert.ok(service, 'Registered the service');
  });
});
