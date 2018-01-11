const assert = require('assert');
const app = require('../../src/app');

describe('\'copyWebsite\' service', () => {
  it('registered the service', () => {
    const service = app.service('copy-website');

    assert.ok(service, 'Registered the service');
  });
});
