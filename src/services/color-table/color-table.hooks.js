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
  if(hook.data.hexcode == undefined){
  var res
  await axios({
    method : 'GET',
    // url : 'http://api.flowzcluster.tk/auth/api/userdetails',
    url : protocol + '://api.' + domainKey + '/auth/api/userdetails',
    strictSSL: false,
    headers: {
        "Authorization" : apiHeaders.authorization
    }
 })
 .then(function (response) {
    res = response.data.data
    //  resolve(response)
  })
  .catch(function (error) {
    console.log("error",error)
    //  resolve({"code" : 401 })
  });

  let UserEmail = res.email;
  let subscriptionId = hook.data.subscriptionId;
  let websitename = hook.data.websitename;
  let filename = hook.data.file.filename;
  let url;
  let folder1 = 'swatch/crm/'+ UserEmail +'/'+subscriptionId +'/'+websitename


  await axios({
    method: 'post',
    // url: 'https://api.flowzcluster.tk/crm/cloudinaryupload',
    url: protocol + '://api.' + domainKey +'/crm/cloudinaryupload',
    data:  {
      "file" : hook.data.file,
      "folder" : folder1
    }

  }).then(function (res) {
    url = res.data.secure_url
})
hook.data.file.url = url;
  }
}


patchdata = async hook =>{
  if(hook.data.hexcode == undefined){
  var res
  await axios({
    method : 'GET',
    // url : 'http://api.flowzcluster.tk/auth/api/userdetails',
    url : protocol + '://api.' + domainKey + '/auth/api/userdetails',
    strictSSL: false,
    headers: {
        "Authorization" : apiHeaders.authorization
    }
 })
 .then(function (response) {
    res = response.data.data
    //  resolve(response)
  })
  .catch(function (error) {
    console.log("error",error)
    //  resolve({"code" : 401 })
  });

  let UserEmail = res.email;
  let subscriptionId = hook.data.subscriptionId;
  let websitename = hook.data.websitename;
  let filename = hook.data.file.filename;
  let url;
  var folder1 = 'swatch/crm/'+ UserEmail +'/'+subscriptionId +'/'+websitename

  await axios({
    method: 'post',
    // url: 'https://api.flowzcluster.tk/crm/cloudinaryupload',
    url: protocol + '://api.' + domainKey +'/crm/cloudinaryupload',
    data:  {
      "file" : hook.data.file,
      "folder" : folder1
    }

  }).then(function (res) {
    url = res.data.secure_url
})

hook.data.file.url = url;
  }
}
