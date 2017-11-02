const assert = require('assert');
const app = require('../../src/app');

describe('\'transaction\' service', () => {
  it('registered the service', () => {
    const service = app.service('transaction');

    assert.ok(service, 'Registered the service');
  });
});
