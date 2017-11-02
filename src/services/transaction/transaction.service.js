// Initializes the `transaction` service on path `/transaction`
const createService = require('./transaction.class.js');
const hooks = require('./transaction.hooks');
const filters = require('./transaction.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'transaction',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/transaction', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('transaction');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
