const assert = require('assert');
const app = require('../../src/app');

describe('\'register-website-subscriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('register-website-subscriptions');

    assert.ok(service, 'Registered the service');
  });
});
