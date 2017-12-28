const config = require("config");
const errors = require('feathers-errors');

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
    find: [],
    get: [],
    create: [
      hook => beforeCreateAddressBook(hook)
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

 beforeCreateAddressBook = async hook => {
    //return new Promise ((resolve,reject) => {
        // r.table('userAddressBook').
        // console.log("==>>",hook.data.is_address);
        var is_default = 0;
        if(hook.data.address_type == "" || hook.data.address_type == undefined){
            throw errors.NotFound(new Error('Address type is missing.'));
        }
        else if (hook.data.is_address == undefined) {
            throw errors.NotFound(new Error('Address book or contact book detail is missing.'));
        }

        let isDefault = await checkIsDefault(hook);
        // console.log(">>>>>>>>>>>>>>>> " , isDefault)
        //hook.params.query.is_default = {'user_id':hook.data.user_id,'is_address':hook.data.is_address,'address_type':hook.data.address_type,'is_default':1}
        hook.data.created_at = new Date();
        hook.data.updated_at = null;
        hook.data.deleted_at = null;
        hook.data.created_uid = hook.data.user_id;
        hook.data.updated_uid = null;
        hook.data.deleted_uid = null;
        hook.data.is_default = isDefault;
        // console.log("--",hook.data);
        // resolve(hook);
  //  });
}

checkIsDefault = async hook =>{
  return new Promise ((resolve , reject) =>{
    console.log(hook.data)
    // hook.params.query.is_default = {'user_id':hook.data.user_id,'is_address':hook.data.is_address,'address_type':hook.data.address_type,'is_default':1}
    r.db('product_service_api').table('userAddressBook')
      .filter({'user_id':hook.data.user_id,'is_address':hook.data.is_address,'address_type':hook.data.address_type,'is_default':1})
      .run(connection , function(error , cursor){
          if (error) throw error;
          cursor.toArray(function(err, result) {
              if (err) throw err;
              if(result.length > 0){
                let data = 0;
                resolve(data)
              }else{
                let data = 1;
                resolve(data)
              }
          });
    })
  })
}
