// Initializes the `rateCalculation` service on path `/rate-calculation`
const createService = require('./rate-calculation.class.js');
const hooks = require('./rate-calculation.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rate-calculation', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('rate-calculation');

  service.hooks(hooks);
};
