// Initializes the `change-city-state-country` service on path `/change-city-state-country`
const createService = require('./change-city-state-country.class.js');
const hooks = require('./change-city-state-country.hooks');
const filters = require('./change-city-state-country.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'change-city-state-country',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/change-city-state-country', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('change-city-state-country');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
