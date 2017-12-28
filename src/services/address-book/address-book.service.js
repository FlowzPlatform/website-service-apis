// Initializes the `address-book` service on path `/address-book`
const createService = require('feathers-rethinkdb');
const hooks = require('./address-book.hooks');
const filters = require('./address-book.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'userAddressBook',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/address-book', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('address-book');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
