// Initializes the `shippingEstimator` service on path `/shipping-estimator`
const createService = require('./shipping-estimator.class.js');
const hooks = require('./shipping-estimator.hooks');
const filters = require('./shipping-estimator.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'shipping-estimator',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/shipping-estimator', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('shipping-estimator');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
