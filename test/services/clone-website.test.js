const assert = require('assert');
const app = require('../../src/app');

describe('\'cloneWebsite\' service', () => {
  it('registered the service', () => {
    const service = app.service('clone-website');

    assert.ok(service, 'Registered the service');
  });
});
