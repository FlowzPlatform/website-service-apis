const assert = require('assert');
const app = require('../../src/app');

describe('\'PublishJobqueue\' service', () => {
  it('registered the service', () => {
    const service = app.service('publish-jobqueue');

    assert.ok(service, 'Registered the service');
  });
});
