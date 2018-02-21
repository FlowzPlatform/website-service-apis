// Initializes the `delete-publish-files` service on path `/delete-publish-files`
const createService = require('./delete-publish-files.class.js');
const hooks = require('./delete-publish-files.hooks');
const filters = require('./delete-publish-files.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'delete-publish-files',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/delete-publish-files', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('delete-publish-files');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
