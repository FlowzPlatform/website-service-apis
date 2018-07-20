const assert = require('assert');
const app = require('../../src/app');

describe('\'ecatalog-category\' service', () => {
  it('registered the service', () => {
    const service = app.service('ecatalog-category');

    assert.ok(service, 'Registered the service');
  });
});
