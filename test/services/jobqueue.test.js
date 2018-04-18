const assert = require('assert');
const app = require('../../src/app');

describe('\'Jobqueue\' service', () => {
  it('registered the service', () => {
    const service = app.service('jobqueue');

    assert.ok(service, 'Registered the service');
  });
});
