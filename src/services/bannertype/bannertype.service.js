// Initializes the `bannertype` service on path `/bannertype`
const createService = require('feathers-rethinkdb');
const hooks = require('./bannertype.hooks');
const filters = require('./bannertype.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'bannertype',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bannertype', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bannertype');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
