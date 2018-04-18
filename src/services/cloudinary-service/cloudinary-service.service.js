// Initializes the `cloudinary-service` service on path `/cloudinary-service`
const createService = require('./cloudinary-service.class.js');
const hooks = require('./cloudinary-service.hooks');
const filters = require('./cloudinary-service.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'cloudinary-service',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cloudinary-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cloudinary-service');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
