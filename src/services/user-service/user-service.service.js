// Initializes the `userService` service on path `/user-service`
const createService = require('./user-service.class.js');
const hooks = require('./user-service.hooks');
const filters = require('./user-service.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'user-service',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/user-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('user-service');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
