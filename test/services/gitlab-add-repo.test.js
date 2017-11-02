const assert = require('assert');
const app = require('../../src/app');

describe('\'gitlabAddRepo\' service', () => {
  it('registered the service', () => {
    const service = app.service('gitlab-add-repo');

    assert.ok(service, 'Registered the service');
  });
});
