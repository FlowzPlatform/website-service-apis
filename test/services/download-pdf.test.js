const assert = require('assert');
const app = require('../../src/app');

describe('\'downloadPdf\' service', () => {
  it('registered the service', () => {
    const service = app.service('download-pdf');

    assert.ok(service, 'Registered the service');
  });
});
