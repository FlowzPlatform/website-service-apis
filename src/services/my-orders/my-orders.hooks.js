const fs = require('fs');

let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

const config = require("config");
const table = 'my_orders';
let axios = require('axios');

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
    create: [
      hook => afterSubmitOrder(hook)
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

findAllOrders = async hook => {
  if(hook.params.query.owner_id == undefined &&  hook.params.query.setting_id == undefined &&  hook.params.query.website_id == undefined &&  hook.params.query.user_id == undefined)
  {
    hook.result = {status:400, message: "Please pass user id or owner id or setting id or website_id"}
  }

  hook.params.query.$sort = { created_at: -1}
  // else{
  //   await r.table(table)
  //   .filter(r.row("user_id").eq(hook.params.query.user_id).and(r.row("website_id").eq(hook.params.query.website_id)))
  //   .orderBy(r.desc('created_at'))
  //   .run(connection , function(error , cursor){
  //     if (error) throw error;
  //     cursor.toArray(function(err, result) {
  //       if (err) throw err;
  //       hook.result = {data:result,total: result.length};
  //
  //   });
  //   })
  // }
}

async function beforeSubmitOrder(hook){
  return  new Promise ((resolve , reject) =>{
      // console.log("hook",hook);
        r.table("my_orders").filter({'website_id':hook.data.website_id}).count()
          .run(connection , async function(error , cursor){
              if (error) throw error;
              let count = cursor + 1;
              // console.log("count",count);
              let currentDate = new Date();
              let website = hook.data.websiteName
              hook.data.order_id = website.substr(0, 3)+'-'+currentDate.getFullYear()+'-'+count
              hook.data.created_at = currentDate;
              // console.log("hook",hook);
              resolve(hook)
          })
  })
}

afterSubmitOrder = async hook =>  {
  if(hook.data.id != undefined)
  {
    await axios({
      method : 'POST',
      url : 'http://api.'+process.env.domainKey+'/crm/purchase-order',
      data: hook.result
    })
    .then(function (response) {
        // console.log("response------------------------",response)
      })
      .catch(function (error) {
        // console.log("error",error)
      });
      hook.result = hook.result;
  }
}