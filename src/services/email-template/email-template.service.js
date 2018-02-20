// Initializes the `email-template` service on path `/email-template`
const createService = require('feathers-rethinkdb');
const hooks = require('./email-template.hooks');
const filters = require('./email-template.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'email_template',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/email-template', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('email-template');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
