// Initializes the `PublishJobqueue` service on path `/publish-jobqueue`
const createService = require('feathers-rethinkdb');
const hooks = require('./publish-jobqueue.hooks');
const filters = require('./publish-jobqueue.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'publish_jobqueue',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/publish-jobqueue', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('publish-jobqueue');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
