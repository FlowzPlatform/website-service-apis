// Initializes the `rethinkservicecheck` service on path `/rethinkservicecheck`
const createService = require('feathers-rethinkdb');
const hooks = require('./rethinkservicecheck.hooks');
const filters = require('./rethinkservicecheck.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'rethinkservicecheck',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rethinkservicecheck', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('rethinkservicecheck');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
