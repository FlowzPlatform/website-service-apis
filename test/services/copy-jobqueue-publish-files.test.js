const assert = require('assert');
const app = require('../../src/app');

describe('\'CopyJobqueuePublishFiles\' service', () => {
  it('registered the service', () => {
    const service = app.service('copy-jobqueue-publish-files');

    assert.ok(service, 'Registered the service');
  });
});
