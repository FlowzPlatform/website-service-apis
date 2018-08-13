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

let hb = require("handlebars");
let mjml = require("mjml");
let mailService = require("../../common/mail.js");

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
    create: [
	hook => afterRequestInfoCreate(hook)	
    ],
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
              let product_image_url = '';
	      let user_detail;
              // productInfo.push(result.hits.hits[0]._source);
              productInfo.push(hook.data.product_data)
              if(hook.data.user_detail._id != undefined){
                  var user_id = hook.data.user_detail._id;
		  user_detail = hook.data.user_detail;
                  var guest_info = null;
              }else{
                var user_id = null;
		user_detail = null;
                var guest_info = hook.data.guest_user_detail;
              }
              if(hook.data.product_image_url != undefined){
                  product_image_url = hook.data.product_image_url
              }
              obj.push({
                  userId: user_id,
		  userDetail: user_detail,
                  instruction: hook.data.instruction,
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
                  owner_id: hook.data.owner_id,
                  product_image_url: product_image_url
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

async function afterRequestInfoCreate(hook) {
  if(hook.data.id != undefined){
    let response = await hook.app.service("email-template").find({query: { slug: 'request-info' ,website_id:hook.data.website_id}});
    if(response.total != 0) {
        let data = hook.result;
        // data.product_image = data.product_description.product_image_url+""+data.product_description.product_name
        // console.log("++++++++++",data);
        let userEmail;
        if (hook.data.guestUserInfo != null) {
          userEmail = hook.data.guestUserInfo.email
        }
        else {
          userEmail = hook.data.userDetail.email
        }
        // let userEmail = hook.data.user_info.email;
        //let userEmail = 'divyesh2589@gmail.com';
        let mjmlsrc =  response.data[0].template_content;
        let subject =  response.data[0].subject;
        let fromEmail =  response.data[0].from;
        //let fromEmail =  'obsoftcare@gmail.com';

        hb.registerHelper({
          eq: function (v1, v2) {
              return v1 === v2;
          },
          ne: function (v1, v2) {
              return v1 !== v2;
          },
          lt: function (v1, v2) {
              return v1 < v2;
          },
          gt: function (v1, v2) {
              return v1 > v2;
          },
          lte: function (v1, v2) {
              return v1 <= v2;
          },
          gte: function (v1, v2) {
              return v1 >= v2;
          },
          and: function () {
              return Array.prototype.slice.call(arguments).every(Boolean);
          },
          or: function () {
              return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
          }
        });

        let template = hb.compile(mjmlsrc);
        let mjmlresult = template({ data: data });
        //console.log('mjmlresult', mjmlresult);
        let htmlOutput = mjml.mjml2html(mjmlresult).html;
        let messageId = await mailService.mailSend(userEmail,fromEmail,subject,htmlOutput);
    }
  }
}


function before_all_service(hook) {
   module.exports.apiHeaders = this.apiHeaders;
   hook.params.query.$sort = { createAt: -1}
}
