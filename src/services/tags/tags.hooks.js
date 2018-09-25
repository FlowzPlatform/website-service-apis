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
      hook => beforeFind(hook)
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

let beforeFind = async function(hook) {
    let result = '';
    if (hook.params.query.hasOwnProperty('tag_status') && (hook.params.query.tag_status === 'true' || hook.params.query.tag_status === 'false')) {
        hook.params.query.tag_status = JSON.parse(hook.params.query.tag_status)
    }
    if (hook.params.query && hook.params.query.$paginate) {
        hook.params.paginate = hook.params.query.$paginate === 'false' || hook.params.query.$paginate === false;
        delete hook.params.query.$paginate;
    }
    if (hook.params.query.hasOwnProperty('website')) {
        hook.params.mywebid = hook.params.query.website
    }
    if (hook.params.query.hasOwnProperty('tag_slug')) {
        result = await fetchTagProducts(hook)
        hook.result = result
    }
};

async function fetchTagProducts(hook)
{
    return new Promise ((resolve , reject) =>{
        if(hook.params.query.tag_slug != ''){
            r.table("product_tags")
            .eqJoin("tag_id", r.table("tags")).zip()
            .filter({tag_slug: hook.params.query.tag_slug,website: hook.params.mywebid,tag_status: hook.params.query.tag_status})
            .orderBy('createdAt')
            .pluck("product_id","tag_color","tag_icon","tag_name","tag_slug")
            .run(connection , function(error, cursor){
                if (error) throw error;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    resolve(result)
                });
            })
        }
        else {
            resolve({status:false})
        }
    })
}