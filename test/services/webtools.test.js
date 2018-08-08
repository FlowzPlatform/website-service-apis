const assert = require('assert');
const app = require('../../src/app');

describe('\'webtools\' service', () => {
  it('registered the service', () => {
    const service = app.service('webtools');

    assert.ok(service, 'Registered the service');
  });
});
