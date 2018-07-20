const assert = require('assert');
const app = require('../../src/app');

describe('\'flyerCategory\' service', () => {
  it('registered the service', () => {
    const service = app.service('flyer-category');

    assert.ok(service, 'Registered the service');
  });
});
