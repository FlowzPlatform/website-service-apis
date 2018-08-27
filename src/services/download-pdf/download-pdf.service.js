// Initializes the `downloadPdf` service on path `/download-pdf`
const createService = require('./download-pdf.class.js');
const hooks = require('./download-pdf.hooks');
const filters = require('./download-pdf.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'download-pdf',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/download-pdf', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('download-pdf');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
