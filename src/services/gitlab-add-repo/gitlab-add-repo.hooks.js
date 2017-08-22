let rp = require('request-promise');
let shell = require('shelljs');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_send_repoToGit(hook)
    ],
    get: [],
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
    get: [],
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


function after_send_repoToGit(hook) {
    return new Promise((resolve, reject) => {
      let nameOfRepo = "newPro2"
        var options = {
            method: 'POST',
            uri: 'http://162.209.122.250/api/v4/projects',
            body: {
              name: nameOfRepo
            },
            headers: {
                'PRIVATE-TOKEN': hook.params.query.privateToken
            },
            json: true
        };

        rp(options)
            .then(function(repos) {
              if (!shell.which('git')) {
                shell.echo('Sorry, this script requires git');
                shell.exit(1);
              } else {
                shell.cd('/home/software/Desktop/demo');
                // shell.exec('cd /home/software/Desktop/demo');
                shell.exec('git init');
                shell.exec('git remote add origin git@162.209.122.250/fsaiyed/'+ nameOfRepo +'.git');
                //shell.exec('git add .');
                //shell.exec('git push -u origin master');
                shell.exec('git status');
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
      let nameOfRepo = "newPro2"
        
        if (!shell.which('git')) {
          shell.echo('Sorry, this script requires git');
          shell.exit(1);
        } else {
          shell.cd('/var/www/html/websites/newPro2');

          shell.exec('pwd');

          shell.exec('git add .');

          shell.exec('git commit -m "' + hook.data.commitMessage + '"');

          shell.exec('git push -u origin master --force');          
        }
        resolve(hook)
    })
}