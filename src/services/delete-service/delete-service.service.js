// Initializes the `deleteService` service on path `/delete-service`
const createService = require('./delete-service.class.js');
const hooks = require('./delete-service.hooks');
const filters = require('./delete-service.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'delete-service',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/delete-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('delete-service');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
