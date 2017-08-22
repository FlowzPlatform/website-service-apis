const assert = require('assert');
const app = require('../../src/app');

describe('\'commitsListing\' service', () => {
  it('registered the service', () => {
    const service = app.service('commits-listing');

    assert.ok(service, 'Registered the service');
  });
});
