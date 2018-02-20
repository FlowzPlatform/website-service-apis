var rp = require('request-promise');
const config = require("config");
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
    all: [
      hook => before_all_service(hook)
    ],
    find: [],
    get: [],
    create: [
      hook => beforeCreateRequestInfo(hook)
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

function beforeCreateRequestInfo(hook){
    return new Promise ((resolve,reject) => {
        let obj = [];
        // getProductDetailById(hook.data.form_data.product_id,hook.data.product_api_url,this.apiHeaders.authorization).
        // then(function(result,err){
            // if(result.hits.hits.length > 0){
            if(hook.data.product_data != null){
              let productInfo = [];
              // productInfo.push(result.hits.hits[0]._source);
              productInfo.push(hook.data.product_data)
              if(hook.data.user_detail._id != undefined){
                  var user_id = hook.data.user_detail._id;
                  var guest_info = null;
              }else{
                var user_id = null;
                var guest_info = hook.data.guest_user_detail;
              }
              obj.push({
                  userId: user_id,
                  instruction: hook.data.form_data.note,
                  productId: hook.data.product_id,
                  productInfo: productInfo,
                  commentInfo:null,
                  supplierId: hook.data.product_data.supplier_id, //result.hits.hits[0]._source.supplier_id,
                  // supplierName: result.hits.hits[0]._source.supplier_info.company,
                  supplierName: hook.data.product_data.supplier_info.supplier_name,
                  culture: hook.data.culture,
                  createAt: new Date(),
                  updatedAt: null,
                  deletedAt: null,
                  createdUid:hook.data.user_detail._id,
                  deletedUid: null,
                  guestUserInfo:guest_info,
                  website_id: hook.data.website_id,
                  website_name: hook.data.websiteName,
                  owner_id: hook.data.owner_id
              });
              // console.log("&&&",hook.data.product_data);
              hook.data = obj
              resolve(hook)
            }else{
              resolve("Product data not found.");
              // throw errors.NotFound(new Error('Product data not found.'));
            }
    })
}

var product_detail = {
  getProductDetailById: function(productId,productApi,token){
    // console.log("++",productApi+"?_id="+productId);
    return rp({
      method: 'GET',
      uri: productApi+"?_id="+productId,
      headers: {'User-Agent': 'Request-Promise','vid': token},
      json: true
    });
  }
}

function getProductDetailById(productId,productApi,token) {
  return product_detail.getProductDetailById(productId,productApi,token);
}

function before_all_service(hook) {
   module.exports.apiHeaders = this.apiHeaders;
}
