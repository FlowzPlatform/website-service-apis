const assert = require('assert');
const app = require('../../src/app');

describe('\'rethinkservicecheck\' service', () => {
  it('registered the service', () => {
    const service = app.service('rethinkservicecheck');

    assert.ok(service, 'Registered the service');
  });
});
