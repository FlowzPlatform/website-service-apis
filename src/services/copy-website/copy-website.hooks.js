let shell = require('shelljs');

const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_copy_website(hook)
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
      hook => after_copy_website(hook)
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

function before_copy_website(hook) {
    hook.result = hook.data;
}


function after_copy_website(hook) {
    return new Promise((resolve, reject) => {
      let projectPath = hook.data.projectPath;
      let templateName = hook.data.templateName;

      let response = '';
      if (!shell.which('git')) {
        shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
        shell.exit(1);
      } else {

        console.log('cp -rf ' + config.basePath + 'plugins/WebsiteTemplates/' + templateName + '/* ' + config.path + projectPath + '/');
        // response = shell.cp('-Rf', config.basePath + 'plugins/WebsiteTemplates/' + templateName + '/*', config.path + projectPath + '/');
        response = shell.exec('cp -rf ' + config.basePath + 'plugins/WebsiteTemplates/' + templateName + '/* ' + config.path + projectPath + '/');

      }
      hook.result = response;
      resolve(hook)
            
    })
}