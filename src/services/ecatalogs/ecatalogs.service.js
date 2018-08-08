// Initializes the `ecatalogs` service on path `/ecatalogs`
const createService = require('feathers-rethinkdb');
const hooks = require('./ecatalogs.hooks');
const filters = require('./ecatalogs.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'ecatalogs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ecatalogs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ecatalogs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
