const fs = require('fs');

let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

const config = require("config");
const table = 'my_orders';

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
    find: [
      hook => findAllOrders(hook)
    ],
    get: [],
    create: [
      hook => beforeSubmitOrder(hook)
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

findAllOrders = async hook => {
  if(hook.params.query.owner_id == undefined &&  hook.params.query.setting_id == undefined &&  hook.params.query.website_id == undefined &&  hook.params.query.user_id == undefined) {
    hook.result = {status:400, message: "Please pass user id or owner id or setting id"}
  }else if(hook.params.query.user_id != undefined){
    await r.table(table)
    .filter(r.row("user_id").eq(hook.params.query.user_id))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        hook.result = result;
      })
    })
  }
  else if(hook.params.query.owner_id != undefined){
    await r.table(table)
    .filter(r.row("owner_id").eq(hook.params.query.owner_id))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        hook.result = result;
      })
    })
  }
  else if(hook.params.query.setting_id != undefined){
    await r.table(table)
    .filter(r.row("setting_id").eq(hook.params.query.setting_id))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        hook.result = result;
      })
    })
  }
  else if(hook.params.query.website_id != undefined){
    await r.table(table)
    .filter(r.row("website_id").eq(hook.params.query.website_id))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        hook.result = result;
      })
    })
  }
}

function beforeSubmitOrder(hook){
    hook.data.created_at = new Date();
}
