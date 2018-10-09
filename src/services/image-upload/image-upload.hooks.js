var dir = require('node-dir');
const path = require('path');
let fs = require('fs');
let axios=require('axios')
const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_image_upload(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => after_image_upload(hook)
    ],
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


function before_image_upload(hook) {
    hook.result = hook.data;
}

function after_image_upload(hook) {
    return new Promise(async (resolve, reject) => {
      // console.log("Image details:", hook.data);


      let img = hook.data.text;

      let data = img[0].replace(/^data:image\/\w+;base64,/, "");
      let buf = new Buffer(data, 'base64');
      let tempjsonpd=''
      if(img[3]!=-1){

      tempjsonpd='{"action": "update","encoding":"base64","file_path": "favicon.'+img[1]+'","content": "'+data+'" }'
      }else{
        tempjsonpd='{"action": "create","encoding":"base64","file_path": "favicon.'+img[1]+'","content": "'+data+'" }'
      }
      let buildpayloadpd='{ "branch": "master","commit_message": "uploading favicon", "actions": ['+tempjsonpd+'] }'

      let axiosoptionpd={
        method:'post',
        url:'https://gitlab.com/api/v4/projects/'+img[2]+'/repository/commits',
        data:buildpayloadpd,
        headers:{ 'PRIVATE-TOKEN':config.gitLabToken, 'Content-Type':'application/json'}
      }

      await axios(axiosoptionpd)
      .then(()=>{
        fs.writeFile(hook.data.filename, buf, function(err) {
          err ? reject(err) : resolve(hook)
        });
        
      })
      // fs.writeFile(hook.data.filename, hook.data.text, function(err) {
      //     //console.log('test');
      //     err ? reject(err) : resolve(hook)
      // });
      
    })
}