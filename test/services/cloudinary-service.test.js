const assert = require('assert');
const app = require('../../src/app');

describe('\'cloudinary-service\' service', () => {
  it('registered the service', () => {
    const service = app.service('cloudinary-service');

    assert.ok(service, 'Registered the service');
  });
});
