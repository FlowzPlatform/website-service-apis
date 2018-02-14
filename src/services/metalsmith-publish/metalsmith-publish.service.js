// Initializes the `metalsmith-publish` service on path `/metalsmith-publish`
const createService = require('./metalsmith-publish.class.js');
const hooks = require('./metalsmith-publish.hooks');
const filters = require('./metalsmith-publish.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'metalsmith-publish',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/metalsmith-publish', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('metalsmith-publish');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
