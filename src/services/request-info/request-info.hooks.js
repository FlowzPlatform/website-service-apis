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
  // let response = await getProductDetailById(hook.data.form_data.product_id,hook.data.form_data.product_api_url);
    return new Promise ((resolve,reject) => {
        // console.log("&&&&&&&&&&&&&&&&",hook.data)
        // console.log(hook.data);
        let obj = [];
        getProductDetailById(hook.data.form_data.product_id,hook.data.product_api_url,this.apiHeaders.authorization).
        then(function(result,err){
            if(result.hits.hits.length > 0){
              let productInfo = [];
              productInfo.push(result.hits.hits[0]._source);
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
                  productId: hook.data.form_data.product_id,
                  productInfo: productInfo,
                  commentInfo:null,
                  supplierId: 5, //result.hits.hits[0]._source.supplier_id,
                  supplierName:result.hits.hits[0]._source.supplier_info.company,
                  culture: hook.data.culture,
                  createAt: new Date(),
                  updatedAt: null,
                  deletedAt: null,
                  createdUid:hook.data.user_detail._id,
                  deletedUid: null,
                  guestUserInfo:guest_info,
              });
              // console.log("Obj&&&&&",obj);
              hook.data = obj
              resolve(hook)
            }else{
              resolve("Product data not found.");
            }
        });
        // let productUrl = hook.data.product_api_url+hook.data.form_data.product_id;
    })
}

var product_detail = {
  getProductDetailById: function(productId,productApi,token){
    return rp({
      method: 'GET',
      uri: productApi+productId,
      headers: {'User-Agent': 'Request-Promise','Authorization': token},
      json: true
    });
  }
}

function getProductDetailById(productId,productApi,token) {
  return product_detail.getProductDetailById(productId,productApi,token);
}



// function getProductDetailById(productId,productApi){
//   let productUrl = productApi+productId;
//   var res;
//   var options = {
//     method: 'GET',
//     headers: {'User-Agent': 'Request-Promise','Authorization': this.apiHeaders.authorization},
//     json: true // Automatically parses the JSON string in the response
//   };
//
//   rp(productUrl,options)
//    .then(function (repos) {
//       //  res = repos.hits.hits[0]._source;
//       return repos.hits.hits[0]._source;
//    })
//    .catch(function (err) {
//       //  console.log('User', err);
//        return err;
//    });
// }

function before_all_service(hook) {
   module.exports.apiHeaders = this.apiHeaders;
}
