const assert = require('assert');
const app = require('../../src/app');

describe('\'address-book\' service', () => {
  it('registered the service', () => {
    const service = app.service('address-book');

    assert.ok(service, 'Registered the service');
  });
});
