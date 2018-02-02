// Initializes the `saveMenu` service on path `/save-menu`
const createService = require('./save-menu.class.js');
const hooks = require('./save-menu.hooks');
const filters = require('./save-menu.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'save-menu',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/save-menu', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('save-menu');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
