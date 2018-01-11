let shell = require('shelljs');

const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_publish_surge(hook)
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
      hook => after_publish_surge(hook)
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

function before_publish_surge(hook) {
    hook.result = hook.data;
}


function after_publish_surge(hook) {
    return new Promise((resolve, reject) => {
      let projectPath = hook.data.projectPath;
      let domainName = hook.data.domainName;

      let response = '';
      if (!shell.which('git')) {
        shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
        shell.exit(1);
      } else {
        shell.echo('Publishing Website');
        // shell.cd(config.path + projectPath + '/');
        response = shell.exec('surge --project ' + config.path + projectPath + '/  --domain ' + domainName);
      }
      hook.result = response;
      resolve(hook)
            
    })
}