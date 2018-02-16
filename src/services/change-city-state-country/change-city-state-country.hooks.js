const config = require("config");
const errors = require('feathers-errors');
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

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFindData(hook)
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

beforeFindData = async hook => {
  let table = await databaseTable(hook.params.query.type);
  if(table == false){
     throw errors.NotFound(new Error('type is missing.Type 1 is for country , type 2 is for state ad type 3 is for city'));
  }
  let result = '';

  if(hook.params.query.id != null){
      result = await fetchDataById(hook,table)
      hook.result = result
  }
  else{
    if(hook.params.query.type == 1){
        result = await fetchDatafromCountry(hook,table)
        hook.result = result
    }
    if(hook.params.query.type == 2){
        result = await fetchDatafromState(hook,table)
        hook.result = result
    }
    if(hook.params.query.type == 3){
        result = await fetchDatafromCity(hook,table)
        hook.result = result
    }
  }
}

async function fetchDatafromCountry(hook,table)
{
    return new Promise ((resolve , reject) =>{
        if(hook.params.query.data_from == 'country_code'){
          // console.log("hook.params.query",hook.params.query.country_data);
          // console.log("table==>>",table);
          r.db('product_service_api').table(table)
          //r.table(table)
            .filter(function(fc){
                return r.expr(hook.params.query.country_data).contains(fc("country_code"))
              }).run(connection , function(error , cursor){
                    if (error) throw error;
                    cursor.toArray(function(err, result) {
                        if (err) throw err;
                        // console.log("result+++",result);
                        resolve(result)
                    });
              })
        }
    })
}

async function fetchDatafromState(hook,table)
{
    return new Promise ((resolve , reject) =>{
        /* fetch data of state by country id */
        if(hook.params.query.data_from == 'country_code'){
            let countryId = '';
            if(hook.params.query.country_id != ''){
                countryId = parseInt(hook.params.query.country_id)
            }

            r.db("product_service_api").table("tbl_state").innerJoin(
              r.db("product_service_api").table("tbl_country").filter({
                "id": countryId
              }),function(tbl_state, tbl_country){
                return tbl_state("country_code").eq(tbl_country("country_code"))
              }).without([{right: 'id'}]).zip()
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

async function fetchDatafromCity(hook,table)
{
  return new Promise ((resolve , reject) =>{

      /* fetch data of city by state id and country id */
      if(hook.params.query.data_from == 'state_code'){
          let stateId = '';
          if(hook.params.query.state_id != ''){
              stateId = parseInt(hook.params.query.state_id)
          }
          //console.log("stateId",stateId);
          r.db("product_service_api").table("tbl_city").innerJoin(
            r.db("product_service_api").table("tbl_state").filter({
              "id": stateId
            }),function(tbl_city, tbl_state){
              return tbl_city("admin_code1").eq(tbl_state("state_code"))
            }).without([{right: 'id'}]).zip()
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

async function fetchDataById(hook,table)
{
    return new Promise ((resolve , reject) =>{
      let id = parseInt(hook.params.query.id)
      // console.log("id",id);
      r.db('product_service_api').table(table)

        .get(id).run(connection , function(error , cursor){
            if (error) throw error;
            resolve(cursor)
        })
    })
}

databaseTable = (data) => {
  if (data == 1){
    return "tbl_country"
  }else if (data == 2){
    return "tbl_state"
  }else if (data == 3){
    return "tbl_city"
  }else{
    return false;
  }
}
