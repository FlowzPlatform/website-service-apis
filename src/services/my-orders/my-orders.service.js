// Initializes the `myOrders` service on path `/myOrders`
const createService = require('feathers-rethinkdb');
const hooks = require('./my-orders.hooks');
const filters = require('./my-orders.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'my_orders',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/myOrders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('myOrders');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
