// Initializes the `gitlabservice` service on path `/gitlabservice`
const createService = require('./gitlabservice.class.js');
const hooks = require('./gitlabservice.hooks');

module.exports = function () {
  
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gitlabservice', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('gitlabservice');

  service.hooks(hooks);
};
