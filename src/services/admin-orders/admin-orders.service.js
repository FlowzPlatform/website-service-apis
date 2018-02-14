// Initializes the `admin-orders` service on path `/admin-orders`
const createService = require('feathers-rethinkdb');
const hooks = require('./admin-orders.hooks');
const filters = require('./admin-orders.filters');

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
  app.use('/admin-orders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('admin-orders');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
