const assert = require('assert');
const app = require('../../src/app');

describe('\'flyers\' service', () => {
  it('registered the service', () => {
    const service = app.service('flyers');

    assert.ok(service, 'Registered the service');
  });
});
