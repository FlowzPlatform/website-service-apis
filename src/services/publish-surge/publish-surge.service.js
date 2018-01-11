// Initializes the `publishSurge` service on path `/publish-surge`
const createService = require('./publish-surge.class.js');
const hooks = require('./publish-surge.hooks');
const filters = require('./publish-surge.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'publish-surge',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/publish-surge', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('publish-surge');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
