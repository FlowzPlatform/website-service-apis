module.exports = {
  before: {
    all: [ ],
    find: [
     hook => before_create_ms(hook)],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
     hook => after_create_ms(hook)],
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

function before_create_ms(hook) {
  hook.result = hook.data;
}

async function after_create_ms(hook) {

  console.log('Subscription ID: ', hook.params.headers.subscriptionid);

  await hook.app.service('project-configuration').find({
    query:{
      subscriptionId:hook.params.headers.subscriptionid
    }
  })
  .then((res)=>{
    console.log('!!!!!!!res.data',res.data)
    let result=[]
    for(let i=0;i<res.data.length;i++){
      var temp={
        'websiteName':res.data[i].websiteName,
        'websiteId':res.data[i].id,
        'userId':res.data[i].userId,
        'vid':res.data[i].configData[1].projectSettings[0].ProjectVId.vid,
        'crmSettingID':res.data[i].configData[1].projectSettings[0].CrmSettingId
      }
      result.push(temp)
    }
    hook.result= {"data":result}
  })
}
