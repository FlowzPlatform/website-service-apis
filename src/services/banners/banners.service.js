// Initializes the `banners` service on path `/banners`
const createService = require('feathers-rethinkdb');
const hooks = require('./banners.hooks');
const filters = require('./banners.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'banners',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/banners', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('banners');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
