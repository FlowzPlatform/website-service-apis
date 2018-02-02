// Initializes the `ColorTable` service on path `/color-table`
const createService = require('feathers-rethinkdb');
const hooks = require('./color-table.hooks');
const filters = require('./color-table.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'color_table',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/color-table', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('color-table');

  service.hooks(hooks);
console.log('Testing Data2');
  if (service.filter) {
    service.filter(filters);
  }
};
