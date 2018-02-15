const assert = require('assert');
const app = require('../../src/app');

describe('\'delete-publish-files\' service', () => {
  it('registered the service', () => {
    const service = app.service('delete-publish-files');

    assert.ok(service, 'Registered the service');
  });
});
