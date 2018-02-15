const assert = require('assert');
const app = require('../../src/app');

describe('\'userallproject\' service', () => {
  it('registered the service', () => {
    const service = app.service('userallproject');

    assert.ok(service, 'Registered the service');
  });
});
