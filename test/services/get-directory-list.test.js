const assert = require('assert');
const app = require('../../src/app');

describe('\'get-directory-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-directory-list');

    assert.ok(service, 'Registered the service');
  });
});
