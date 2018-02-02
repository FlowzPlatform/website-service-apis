const assert = require('assert');
const app = require('../../src/app');

describe('\'ColorTable\' service', () => {
  it('registered the service', () => {
    const service = app.service('color-table');

    assert.ok(service, 'Registered the service');
  });
});
