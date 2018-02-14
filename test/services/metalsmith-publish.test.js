const assert = require('assert');
const app = require('../../src/app');

describe('\'metalsmith-publish\' service', () => {
  it('registered the service', () => {
    const service = app.service('metalsmith-publish');

    assert.ok(service, 'Registered the service');
  });
});
