// Initializes the `emailSubscribers` service on path `/emailSubscribers`
const createService = require('feathers-rethinkdb');
const hooks = require('./email-subscribers.hooks');
const filters = require('./email-subscribers.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'email_subscribers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/emailSubscribers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emailSubscribers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
