const assert = require('assert');
const app = require('../../src/app');

describe('\'email-template\' service', () => {
  it('registered the service', () => {
    const service = app.service('email-template');

    assert.ok(service, 'Registered the service');
  });
});
