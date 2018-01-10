// Initializes the `requestInfo` service on path `/request-info`
const createService = require('feathers-rethinkdb');
const hooks = require('./request-info.hooks');
const filters = require('./request-info.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  let r = require('rethinkdb')

  let config = require("config")
  let response;

  r.connect({
    host: config.get('rdb_host'),
    port: config.get("rdb_port"),
    db: config.get("rethinkdb").db
  }, function(err, conn) {
    if (err) throw err;
    connection = conn;
  })

  const options = {
    name: 'requestInfo',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/request-info', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('request-info');
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
