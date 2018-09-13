// Initializes the `webpackApi` service on path `/filelisting`
const createService = require('./filelisting.class.js');
const hooks = require('./filelisting.hooks');
const filters = require('./filelisting.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'filelisting',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/filelisting', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('filelisting');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
