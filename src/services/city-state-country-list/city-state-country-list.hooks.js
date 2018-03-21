const config = require("config");
var mongoose = require("mongoose");
mongoose.connect(config.get('mongoDBConnection'));

var db = mongoose.connection;

// db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
//  console.log("Database Connection Succeeded."); /* Once the database connection has succeeded, the code in db.once is executed. */
});

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFindData1(hook)
    ],
    get: [],
    create: [],
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

beforeFindData1 = async hook => {
  let table = await databaseTable1(hook.params.query.type);
  if(table == false){
     throw errors.NotFound(new Error('type is missing.Type 1 is for country , type 2 is for state ad type 3 is for city'));
  }
  // console.log(table)
  let result = '';

  if(hook.params.query.id != null){
      result = await fetchDataById1(hook,table)
      hook.result = result
  }
  else{
    if(hook.params.query.type == 1){
        result = await fetchDatafromCountry1(hook,table)
        hook.result = result
    }
    if(hook.params.query.type == 2){
        result = await fetchDatafromState1(hook,table)
        hook.result = result
    }
    if(hook.params.query.type == 3){
        result = await fetchDatafromCity1(hook,table)
        hook.result = result
    }
  }
}

async function fetchDataById1(hook,table)
{
    return new Promise ((resolve , reject) =>{
      if(table == 'city')
      {
        var id = hook.params.query.id
      }
      else{
        var id = parseInt(hook.params.query.id)      
      }
      // console.log("id",id);
      
      db.collection(table).find( { id: id} ).toArray(function(err, items) {
        resolve(items[0])
      });
    })
}

async function fetchDatafromCountry1(hook,table)
{
    return new Promise ((resolve , reject) =>{
      db.collection(table).find( { country_code: { $in: hook.params.query.country_data } } ).sort({"_id":-1}).toArray(function(err, items) {
        resolve(items)
      });
    })
}

async function fetchDatafromState1(hook,table)
{
  return new Promise ((resolve , reject) =>{
    
           /* fetch data of city by state id and country id */
           if(hook.params.query.data_from == 'country_code'){
               let stateId = '';
               if(hook.params.query.country_id != ''){
                   countryId = parseInt(hook.params.query.country_id)
               }

               if(countryId != "")
               {
                db.collection("country").find( { id: { $in: [countryId] } } ).toArray(function(err, items) {
                  db.collection("state").find( { country_code: { $in: [items[0].country_code] } } ).sort({"state_name":1}).toArray(function(err, items) {
                    resolve(items)
                  })
                })
               }              
           }
       })
}

async function fetchDatafromCity1(hook,table)
{
  return new Promise ((resolve , reject) =>{
    
    if(hook.params.query.data_from == 'state_code'){
      let stateId = '';
      if(hook.params.query.state_id != ''){
          stateId = parseInt(hook.params.query.state_id)
      }
      if(stateId != "")
      {

        db.collection("state").find( { id: { $in: [stateId] } } ).toArray(function(err, items) {
          db.collection("city").find( { admin_code1: { $in: [items[0].state_code] } } ).sort({"city_name":1}).toArray(function(err, items) {
            resolve(items)
          })

        })
      }
      else{
        resolve(stateId)
      }
    } 
  })
}

databaseTable1 = (data) => {
  if (data == 1){
    return "country"
  }else if (data == 2){
    return "state"
  }else if (data == 3){
    return "city"
  }else{
    return false;
  }
}