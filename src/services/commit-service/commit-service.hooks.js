let rp = require('request-promise');

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
    return new Promise((resolve, reject) => {
        var options = {
            uri: 'http://162.209.122.250/api/v4/projects/'+hook.params.query.projectId+'/repository/commits',
            headers: {
                'PRIVATE-TOKEN': hook.params.query.privateToken
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

// function before_revert_commit(hook) {
//     hook.result = hook.data;
// }

// function after_revert_commit(hook) {
//     return new Promise((resolve, reject) => {
//         var projectId = hook.params.query.projectId;
//         var branchName = hook.params.query.branchName;
//         var commitSHA = hook.params.query.sha;

//         f (!shell.which('git')) {
//           shell.echo('Sorry, this script requires git');
//           shell.exit(1);
//         } else {
//           shell.exec('git add .');
//           shell.exec('git commit -m "new commit"');
//           shell.exec('git push -u origin master');
//         }
//     })
// }
