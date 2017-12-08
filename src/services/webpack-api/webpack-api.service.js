// Initializes the `webpackAPI` service on path `/webpack-api`
const createService = require('./webpack-api.class.js');
const hooks = require('./webpack-api.hooks');
const filters = require('./webpack-api.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'webpack-api',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/webpack-api', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('webpack-api');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
