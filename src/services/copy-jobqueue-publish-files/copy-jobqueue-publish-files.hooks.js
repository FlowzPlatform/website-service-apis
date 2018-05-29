let shell = require('shelljs');
const config = require('../../config');

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
    all: [ hook => after_copy_website(hook)],
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

// function before_copy_website(hook) {
//   console.log('before_copy_website')
//     hook.result = hook.data;
// }


function after_copy_website(hook) {
    return new Promise((resolve, reject) => {
      let projectPath = hook.params.query.projectPath;
      // let websiteid= hook.params.query.websiteid

      // shell.exec('mkdir '+config.basePath + 'plugins/TempLocation/'+websiteid)
      if(shell.test('-e', projectPath + '/.temppublish')){
        console.log('----->already exists');
      } else {
        console.log('----->doesnt exists')
        shell.exec('mkdir '+projectPath+ '/.temppublish')
      }
      shell.exec('cp -rf ' + projectPath  + '/* ' + projectPath+ '/.temppublish/', function(code, stdout, stderr){
        resolve(hook)
      });  
    })
}