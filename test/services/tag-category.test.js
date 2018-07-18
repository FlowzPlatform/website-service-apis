const assert = require('assert');
const app = require('../../src/app');

describe('\'tagCategory\' service', () => {
  it('registered the service', () => {
    const service = app.service('tagCategory');

    assert.ok(service, 'Registered the service');
  });
});
