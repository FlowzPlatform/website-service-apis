// Initializes the `get-directory-list` service on path `/get-directory-list`
const createService = require('./get-directory-list.class.js');
const hooks = require('./get-directory-list.hooks');
const filters = require('./get-directory-list.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'get-directory-list',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-directory-list', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('get-directory-list');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
