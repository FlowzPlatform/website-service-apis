let rp = require('request-promise');
let shell = require('shelljs');

const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_get_commits_list(hook)
    ],
    get: [],
    create: [
      hook => before_revert_commit(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => after_get_commits_list(hook)
    ],
    get: [],
    create: [
      hook => after_revert_commit(hook)
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

function before_get_commits_list(hook) {
    hook.result = hook.data;
}

function after_get_commits_list(hook) {
    console.log(hook.params.query);
    return new Promise((resolve, reject) => {
        var options = {
            uri: config.gitLabUrl + '/api/v4/projects/'+hook.params.query.projectId+'/repository/commits',
            headers: {
                'PRIVATE-TOKEN': config.gitLabToken
            },
            json: true
        };

        rp(options)
        .then(function(commits) {
            hook.result = commits;
            resolve(hook)
        })
        .catch(function(err) {
            hook.result = err;
            resolve(hook)
        });
    })
}

function before_revert_commit(hook) {
    hook.result = hook.data;
}

function after_revert_commit(hook) {
    return new Promise((resolve, reject) => {
        var projectId = hook.params.query.projectId;
        var branchName = hook.params.query.branchName;
        var commitSHA = hook.params.query.sha;
        var repoName = hook.params.query.repoName;
        var userDetailId = hook.params.query.userDetailId;
        
        if (!shell.which('git')) {
          shell.echo('Sorry, this script requires git');
          shell.exit(1);
        } else {
          shell.cd( config.path + userDetailId + '/' + repoName );

          shell.exec('git checkout ' + commitSHA);         
        }
        resolve(hook)
    })
}
