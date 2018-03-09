let rp = require('request-promise');
let shell = require('shelljs');
const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_checkout_branch(hook)
    ],
    get: [
      hook => before_get_branch_list(hook)
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => after_checkout_branch(hook)
    ],
    get: [
      hook => after_get_branch_list(hook)
    ],
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

function before_get_branch_list(hook) {
    hook.result = hook.data;
}

function after_get_branch_list(hook) {

    return new Promise((resolve, reject) => {
        var options = {
            uri: config.gitLabUrl + '/api/v4/projects/'+hook.id+'/repository/branches',
            headers: {
                'PRIVATE-TOKEN': config.gitLabToken
            },
            json: true
        };

        rp(options)
        .then(function(branches) {
            hook.result = branches;
            resolve(hook)
        })
        .catch(function(err) {
            hook.result = err;
            resolve(hook)
        });
    })
}


function before_checkout_branch(hook) {
    hook.result = hook.data;
}

function after_checkout_branch(hook) {

    return new Promise((resolve, reject) => {
      console.log('Called revert');
        // var projectId = hook.params.query.projectId;
        var branchName = hook.params.query.branchName;
        // var commitSHA = hook.params.query.sha;
        var repoName = hook.params.query.repoName;
        var userDetailId = hook.params.query.userDetailId;
        
        if (!shell.which('git')) {
          shell.echo('Sorry, this script requires git');
          shell.exit(1);
        } else {

          console.log('Called revert');
          shell.cd( config.path + userDetailId + '/' + repoName );

          shell.exec('git checkout ' + branchName);         
          shell.exec('git status');
        }
        resolve(hook)
    })
}
