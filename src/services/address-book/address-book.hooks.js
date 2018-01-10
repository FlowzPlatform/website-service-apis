const config = require("config");
const errors = require('feathers-errors');
let rp = require('request-promise');
let r = require('rethinkdb')
let connection;
let response;
r.connect({
  host: config.get('rdb_host'),
  port: config.get("rdb_port"),
  db: config.get("rethinkdb").db
}, function(err, conn) {
  if (err) throw err;
  connection = conn
})
var axios = require('axios');

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [
      hook => beforeCreateAddressBook(hook)
    ],
    update: [],
    patch: [
      hook => beforPatchAddressBook(hook)
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

beforeFind = async hook => {
  if(hook.params.query.deleted_at == "false"){
      hook.params.query.deleted_at = false;
  }
  if(hook.params.query.email !=""){
    hook.params.query.email = {$search: hook.params.query.email}
  }
}

beforeCreateAddressBook = async hook => {
        if(hook.data.address_type == "" || hook.data.address_type == undefined){
            throw errors.NotFound(new Error('Address type is missing.'));
        }
        else if (hook.data.is_address == undefined) {
            throw errors.NotFound(new Error('Address book or contact book detail is missing.'));
        }
        let is_default = '1';
        let isDefault = await checkIsDefault(hook);

        if(isDefault.length > 0){
          is_default = '0';
        }

        hook.data.created_at = new Date();
        hook.data.updated_at = '';
        hook.data.deleted_at = false;
        hook.data.is_default = is_default;
}

checkIsDefault = async hook =>{
  return new Promise ((resolve , reject) =>{
    // console.log(hook.data)
    r.db('product_service_api').table('userAddressBook')
      .filter({'user_id':hook.data.user_id,'is_address':hook.data.is_address,'address_type':hook.data.address_type,'is_default':'1','deleted_at':false})
      .run(connection , function(error , cursor){
          if (error) throw error;
          cursor.toArray(function(err, result) {
              if (err) throw err;
              resolve(result)
          });
    })
  })
}


beforPatchAddressBook = async hook =>{
    return new Promise ((resolve , reject) =>{
      r.db('product_service_api').table('userAddressBook')
        .get(hook.id)
        .run(connection , async function(error , cursor){
           if (error) throw error;
           console.log("cursor.is_default",cursor.is_default);
           if(hook.data.deleted_at == undefined && cursor.is_default != '1')
           {
             let obj = '';
             let user_id = cursor.user_id;
             let is_address = cursor.is_address;
             let address_type = cursor.address_type;
              obj = {'data':{'user_id': user_id,'is_address': is_address,'address_type': address_type}}
              let isDefault = await checkIsDefault(obj);
              // console.log("isdefault",isDefault);
              if(isDefault.length > 0){
                  let oldDefaultObj = isDefault[0];
                  r.db('product_service_api').table('userAddressBook').get(oldDefaultObj.id).update({'is_default': "0",'updated_at':new Date()}).run(connection)
              }
           }
           hook.data.updated_at = new Date();
           resolve(hook)
        })
        // console.log("id==",hook.id);
    })
}

