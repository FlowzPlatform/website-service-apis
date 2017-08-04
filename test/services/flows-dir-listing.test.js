const assert = require('assert');
const app = require('../../src/app');

describe('\'FlowsDirListing\' service', () => {
  it('registered the service', () => {
    const service = app.service('flows-dir-listing');

    assert.ok(service, 'Registered the service');
  });
});
