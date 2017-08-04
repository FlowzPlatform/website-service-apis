// Initializes the `FlowsDirListing` service on path `/flows-dir-listing`
const createService = require('./flows-dir-listing.class.js');
const hooks = require('./flows-dir-listing.hooks');
const filters = require('./flows-dir-listing.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'flows-dir-listing',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/flows-dir-listing', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('flows-dir-listing');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
