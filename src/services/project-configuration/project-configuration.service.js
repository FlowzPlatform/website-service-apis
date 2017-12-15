// Initializes the `projectConfiguration` service on path `/project-configuration`
const createService = require('feathers-rethinkdb');
const hooks = require('./project-configuration.hooks');
const filters = require('./project-configuration.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'project_configuration',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/project-configuration', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('project-configuration');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
