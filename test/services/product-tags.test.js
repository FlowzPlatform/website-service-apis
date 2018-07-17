const assert = require('assert');
const app = require('../../src/app');

describe('\'productTags\' service', () => {
  it('registered the service', () => {
    const service = app.service('productTags');

    assert.ok(service, 'Registered the service');
  });
});
