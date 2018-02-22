// Initializes the `request-quote` service on path `/request-quote`
const createService = require('feathers-rethinkdb');
const hooks = require('./request-quote.hooks');
const filters = require('./request-quote.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'request_quote',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/request-quote', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('request-quote');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
