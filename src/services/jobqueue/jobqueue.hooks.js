let Queue = require('rethinkdb-job-queue')
let qOptions = {
    name: 'Metalsmith' // The queue and table name
}
let cxnOptions = {
    db: 'JobQueue', // The name of the database in RethinkDB
}

let q = new Queue(cxnOptions, qOptions)


module.exports = {
  before: {
    all: [],
    find: [hook=>beforeget(hook)],
    get: [],
    create: [hook=>beforeentry(hook)],
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

function beforeentry(hook){
  console.log('inside before create')
  return new Promise(async (resolve,reject)=>{

    let hookdata=hook.data
    let Webisteid=hook.data.Webisteid
    // console.log('hookdata:',hookdata)

    let job = q.createJob({
        websitejobqueuedata: hookdata,
        Webisteid:Webisteid
    })
    // console.log('job:',job)
    q.addJob(job).then((savedJobs) => {
      // savedJobs is an array of a single job object
      // return q.cancelJob(savedJobs)
    }).catch((err) => {
        console.error(err)
    })

    
    resolve(hook);
  })
  

}

function beforeget(hook){
  console.log('inside before get')
  return new Promise(async (resolve,reject)=>{
  let id= hook.params.query.websiteid
   q.findJob({ Webisteid: id, status:'waiting' }).then((jobs) => {
     q.cancelJob(jobs)
      resolve(hook)
      // email property equal to 'batman@batcave.org'
    }).catch(err => console.error(err))
  })

}