// Initializes the `ecatalog-category` service on path `/ecatalog-category`
const createService = require('feathers-rethinkdb');
const hooks = require('./ecatalog-category.hooks');
const filters = require('./ecatalog-category.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'ecatalog_category',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ecatalog-category', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ecatalog-category');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
