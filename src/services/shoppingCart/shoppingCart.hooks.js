const fs = require('fs');

let ssl = process.env.cert ? { ca: fs.readFileSync(__dirname+process.env.cert) } : null;
let rauth = process.env.rauth ? process.env.rauth : null;

// type = 1  ====> wishlist
// type = 2  ====> cart
// type = 3  ====> compare

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
      hook => findAllShoppingKartData(hook)
    ],
    get: [],
    create: [
      hook => bypassDefaultInsert(hook)
    ],
    update: [],
    patch: [],
    remove: [
      //hook => deleteItem(hook),
      hook => deleteShoppingCartItem(hook)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => ifItemAlreadyExistBeforeCreate(hook)
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

 bypassDefaultInsert= async hook => {
  let table = decide_database_table(hook.data.type);
  // if(hook.data.type == 3){
  //   let addTo = await addToCompare(table , hook);
  //   hook.result = addTo;
  // }
  // else {
    await r.table(table)
    .filter(r.row("product_id").eq(hook.data.product_id).and(r.row("user_id").eq(hook.data.user_id)).and(r.row("type").eq(hook.data.type)).and(r.row("website_id").eq(hook.data.website_id)))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        if(result.length > 0 && hook.data.type !=2 && hook.data.type !='2'){
          hook.result = {status:400, data:result, message: "Item already exist"};
        }else{
          hook.data.createdAt = new Date();
        }
    });
    })
  // }
}

findAllShoppingKartData = async hook => {
  let table = decide_database_table(hook.params.query.type);
  if(table == false) {
    hook.result = {status:400, message: "type is invalid. Please select type 1 for wislist, type 2 for cart or type 3 for compared product"}
  }else if(table != false){
    await r.table(table)
    .filter(r.row("user_id").eq(hook.params.query.user_id).and(r.row("type").eq(hook.params.query.type)))
    .run(connection , function(error , cursor){
      if (error) throw error;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        hook.result = result;
      })
    })
  }
}


ifItemAlreadyExistBeforeCreate = async hook =>  {
  if(hook.result.status == 400) {
    hook.result = hook.result
  }
  else {
    hook.result = { data : hook.result, status : 200, message : "Item added successfully" }
  }
}

deleteShoppingCartItem = async hook => {
  // let table = decide_database_table(hook.params.query.type);
  // if(table == false) {
  //   hook.result = {status:400, message: "type is invalid. Please select type 1 for wislist, type 2 for cart, type 3 for compare"}
  // }
  // else if(table != false && hook.params.query.user_id == undefined){
  //   await r.table(table)
  //   .delete({return_changes : true})
  //   .run(connection , function(error , result){
  //     if (error){
  //       hook.result = error
  //     }else if(result.deleted == 0){
  //       hook.result = {status : 204 ,  message:"couldn't find the product with provided values for deleting"};
  //     }else{
  //       result.status = 200;
  //       result.message = "Item deleted successfully";
  //       hook.result = result
  //     }
  //   })
  // }
  // else {
  //   await r.table(table)
  //   .filter(r.row("type").eq(hook.params.query.type).and(r.row("user_id").eq(hook.params.query.user_id)).and(r.row("id").eq(hook.params.query.id)))
  //   .delete({return_changes : true})
  //   .run(connection, function(error , result){
  //     if (error){
  //       hook.result = error
  //     }else if(result.deleted == 0){
  //       hook.result = {status : 204 ,  message:"couldn't find the product with provided values for deleting"};
  //     }else{
  //       result.status = 200;
  //       result.message = "Item deleted successfully";
  //       hook.result = result
  //     }
  //   })
  // }
}


// addToCompare =  (table , hook) =>{
//   return new Promise(function (resolve , reject){
//   let data = {user_id : hook.data.user_id,compared_product : [{product_id : hook.data.product_id, type : 3}]}

//   r.db("product_service_api")
//   .table(table)
//   .filter(r.row('user_id').eq(hook.data.user_id))
//   .run(connection ,  function (err , cursor){
//     if (err) throw err;
//     cursor.toArray( function  (err, result) {
//             if (err) throw err;
//              if(result.length == 0)
//              {
//               hook.data.createdAt = new Date();
//                r.table(table)
//               .insert(data , {return_changes : true})
//               .run(connection ,  function(error , result){
//                 if (error)
//                 {
//                   resolve( error)
//                 } else
//                 {
//                   resolve( result)
//                 }
//               })
//             }else if(result[0].compared_product.length > 0 && result[0].compared_product.length < limitOfCompareProduct){
//               r.db("product_service_api").table("compare")
//               .filter(r.row('compared_product').contains(function(product)
//               {
//                 return product('product_id').eq(hook.data.product_id);
//                       }).and(r.row('user_id').eq(hook.data.user_id)))
//               .run(connection , function(err , cursor){
//                 if (err) {
//                   resolve(err)
//                 }else{
//                   cursor.toArray( function  (err, result) {
//                     if (err) throw err;
//                     if(result.length > 0){
//                       if(result[0].compared_product.length >= 1){
//                         resolve ("item already exist")
//                       }
//                     } else
//                     {
//                       r
//                       .table(table)
//                       .filter({"user_id" : hook.data.user_id})
//                       .update({
//                         compared_product: r.row('compared_product')
//                         .append({user_id : hook.data.product_id, type : 3, user_id : hook.data.user_id})
//                       }, {return_changes : true})
//                       .run(connection ,  function (err , result){
//                         if (err){
//                           resolve( err)
//                         } else {
//                           resolve( result)
//                         }
//                       })
//                     }

//                   })

//                 }

//               })
//             }else if(result[0].compared_product.length >= limitOfCompareProduct){
//               resolve( "Adding more than "+limitOfCompareProduct+" items in compared list is not allowed")
//             }
//         });
//   })
// })
// }

decide_database_table = (data) => {
  if (data == 1){
    return "wishlist"
  }else if (data == 2){
    return "wishlist"
    //return "cart";
  }else if (data == 3){
    return "wishlist"
    //return "compare";
  }else{
    return false;
  }
}
