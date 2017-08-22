// Initializes the `commitService` service on path `/commit-service`
const createService = require('./commit-service.class.js');
const hooks = require('./commit-service.hooks');
const filters = require('./commit-service.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'commit-service',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/commit-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('commit-service');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
