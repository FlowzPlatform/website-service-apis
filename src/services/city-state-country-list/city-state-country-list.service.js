// Initializes the `city-state-country-list` service on path `/city-state-country-list`
const createService = require('./city-state-country-list.class.js');
const hooks = require('./city-state-country-list.hooks');
const filters = require('./city-state-country-list.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'city-state-country-list',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/city-state-country-list', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('city-state-country-list');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
