// Initializes the `copyWebsite` service on path `/copy-website`
const createService = require('./copy-website.class.js');
const hooks = require('./copy-website.hooks');
const filters = require('./copy-website.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'copy-website',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/copy-website', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('copy-website');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
