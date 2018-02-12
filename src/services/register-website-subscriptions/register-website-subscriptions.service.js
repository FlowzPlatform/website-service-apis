// Initializes the `register-website-subscriptions` service on path `/register-website-subscriptions`
const createService = require('./register-website-subscriptions.class.js');
const hooks = require('./register-website-subscriptions.hooks');
const filters = require('./register-website-subscriptions.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'register-website-subscriptions',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/register-website-subscriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('register-website-subscriptions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
