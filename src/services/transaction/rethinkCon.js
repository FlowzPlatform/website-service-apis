"use strict";
var rethinkdb = require('rethinkdb');
var async = require('async');

class db {
constructor(dbParams) {

	  var self = this;
	  self.dbParams = dbParams;
	  console.log('11')
	  console.log(self.dbParams)
	  console.log('11')
  async.waterfall([
    function(callback) {
      self.connectToRethinkDbServer(function(err,connection) {
        if(err) {
      	  console.log(err)
          return callback(true,"Error in connecting RethinkDB");
        }
        callback(null,connection);
      });
    },
    function(connection,callback) {
  	  console.log(dbParams)
      rethinkdb.dbCreate(dbParams.dbname).run(connection,function(err, result) {
        if(err) {
          console.log("Database already created");
        } else {
          console.log("Created new database");
        }
        callback(null,connection);
      });
    },
    function(connection,callback) {
      rethinkdb.db(dbParams.dbname).tableCreate(dbParams.table_name).run(connection,function(err,result) {
        connection.close();
        if(err) {
          console.log("table already created");
        } else {
          console.log("Created new table");
        }
        callback(null,"Database is setup successfully");
      });
    }
  ],function(err,data) {
    console.log(data);
  });

  }
//  setupDb(dbParams) {}

  connectToRethinkDbServer(callback) {
    rethinkdb.connect({
      host : this.dbParams.host,
      port : this.dbParams.port
    }, function(err,connection) {
      callback(err,connection);
    });
  }

  connectToDb(callback) {
    rethinkdb.connect({
      host : this.dbParams.host,
      port : this.dbParams.port,
      db : this.dbParams.dbname
    }, function(err,connection) {
      callback(err,connection);
    });
  }
  
	// Get from CompareList/WishList/QuickQuoteList
	getAllRecordsByUserId(data,callback) {
	  var self = this;
		async.waterfall([
			function(callback) {
				self.connectToDb(function(err,connection) {
					if(err) {
						return callback(true,"Error connecting to database");
					}
					callback(null,connection);
				});
			},
			function(connection,callback) {
				if(typeof data.user_id != 'undefined' && typeof data.type != 'undefined')
				{
					console.log(data)
				rethinkdb.table(self.dbParams.table_name)
				.filter(rethinkdb.row("user_id").eq(parseInt(data.user_id)).and(rethinkdb.row("type").eq(parseInt(data.type))))
				.run(connection)
				.then(function(cursor){
					cursor.toArray(function(err, results) {
					    if (err) throw err;
					    
					    callback(null,results);
					});
				})
				.error(function(err){
					return callback(true,"Error occured while adding new message");
				})
			}
			else
			{
				console.log('00000000000000')
				return callback(true,"Please Give Proper Parameter,,Requeired('type' , 'user_id')");
			}
			
				
			}
			],function(err,data) {
			callback(err === null ? false : true,data);
		});
	};

	// Add in CompareList/WishList/QuickQuoteList
  insertRecord(Data,callback) {
	  var self = this;
		async.waterfall([
			function(callback) {
				self.connectToDb(function(err,connection) {
					if(err) {
						return callback(true,"Error connecting to database");
					}
					callback(null,connection);
				});
			},
			function(connection,callback) {
				console.log(typeof Data.sku)
				console.log(typeof Data.type)
				console.log(typeof Data.supplier_id)
				
				Data.type = parseInt(Data.type)
				Data.supplier_id = parseInt(Data.supplier_id)
				Data.user_id = parseInt(Data.user_id)

				if(typeof Data.sku != 'undefined' && typeof Data.type != 'undefined' && typeof Data.supplier_id != 'undefined')
				{
						rethinkdb.table(self.dbParams.table_name)
				.filter(rethinkdb.row("sku").eq(Data.sku).and(rethinkdb.row("type").eq(Data.type).and(rethinkdb.row("supplier_id").eq(Data.supplier_id))))
				.run(connection)
				.then(function(cursor){
					cursor.toArray(function(err, results) {
					    if (err) throw err;
					    if(results.length > 0){
					    	return callback(true,'Product is already Added');
					    }
					    callback(null,connection);
					});
				})
				.error(function(err){
					return callback(true,"Error occured while adding");
				})
				}
				else
				{
						return callback(true,'Please give proper parameters... Required("sku","type","supplier_id") ');
				}	
			},
			
			function(connection,callback) {
				rethinkdb.table(self.dbParams.table_name).insert(Data).run(connection,function(err,result) {
					connection.close();
					if(err) {
						return callback(true,"Error occured while Insert");
					}
					callback(null,result);
				});
			}
			],function(err,data) {
			callback(err === null ? false : true,data);
		});
	};

  // remove from CompareList/WishList/QuickQuoteList
	deleteRecord(id,Data,callback) {
	  var self = this;
		async.waterfall([
			// connection with RethinkDb 
			function(callback) {
				self.connectToDb(function(err,connection) {
					if(err) {
						return callback(true,"Error connecting to database");
					}
					callback(null,connection);
				});
			},
			// check product is Exist or Not for remove 
			function(connection,callback) {
				let table = rethinkdb.table(self.dbParams.table_name);
				// check get from id or Custom QueryParamaeter 
				if(id==null)
				{
					console.log(Data)
					if(typeof Data.user_id != 'undefined' && typeof Data.sku != 'undefined' && typeof Data.type != 'undefined' && typeof Data.supplier_id != 'undefined')
					{
						var filter = table.filter(rethinkdb.row("sku").eq(Data.sku).and(rethinkdb.row("type").eq(parseInt(Data.type)).and(rethinkdb.row("supplier_id").eq(parseInt(Data.supplier_id)).and(rethinkdb.row("user_id").eq(parseInt(Data.user_id))))))
					}
					else	
					{
						return callback(true,'Please give proper parameters ,required["type","sku","supplier_id","user_id"]');
					}
				//	= table.filter(rethinkdb.row("product_id").eq(parseInt(Data.product_id)).and(rethinkdb.row("type").eq(parseInt(Data.type))));	
				} 
				else
				{
					var filter = table.get(id);	
				}
				filter.run(connection)
				.then(function(cursor){
					// check get from id or Custom QueryParamaeter
					if(id==null)
					{
							cursor.toArray(function(err, results) {
					    if (err) throw err;
					    if(results.length == 0){
					    	 return callback(true,'Product is Not Found');
					    }
					    callback(null,connection);
						});
					}
					else
					{
						if(cursor != null)
						{
							callback(null,connection);
						}
						else
						{
							return callback(true,'Product is Not Found');	
						}
					}
				})
				.error(function(err){
					return callback(true,"Error occured while Delete");
				})
				
			},
			// remove if product is Exist
			function(connection,callback) {
				let table = rethinkdb.table(self.dbParams.table_name);
				if(id==null)
					{
						var filter = table.filter(rethinkdb.row("sku").eq(Data.sku).and(rethinkdb.row("type").eq(parseInt(Data.type)).and(rethinkdb.row("supplier_id").eq(parseInt(Data.supplier_id)).and(rethinkdb.row("user_id").eq(parseInt(Data.user_id))))));
					}
				else
					{
						var filter = table.get(id);	
					}


				filter.delete().run(connection,
						function(err, result) {
					        if (err) throw err;
					        console.log(result);
					        callback(null,result);
					    }
						);
				
//				rethinkdb.table(self.dbParams.table_name).delete(Data).run(connection,function(err,result) {
//					connection.close();
//					if(err) {
//						return callback(true,"Error occured while adding new message");
//					}
//					callback(null,result);
//				});
			}
			],function(err,data) {
			callback(err === null ? false : true,data);
		});
	}
  
  
}

module.exports = db;
