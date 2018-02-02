<<<<<<< HEAD
const fs = require('fs');

let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

// type = 1  ====> wishlist
// type = 2  ====> cart
// type = 3  ====> compare

let limitOfCompareProduct = 5;
const config = require("config");
let r = require('rethinkdb')
let connection;
let response;
r.connect({
  host: config.get('rdb_host'),
  port: config.get("rdb_port"),
  authKey: rauth,
  ssl: ssl,
  db: config.get("rethinkdb").db
}, function(err, conn) {
  if (err) throw err;
  connection = conn
})
=======

>>>>>>> c532316e9df663a6511c59d5fc4f643606619756

module.exports = {
  before: {
    all: [],
<<<<<<< HEAD
    find: [
      hook => beforeFindColorSwatch(hook)
    ],
=======
    find: [],
>>>>>>> c532316e9df663a6511c59d5fc4f643606619756
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

<<<<<<< HEAD

=======
>>>>>>> c532316e9df663a6511c59d5fc4f643606619756
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
<<<<<<< HEAD


beforeFindColorSwatch = async hook => {

    if(hook.params.query.colorname != "" && hook.params.query.colorname instanceof Array){
      let colorInputArray = hook.params.query.colorname;
      hook.params.query.colorname = { $in : hook.params.query.colorname }
    }

}
=======
>>>>>>> c532316e9df663a6511c59d5fc4f643606619756
