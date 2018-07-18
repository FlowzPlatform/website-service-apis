// Initializes the `tagCategory` service on path `/tagCategory`
const createService = require('feathers-rethinkdb');
const hooks = require('./tag-category.hooks');
const filters = require('./tag-category.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'tag_category',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/tagCategory', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('tagCategory');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
