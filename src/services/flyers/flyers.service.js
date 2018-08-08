// Initializes the `flyers` service on path `/flyers`
const createService = require('feathers-rethinkdb');
const hooks = require('./flyers.hooks');
const filters = require('./flyers.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'flyers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/flyers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('flyers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
