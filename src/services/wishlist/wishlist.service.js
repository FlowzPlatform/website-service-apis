// Initializes the `wishlist` service on path `/wishlist`
const createService = require('feathers-rethinkdb');
const hooks = require('./wishlist.hooks');
const filters = require('./wishlist.filters');


module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'wishlist',
    Model,
    paginate
  };
  
  

  // Initialize our service with any options it requires
  app.use('/wishlist', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('wishlist');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
