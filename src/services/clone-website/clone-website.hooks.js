let shell = require('shelljs');
const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_clone_website(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => after_clone_website(hook)
    ],
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


function before_clone_website(hook) {
    hook.result = hook.data;
}

function after_clone_website(hook) {
    return new Promise((resolve, reject) => {
      let sourceProjectName = hook.params.query.sourceProjectName;
      let destinationProjectName = sourceProjectName + '_copy';

      let userDetailId = hook.params.query.userDetailId;
      
      let response = '';

      response = shell.cp('-Rf', config.path + userDetailId + '/' + sourceProjectName, config.path + userDetailId + '/' + destinationProjectName);
      
      hook.result = response;
      resolve(hook)
            
    })
}