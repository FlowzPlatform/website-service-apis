// Initializes the `Jobqueue` service on path `/jobqueue`
const createService = require('./jobqueue.class.js');
const hooks = require('./jobqueue.hooks');
const filters = require('./jobqueue.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'jobqueue',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/jobqueue', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('jobqueue');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
