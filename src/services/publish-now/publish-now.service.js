// Initializes the `publishNow` service on path `/publish-now`
const createService = require('./publish-now.class.js');
const hooks = require('./publish-now.hooks');
const filters = require('./publish-now.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'publish-now',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/publish-now', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('publish-now');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
