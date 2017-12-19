let shell = require('shelljs');

const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_poblish_now(hook)
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
      hook => after_poblish_now(hook)
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

function before_poblish_now(hook) {
    hook.result = hook.data;
}


function after_poblish_now(hook) {
    return new Promise((resolve, reject) => {
      let projectName = hook.data.projectName;
      let response = '';
      console.log('Project Name: ', projectName);
      if (!shell.which('git')) {
        shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
        shell.exit(1);
      } else {
        shell.echo('Publishing Website');
        shell.cd(config.path + projectName + '/');
        response = shell.exec('now --public');
      }
      hook.result = response;
      resolve(hook)
            
    })
}