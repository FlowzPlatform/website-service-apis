const assert = require('assert');
const app = require('../../src/app');

describe('\'ecatalogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('ecatalogs');

    assert.ok(service, 'Registered the service');
  });
});
