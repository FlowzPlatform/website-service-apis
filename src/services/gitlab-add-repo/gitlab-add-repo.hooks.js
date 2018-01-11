let rp = require('request-promise');
let shell = require('shelljs');

const config = require('../../config');

module.exports = {
    before: {
        all: [],
        find: [
            hook => before_send_repoToGit(hook)
        ],
        get: [
            hook => before_remove_project(hook)
        ],
        create: [
            hook => before_commit_repo(hook)
        ],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [
            hook => after_send_repoToGit(hook)
        ],
        get: [
            hook => after_remove_project(hook)
        ],
        create: [
            hook => after_commit_repo(hook)
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


function before_send_repoToGit(hook) {
  hook.result = hook.data;
}

function before_commit_repo(hook) {
  hook.result = hook.data;
}

function before_remove_project(hook) {
  hook.result = hook.data;
}


function after_send_repoToGit(hook) {
  return new Promise((resolve, reject) => {
      let nameOfRepo = hook.params.query.nameOfRepo;
      let userDetailId = hook.params.query.userDetailId;
      // let username = 'fsaiyed';
      var options = {
          method: 'POST',
          uri: config.gitLabUrl + '/api/v4/projects',
          body: {
            name: userDetailId + '-' + nameOfRepo
          },
          headers: {
              'PRIVATE-TOKEN': config.gitLabToken
          },
          json: true
      };

      rp(options)
          .then(function(repos) {
              if (!shell.which('git')) {
                  shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
                  shell.exit(1);
              } else {
                  shell.cd(config.path + userDetailId + '/' + nameOfRepo + '/');

                  shell.exec('git init');
                  shell.exec('git remote add origin ' + config.gitLabUrl + '/' + config.gitLabUsername + '/'+ userDetailId + '-' + nameOfRepo +'.git');
                  shell.exec('git remote -v');

                  shell.exec('git status');

                  shell.exec('git add .');
                  shell.exec('git commit -m "Initial commit"');
                  shell.exec('git push -u origin master -f');

                  shell.exec('curl -i -X POST -d \'[ "flowzcluster.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "139.59.37.43" } ] ]\' -H \'X-Auth-Username: admin@flowz.com\' -H \'X-Auth-Password: 12345678\' \'http://54.175.22.107/pretty/atomiadns.json/SetDnsRecords\'');
              }

              hook.result = repos;
              resolve(hook)
          })
          .catch(function(err) {
              hook.result = err;
              resolve(hook)

          });
  })
}




function after_commit_repo(hook) {

    return new Promise((resolve, reject) => {
        let nameOfRepo = hook.data.repoName;
        let userDetailId = hook.data.userDetailId;

        if (!shell.which('git')) {
            shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
            shell.exit(1);
        } else {
            shell.cd(config.path + userDetailId + '/' + nameOfRepo + '/');

            shell.exec('git status');
            shell.exec('git remote -v');
            shell.exec('git add .');

            shell.exec('git commit -m "' + hook.data.commitMessage + '"');

            shell.exec('git push -u origin master --force');

            shell.echo('New Commit Pushed to GitLab server');
        }
        resolve(hook)
    })
}


function after_remove_project(hook) {

    return new Promise((resolve, reject) => {

        var options = {
            method: 'DELETE',
            uri: config.gitLabUrl + '/api/v4/projects/' + hook.id,
            headers: {
                'PRIVATE-TOKEN': config.gitLabToken
            },
            json: true
        };

        rp(options)
            .then(function(repos) {
                console.log('repo deleted!');
                hook.result = repos;
                resolve(hook)
            })
            .catch(function(err) {
                console.log(err)
                hook.result = err;
                resolve(hook)
            });

        resolve(hook)
    })
}