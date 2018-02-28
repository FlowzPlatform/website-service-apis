// Initializes the `subscription-websites` service on path `/subscription-websites`
const createService = require('./subscription-websites.class.js');
const hooks = require('./subscription-websites.hooks');
const filters = require('./subscription-websites.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'subscription-websites',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/subscription-websites', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('subscription-websites');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
