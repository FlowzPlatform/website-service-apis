// Initializes the `CopyJobqueuePublishFiles` service on path `/copy-jobqueue-publish-files`
const createService = require('./copy-jobqueue-publish-files.class.js');
const hooks = require('./copy-jobqueue-publish-files.hooks');
const filters = require('./copy-jobqueue-publish-files.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'copy-jobqueue-publish-files',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/copy-jobqueue-publish-files', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('copy-jobqueue-publish-files');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
