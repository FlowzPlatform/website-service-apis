// Initializes the `website-configuration` service on path `/website-configuration`
const createService = require('feathers-rethinkdb');
const hooks = require('./website-configuration.hooks');
const filters = require('./website-configuration.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'website_configuration',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/website-configuration', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('website-configuration');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
