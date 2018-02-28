const assert = require('assert');
const app = require('../../src/app');

describe('\'subscribed-websitesData\' service', () => {
  it('registered the service', () => {
    const service = app.service('subscribed-websites-data');

    assert.ok(service, 'Registered the service');
  });
});
