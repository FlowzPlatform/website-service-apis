const config = require("config");
const errors = require('feathers-errors');
let _ = require('lodash');
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
    find: [
      hook => afterAddressFind(hook)
    ],
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

beforeFind = hook => {
    if(hook.params.query.deleted_at == "false"){
        hook.params.query.deleted_at = false;
    }

    if(hook.params.query.terms != undefined && hook.params.query.terms !=""){
      hook.params.address_type = hook.params.query.address_type;
      delete hook.params.query.address_type;
      hook.params.query.$or = [
        {
          email:  {
            $search : hook.params.query.terms
          }
        },
        {
          name: {
            $search : hook.params.query.terms
          }
        }
      ]
      delete hook.params.query.terms
    }
}

afterAddressFind = hook => {
  if(typeof hook.params.address_type != "undefined")
  {
    let finalArray = [];
    let finalCount = 0;
    for (let [key, d] of hook.result.data.entries() ) {
      let objArray = [];
    
      for (let [key1, d1] of d.address_type.entries() ) {
        let obj = {};
        obj['address_type'] = d1;
        objArray.push(obj);
      }
    
      let rs =_.filter(objArray, {'address_type':hook.params.address_type})
      if(rs.length>0)
      {
        finalCount++;
        finalArray.push(d)
      }
    }
    hook.result = {'total':finalCount,'data':finalArray}
  }
}

beforeCreateAddressBook = async hook => {
        if(hook.data.address_type == "" || hook.data.address_type == undefined){
            throw errors.NotFound(new Error('Address type is missing.'));
        }
        else if (hook.data.is_address == undefined) {
            throw errors.NotFound(new Error('Address book or contact book detail is missing.'));
        }

        let billing_default = '0';
        let shipping_default = '0';
        if(hook.data.address_type.includes("shipping")){
            shipping_default = '1'
            let isShipDefault = await checkIsDefault(hook,"shipping");
            if(isShipDefault.length > 0){
              shipping_default = '0'
            }
        }

        if(hook.data.address_type.includes("billing")){  
            billing_default = '1'
            let isBillingDefault = await checkIsDefault(hook,"billing");
            if(isBillingDefault.length > 0){
              billing_default = '0'
            }
        }
          
        hook.data.created_at = new Date();
        hook.data.updated_at = '';
        hook.data.deleted_at = false;
        hook.data.shipping_default = shipping_default;
        hook.data.billing_default = billing_default;
}

// checkIsDefault = async hook =>{
async function checkIsDefault(hook,address_type){
  return new Promise ((resolve , reject) =>{
    if(address_type == "shipping"){
        r.table('userAddressBook')
        // .filter({'user_id':hook.data.user_id,'is_address':hook.data.is_address,'address_type':hook.data.address_type,'is_default':'1','deleted_at':false,'website_id':hook.data.website_id})
        .filter({'user_id':hook.data.user_id,'is_address':hook.data.is_address, "shipping_default":'1','deleted_at':false,'website_id':hook.data.website_id})
          .run(connection , function(error , cursor){
              if (error) throw error;
              cursor.toArray(function(err, result) {
                  if (err) throw err;
                  resolve(result)
              });
        })
      }else{
          r.table('userAddressBook')
          .filter({'user_id':hook.data.user_id,'is_address':hook.data.is_address, "billing_default":'1','deleted_at':false,'website_id':hook.data.website_id})
            .run(connection , function(error , cursor){
                if (error) throw error;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    resolve(result)
                });
          })
      }
    })
}


beforPatchAddressBook = async hook =>{
    return new Promise ((resolve , reject) =>{
      r.table('userAddressBook')
        .get(hook.id)
        .run(connection , async function(error , cursor){
           if (error) throw error;
           if(hook.data.deleted_at == undefined )
           {
              let obj = '';
              let user_id = cursor.user_id;
              let is_address = cursor.is_address;
              let address_type = cursor.address_type;
              let website_id = cursor.website_id;
              obj = {'data':{'user_id': user_id,'is_address': is_address,'website_id':website_id}}
              let isDefault = null
              
              if(hook.data.billing_default != undefined ) {
                  isDefault = await checkIsDefault(obj,"billing");
                  if(isDefault.length > 0){
                    let oldDefaultObj = isDefault[0];
                    r.table('userAddressBook').get(oldDefaultObj.id).update({'billing_default': "0",'updated_at':new Date()}).run(connection)
                  }
              }
              if(hook.data.shipping_default != undefined ) {
                isDefault = await checkIsDefault(obj,"shipping");
                if(isDefault.length > 0){
                  let oldDefaultObj = isDefault[0];
                  r.table('userAddressBook').get(oldDefaultObj.id).update({'shipping_default': "0",'updated_at':new Date()}).run(connection)
                }
              }
              
           }

           hook.data.updated_at = new Date();
           resolve(hook)
        })
    })
}
