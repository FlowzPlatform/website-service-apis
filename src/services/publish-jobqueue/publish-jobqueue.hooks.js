let shell = require('shelljs');
let Queue = require('rethinkdb-job-queue')
let qOptions = {
    name: 'Mathematics' // The queue and table name
}
let cxnOptions = {
    db: 'JobQueue', // The name of the database in RethinkDB
}

let q = new Queue(cxnOptions, qOptions)

module.exports = {
  before: {
    all: [],
    find: [],
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
    create: [hook=>afterentry(hook)],
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

function afterentry(hook){
  
  if(hook.data.id){
    return new Promise(async (resolve,reject)=>{
      
      let rethinkid=hook.result.id
            
      let job = q.createJob({
          rethinkID: rethinkid
      })

      q.addJob(job).catch((err) => {
          console.error(err)
      })
      
      resolve(hook);
    })
  }
  
}