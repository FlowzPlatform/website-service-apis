// Initializes the `productTags` service on path `/productTags`
const createService = require('feathers-rethinkdb');
const hooks = require('./product-tags.hooks');
const filters = require('./product-tags.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'product_tags',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/productTags', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('productTags');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
