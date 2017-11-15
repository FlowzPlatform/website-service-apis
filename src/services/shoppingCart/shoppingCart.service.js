// Initializes the `shoppingCart` service on path `/shoppingCart`
const createService = require('feathers-rethinkdb');
const hooks = require('./shoppingCart.hooks');
const filters = require('./shoppingCart.filters');
let connection;

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  let r = require('rethinkdb')
  
  let config = require("config")
  let response;
  r.connect({
    host: config.get("rethinkdb").servers[0].host,
    port: config.get("rethinkdb").servers[0].port,
    db: config.get("rethinkdb").db
  }, function(err, conn) {
    if (err) throw err;
    connection = conn;
   
    r.db("product_service_api").tableList().contains('cart')
    .do(function(tableExists) {return r.branch(tableExists,{ dbs_created: 0 },r.tableCreate('cart'));
    }).run(connection , function(error , result){
      error ? console.log(error) : console.log(result)
    });

    r.db("product_service_api").tableList().contains('compare')
    .do(function(tableExists) {return r.branch(tableExists,{ dbs_created: 0 },r.tableCreate('compare'));
    }).run(connection , function(error , result){
      error ? console.log(error) : console.log(result)
    });
    
  })




  const options = {
    name: 'wishlist',
    Model,
    paginate
  };
  
  

  // Initialize our service with any options it requires
  app.use('/shoppingCart', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('shoppingCart');
  
  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
