// Initializes the `imageUpload` service on path `/image-upload`
const createService = require('./image-upload.class.js');
const hooks = require('./image-upload.hooks');
const filters = require('./image-upload.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'image-upload',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/image-upload', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('image-upload');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
