// Initializes the `cloneWebsite` service on path `/clone-website`
const createService = require('./clone-website.class.js');
const hooks = require('./clone-website.hooks');
const filters = require('./clone-website.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'clone-website',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clone-website', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('clone-website');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
