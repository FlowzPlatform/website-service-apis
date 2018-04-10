// Initializes the `comment_request` service on path `/comment-request`
const createService = require('feathers-rethinkdb');
const hooks = require('./comment-request.hooks');
const filters = require('./comment-request.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'comment_request',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/comment-request', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('comment-request');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
