// Initializes the `website-users` service on path `/website-users`
const createService = require('feathers-rethinkdb');
const hooks = require('./website-users.hooks');
const filters = require('./website-users.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'website_users',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/website-users', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('website-users');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
