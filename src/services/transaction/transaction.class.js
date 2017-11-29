var rethinkCon = require('./rethinkCon.js');
const fs = require('fs');
const config = require("config")
console.log("Rethnk HOST " , config.get('rdb_host'));
console.log("Rethnk PORT " , config.get('rdb_port'));

var dbConfig={
		host: config.get('rdb_host'),
		port: config.get('rdb_port'),
		dbname:'feathers_demo',
		table_name:'tbl_transaction'
	}

var successMsgArray={
	1 : 'successFully added in wishList',
	2 : 'successFully added in compareList',
	3 : 'successFully added in QuickQuoteList'
}
var deleteMsgArray={
	1 : 'successFully deleted in wishList',
	2 : 'successFully deleted in compareList',
	3 : 'successFully deleted in QuickQuoteList'
}

var dbObj = new rethinkCon(dbConfig);

var responseArr={};
/* eslint-disable no-unused-vars */

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
		console.log(params)
    return new Promise(function(resolve, reject) {
		  dbObj.getAllRecordsByUserId(params.query,function(err,result){
			  if(err){
				  responseArr.status='error';
				  responseArr.error_msg=result;
				  console.log('error')
				  console.log(result)
				  resolve(responseArr)
			  }else{
				  console.log(result)
				  resolve(result)
				  //return Promise.resolve("success")
			  }
			  
		  })
	  })  
  }

  get (id, params) {
    return new Promise(function(resolve, reject) {
		  dbObj.getAllRecordsByUserId(id,function(err,result){
			  if(err){
				  responseArr.status='error';
				  responseArr.error_msg=result;
				  console.log('error')
				  console.log(result)
				  resolve(responseArr)
			  }else{
				  console.log(result)
				  resolve(result)
				  //return Promise.resolve("success")
			  }
			  
		  })
	  })
  }

  create (data, params) {
		var responseArr={};
		data.createAt = new Date();

	  return new Promise(function(resolve, reject) {
		  dbObj.insertRecord(data,function(err,result){
			
			  if(err){
				  responseArr.status='error';
				  responseArr.error_msg=result;
				  console.log('error')
				  console.log(result)
				  resolve(responseArr)
			  }else{
				  responseArr.status='success';
				  responseArr.success_msg=successMsgArray[data.type]
				  console.log('success')
				  resolve(responseArr)
				  //return Promise.resolve("success")
			  }
			  
		  })
	  })  
//	  let error;
//	  dbObj.insertRecord(data,dbConfig,function(err,result){
//		  if(err){
//			  error = await 
//		  }
//	  })
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
	  var responseArr={};
	console.log(id);
	  
	  return new Promise(function(resolve, reject) {
		  dbObj.deleteRecord(id,params.query,function(err,result){
			  if(err){
				  responseArr.status='error';
				  responseArr.error_msg=result;
				  console.log('error')
				  console.log(result)
				  resolve(responseArr)
			  }else{
				  console.log('-------------------------')
				  console.log(result)
				  console.log('-------------------------')
				  responseArr.status='success';
				  responseArr.success_msg=deleteMsgArray[params.type];
				  console.log('success')
				  resolve(responseArr)
				  //return Promise.resolve("success")
			  }
			  
		  })
	  })  
//	  let error;
//	  dbObj.insertRecord(data,dbConfig,function(err,result){
//		  if(err){
//			  error = await 
//		  }
//	  })
  }
  
//  someFunction(data){
//	  return "anything"
//  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

function writeFile(data){
	try{
	    fs.writeFileSync('temp/', Data);
	}catch (e){
	    console.log("Cannot write file ", e);
	}
}
