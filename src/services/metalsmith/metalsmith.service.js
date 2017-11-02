// Initializes the `metalsmith` service on path `/metalsmith`
const createService = require('./metalsmith.class.js');
const hooks = require('./metalsmith.hooks');
const filters = require('./metalsmith.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'metalsmith',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/metalsmith', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('metalsmith');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
