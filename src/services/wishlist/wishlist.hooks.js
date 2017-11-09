

// type = 1  ====> wishlist
// type = 2  ====> cart 


let r = require('rethinkdb')
let connection;
let config = require("config")
r.connect({
  host: config.get("rethinkdb").servers[0].host,
  port: config.get("rethinkdb").servers[0].port,
  db: config.get("rethinkdb").db
}, function(err, conn) {
  if (err) throw err;
  connection = conn
})


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => ifItemAlreadyExist(hook)
    ],
    update: [],
    patch: [],
    remove: [
      //hook => deleteItem(hook),
      hook => deleteWishlistItem(hook)
    ]
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

ifItemAlreadyExist = async hook =>  {
  let table = decide_database_table(hook.data.type);
  await r.table(table)
  .filter(r.row("sku").eq(hook.data.sku).and(r.row("type").eq(hook.data.type)).and(r.row("supplier_id").eq(hook.data.supplier_id)))
  .run(connection , function(error , cursor){
    if (error) throw error;
    cursor.toArray(function(err, result) {
      if (err) throw err;
      if(result.length > 0){
        hook.result="item already exist";
      }else{
        hook.data.createdAt = new Date();
      }
  });
  })
}

deleteWishlistItem = async hook => {
  let table = decide_database_table(hook.params.query.type);
  console.log(table);
  if(table == false) {
    hook.result = {status:400, message: "type is invalid. Please select type 1 for wislist and type 2 for cart"}
  }else {
    await r.table(table)
    .filter(r.row('sku').eq(hook.params.query.sku).and(r.row("type").eq(parseInt(hook.params.query.type))).and(r.row("supplier_id").eq(parseInt(hook.params.query.supplier_id))))
    .delete({return_changes : true})
    .run(connection, function(error, result){
      if (error){
        hook.result = error
      }else if(result.deleted == 0){
        hook.result = {status : 204 ,  message:"couldn't find the product with provided values for deleting"};
      }else{
        result.status = 200;
        hook.result = result
      }
    })
  }
}

decide_database_table = (data) => {
  if (data == 1){
    return "wishlist"
  }else if (data == 2){
    return "cart";
  }else{
    return false;
  }
}