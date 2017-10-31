const assert = require('assert');
const app = require('../../src/app');

describe('\'imageUpload\' service', () => {
  it('registered the service', () => {
    const service = app.service('image-upload');

    assert.ok(service, 'Registered the service');
  });
});
