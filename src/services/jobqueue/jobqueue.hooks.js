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
    find: [hook=>beforegetstatus(hook)],
    get: [],
    create: [hook=>beforeentry(hook)],
    update: [],
    patch: [],
    remove: [hook=>beforegetremove(hook)]
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
    let Websiteid=hook.data.Websiteid
    // console.log('hookdata:',hookdata)

    let job = q.createJob({
        websitejobqueuedata: hookdata,
        Websiteid:Websiteid
    })
    // console.log('job:',job)
    q.addJob(job).then((savedJobs) => {
      // savedJobs is an array of a single job object
    }).catch((err) => {
        console.error(err)
    })  
    resolve(hook);
  })
}

function beforegetremove(hook){
  
   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! inside remove')
  return new Promise(async (resolve,reject)=>{

  let id= hook.params.query.websiteid

  q.findJob({ Websiteid: id, status:'active'}).then((jobs) => {
      console.log('-------------------JOBS:',jobs)
     q.cancelJob(jobs)
   }).catch(err => console.error(err))

   resolve(hook)
  })

}



function beforegetstatus(hook){
   console.log('inside get status')
   return new Promise(async(resolve,reject)=>{
      let id= hook.params.query.websiteid

     await q.findJob({ Websiteid: id,status:'waiting'}).then((jobs) => {
         // console.log('jobs:', jobs)
         if(jobs.length>0){
            // console.log('####')
         hook.result={"data":'active'}
         }
      }).catch(err => console.error(err))
      // console.log('hook.result',hook.result)
      resolve(hook)
     })
}