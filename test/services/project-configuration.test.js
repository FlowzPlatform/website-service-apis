const assert = require('assert');
const app = require('../../src/app');

describe('\'projectConfiguration\' service', () => {
  it('registered the service', () => {
    const service = app.service('project-configuration');

    assert.ok(service, 'Registered the service');
  });
});
