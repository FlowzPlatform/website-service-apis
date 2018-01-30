const assert = require('assert');
const app = require('../../src/app');

describe('\'request-quote\' service', () => {
  it('registered the service', () => {
    const service = app.service('request-quote');

    assert.ok(service, 'Registered the service');
  });
});
