// Initializes the `configdata-history` service on path `/configdata-history`
const createService = require('feathers-rethinkdb');
const hooks = require('./configdata-history.hooks');
const filters = require('./configdata-history.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'configdata_history',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/configdata-history', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('configdata-history');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
