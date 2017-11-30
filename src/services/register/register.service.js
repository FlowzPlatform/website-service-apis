// Initializes the `register` service on path `/register`
const createService = require('./register.class.js');
const hooks = require('./register.hooks');
const filters = require('./register.filters');
let config = require("config");




module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'register',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/register', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('register');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
