const assert = require('assert');
const app = require('../../src/app');

describe('\'webpackAPI\' service', () => {
  it('registered the service', () => {
    const service = app.service('webpack-api');

    assert.ok(service, 'Registered the service');
  });
});
