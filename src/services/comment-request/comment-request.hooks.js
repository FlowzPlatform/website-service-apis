var rp = require('request-promise');
let errors = require('@feathersjs/errors') ;
let domainKey = 'localhost'
let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

if (process.env['domainKey'] !== undefined && process.env['domainKey'] !== '') {
  domainKey = process.env['domainKey']
}

if (process.env['NODE_ENV'] !== 'production') {
  protocol = 'http'
}
let axios = require("axios");
let _ = require('lodash');
let r = require('rethinkdb');
const config = require("config");

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFindComment(hook)
    ],
    get: [],
    create: [
      hook => beforeCreateComment(hook)
    ],
    update: [],
    patch: [
      // hook => beforePatchComment(hook)
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


async function beforeCreateComment(hook){
  let res = await validateUser(hook);
  // console.log("res",res);
  // res = JSON.parse(res);
  if(res.code == 401){
    throw new errors.NotAuthenticated('Invalid token');
  }else{
    let created_by1 = '';
    if(res.data.data.fullname !== undefined){
      created_by1 = res.data.data.fullname
    }
    else if(res.data.data.lastname !== undefined){
      created_by1 = res.data.data.firstname+res.data.data.lastname
    }
    else if(res.data.data.firstname != undefined && res.data.data.lastname == undefined){
      created_by1 = res.data.data.firstname
    }
    else{
      created_by1 = res.data.data.email
    }
    let response = await alreadyAvailable(hook , res)
    if(response.length >0){
      messageObj = {
        "message":hook.data.message,
        "created_at": new Date(),
        "created_by" : created_by1
      }
      response[0].message.push(messageObj)
      var res1 = await hook.app.service('comment-request').patch(response[0].id,{message: response[0].message}).then(resp => {
        return resp
      }).catch(errr => {
        return errr
      })

      hook.result = res1
      // hook.data = res1
    }else{
      messageObj = [{
        "message":hook.data.message,
        "created_at": new Date(),
        "created_by" : created_by1
      }]
      hook.data.message = messageObj
    }
  }

}

async function beforeFindComment(hook){
  let res = await validateUser(hook);
  if(res.code == 401){
    throw new errors.NotAuthenticated('Invalid token');
  }
}


validateUser =data =>{
  return new Promise((resolve , reject) =>{
    axios({
      method : 'GET',
      // url : 'http://api.flowzcluster.tk/auth/api/userdetails',
      url : protocol + '://api.' + domainKey + '/auth/api/userdetails',
      strictSSL: false,
      headers: {
          "Authorization" : apiHeaders.authorization
      }
    })
   .then(function (response) {
      resolve(response)
    })
    .catch(function (error) {
      resolve({"code" : 401 })
    });
  })
}


function alreadyAvailable(hook , res) {
  return new Promise((resolve , reject) =>{
    r.connect({
      host: config.get('rdb_host'),
      port: config.get("rdb_port"),
      db: config.get("rethinkdb").db
    }, function(err, conn) {
      connection = conn
    })
    r.table('comment_request')
    .filter({RequestId : hook.data.RequestId , Module:hook.data.Module}).run(connection , function(error , cursor){
      if(error){
      }else{
        cursor.toArray(function(err, results) {
          resolve(results)
      });
      }
    })
  })

}
