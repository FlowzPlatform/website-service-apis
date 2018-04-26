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
// function beforepatch(hook){
//   console.log('+++++++++++++++++++++++++++beforeupdate')
//    return new Promise(async (resolve,reject)=>{
//       let status=hook.data.Status
//        hook.result={data:status}   
//       resolve(hook);
//    })
// }


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
     q.findJob(q.r.and(q.r.row("Websiteid").eq(id), q.r.row("status").eq("waiting").or(q.r.row("status").eq("active")))).then((jobs) => {
      console.log(jobs)
     q.cancelJob(jobs)
   }).catch(err => console.error(err))

   resolve(hook)
  })

}

function beforegetstatus(hook){
   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! inside get status')
   return new Promise(async(resolve,reject)=>{
      let id= hook.params.query.websiteid

     await q.findJob(q.r.and(q.r.row("Websiteid").eq(id), q.r.row("status").eq("waiting").or(q.r.row("status").eq("active")))).then((jobs) => {
         if(jobs.length>0){
         hook.result={"data":'active'}
         }
      }).catch(err => console.error(err))
      resolve(hook)
     })
}