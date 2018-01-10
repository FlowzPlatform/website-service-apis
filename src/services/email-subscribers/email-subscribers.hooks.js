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

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => newsletterDefaultInsert(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

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

newsletterDefaultInsert= async hook => {
  await r.table("email_subscribers")
  .filter(r.row("email").eq(hook.data.email))
  .run(connection , function(error , cursor){
    if (error) throw error;
    cursor.toArray(function(err, result) {
      if (err) throw err;
      if(result.length > 0){
        hook.result = {status:400, data:result, message: "You have already subscribed for newsletter."};
      }else{
        hook.data.createdAt = new Date();
      }
  });
  })
}