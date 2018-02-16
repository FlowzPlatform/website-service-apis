// Initializes the `userallproject` service on path `/userallproject`
const createService = require('feathers-rethinkdb');
const hooks = require('./userallproject.hooks');
const filters = require('./userallproject.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'userallproject',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/userallproject', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('userallproject');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
