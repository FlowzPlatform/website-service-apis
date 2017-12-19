const rethinkdbdash = require('rethinkdbdash');
const fs = require('fs');

module.exports = function () {
  const app = this;
  let config;
  let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null
  let rauth = process.env.rauth ? process.env.rauth : null
  console.log(rauth);
  console.log(process.env.cert);
  console.log(ssl);
  let aconfig = {
    "db": "product_service_api",
    "servers": [
      {
        "host": process.env.RDB_HOST,
        "port": process.env.RDB_PORT,
        "authKey": rauth,
        "ssl": ssl
      }
    ]
  }

  
  if(process.env.RDB_HOST)
    config = aconfig;
  else
    config = app.get('rethinkdb');

    console.log(config)
  const r = rethinkdbdash(config);
  const oldSetup = app.setup;
  app.set('rethinkdbClient', r);

  app.setup = function (...args) {
    let promise = Promise.resolve();

    // Go through all services and call the RethinkDB `init`
    // which creates the database and tables if they do not exist
    Object.keys(app.services).forEach(path => {
      const service = app.service(path);

      if (typeof service.init === 'function') {
        promise = promise.then(() => service.init());
      }
    });

    // Access the initialization if you want to run queries
    // right away that depend on the database and tables being created
    this.set('rethinkInit', promise);

    promise.then(() => oldSetup.apply(this, args));

    return this;
  };
};