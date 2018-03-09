// Initializes the `branch-list` service on path `/branch-list`
const createService = require('./branch-list.class.js');
const hooks = require('./branch-list.hooks');
const filters = require('./branch-list.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'branch-list',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/branch-list', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('branch-list');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
