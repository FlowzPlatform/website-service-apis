const fs = require('fs');
let axios = require('axios');
let domainKey = 'localhost'
let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

if (process.env['domainKey'] !== undefined && process.env['domainKey'] !== '') {
  domainKey = process.env['domainKey']
}

if (process.env['NODE_ENV'] !== 'production') {
  protocol = 'http'
}

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
    find: [
      hook => beforeFindColorSwatch(hook)
    ],
    get: [],
    create: [
      hook => getdata(hook)
    ],
    update: [],
    patch: [
      hook => patchdata(hook)
    ],
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

beforeFindColorSwatch = async hook => {
    if(hook.params.query.colorname != "" && hook.params.query.colorname instanceof Array){
      let colorInputArray = hook.params.query.colorname;
      hook.params.query.colorname = { $in : hook.params.query.colorname }
    }
}


getdata = async hook =>{
  hook.data.created_at = new Date();
}



patchdata = async hook =>{
 
  hook.app.service('color-table').get(hook.id).then(res => {
   
    if (hook.data.file == undefined) {
      delete res.file
      res.hexcode = hook.data.hexcode
    }
    if (hook.data.hexcode == undefined) {
      delete res.hexcode
      res.file = hook.data.file
    }
    hook.app.service('color-table').update(hook.id, res).then(resp => {
      hook.result = resp.data
      // return hook;
    }).catch(errr => {
      // return errr;
    })
  }).catch(err => {
    // Return Error
    // return err;
  })

  // return new Promise ((resolve , reject) =>{
  //     r.table('color_table')
  //       .get(hook.id)
  //       .run(connection , function(error , cursor){
  //          if (error) throw error;
  //         //  if(hook.data.hexcode == undefined && cursor.hexcode != undefined){
  //         //    delete cursor.hexcode;
  //         //  }
  //         //  else if(hook.data.file == undefined && cursor.file != undefined){
  //         //     delete cursor.file;
  //         //  }
  //         //  cursor = hook
  //         //  console.log("+999999",cursor.data);
  //          resolve(hook)
  //       })
  // })
}
