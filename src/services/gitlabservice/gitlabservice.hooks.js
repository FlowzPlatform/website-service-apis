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
        all: [
            hook => errorHooks(hook)
        ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};


function errorHooks(hook) {
    // body...
    hook.error = {"errorCode" : 500 , "errorMessage" : "errormessage nothing to commit"}
}


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
                name: nameOfRepo,
                visibility: 'public'
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
                    shell.exec('git remote add origin ' + config.gitLabUrl + '/' + config.gitLabUsername + '/' + nameOfRepo + '.git');
                    shell.exec('git remote -v');

                    shell.exec('git status');

                    shell.exec('git add .');
                    shell.exec('git commit -m "Initial commit"');
                    shell.exec('git push -u origin master -f');

                    if (process.env.NODE_ENV != 'development') {

                        if (process.env.dnsServer1 != undefined && process.env.dnsServer1 != '') {
                            if (process.env.webrootServer == 'DEV') {
                                shell.exec('curl -i -X POST -d \'[ "flowzcluster.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer1 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'QA') {
                                shell.exec('curl -i -X POST -d \'[ "flowzqa.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer1 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'PROD') {
                                shell.exec('curl -i -X POST -d \'[ "flowzcluster.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer1 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'STAGING') {
                                shell.exec('curl -i -X POST -d \'[ "flowzdigital.com", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer1 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else {
                                console.log('No webrootServer server specified')
                            }
                        }

                        if (process.env.dnsServer2 != undefined && process.env.dnsServer2 != '') {
                            if (process.env.webrootServer == 'DEV') {
                                shell.exec('curl -i -X POST -d \'[ "flowzcluster.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer2 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'QA') {
                                shell.exec('curl -i -X POST -d \'[ "flowzqa.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer2 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'PROD') {
                                shell.exec('curl -i -X POST -d \'[ "flowzcluster.tk", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer2 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else if (process.env.webrootServer == 'STAGING') {
                                shell.exec('curl -i -X POST -d \'[ "flowzdigital.com", [ { "ttl" : "3600", "label" : "' + userDetailId + '.' + nameOfRepo + '", "class" : "IN", "type" : "A", "rdata" : "' + process.env.serverARecord + '" } ] ]\' -H \'X-Auth-Username: admin@flowzdigital.com\' -H \'X-Auth-Password: 123456789\' \'http://' + process.env.dnsServer2 + '/pretty/atomiadns.json/SetDnsRecords\'');
                            } else {
                                console.log('No webrootServer server specified')
                            }
                        }

                    }

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
        let isRevertedCommit = true;

        if (!shell.which('git')) {
            shell.echo('Sorry, this script requires GIT CLI. Please install GIT CLI in your machine.');
            shell.exit(1);
        } else {
            // if(isRevertedCommit == true){
            //   shell.cd(config.path + userDetailId + '/' + nameOfRepo + '/');

            //   shell.exec('git status');
            //   shell.exec('git remote -v');

            //   let tempBranchName = 'commit_' + new Date().getTime();

            //   shell.exec('git checkout -b ' + tempBranchName);

            //   shell.exec('git add .');

            //   shell.exec('git commit -m "' + hook.data.commitMessage + '"');

            //   shell.exec('git checkout master');

            //   shell.exec('git merge ' + tempBranchName);

            //   shell.exec('git branch -d ' + tempBranchName);

            //   shell.exec('git push -u origin master --force');

            //   shell.echo('New Commit Pushed to GitLab server');
            // } else {
            //   shell.cd(config.path + userDetailId + '/' + nameOfRepo + '/');

            //   shell.exec('git status');
            //   shell.exec('git remote -v');

            //   shell.exec('git add .');

            //   shell.exec('git commit -m "' + hook.data.commitMessage + '"');

            //   shell.exec('git push -u origin master --force');

            //   shell.echo('New Commit Pushed to GitLab server');
            // }

            shell.cd(config.path + userDetailId + '/' + nameOfRepo + '/');

            shell.exec('git checkout -b ' + hook.data.branchName);

            shell.exec('git status', function(code, stdout, stderr) {

                console.log('Exit Code: ', code);
                console.log('Program output:', stdout);
                console.log('Program stderr:', stderr);

                let statusOut = stdout;
                var n = statusOut.indexOf("nothing to commit");

                console.log('Status string match n: ', n);

                if(n == -1){
                    shell.exec('git add .');

                    shell.exec('git commit -m "' + hook.data.commitMessage + '"');

                    shell.exec('git push -u origin ' + hook.data.branchName + ' --force', function(code, stdout, stderr) {

                        console.log('Exit Code: ', code);
                        console.log('Program output:', stdout);
                        console.log('Program stderr:', stderr);

                        hook.result = [{
                            code: code,
                            otuput: stdout,
                            error: stderr
                        }];

                        resolve(hook);
                    });
                } else {
                    // throw new Error ({errorMessage : "Nothing to commit"})
                    // hook.error = new errors.GeneralError('Nothing to commit');
                    // reject(hook);
                    // new errors.GeneralError(new Error('Nothing to commit'));
                    hook.result = [{
                        code: 444,
                        message: 'No changes. Nothing to add to revision',
                    }];

                    resolve(hook); 
                }

            });

        }

    })
}


function after_remove_project(hook) {

    return new Promise((resolve, reject) => {

        let projectPath = hook.params.query.projectPath;

        shell.rm('-rf', projectPath);
        // shell.cd('/var/www/html/websites');
        process.chdir('/var/www/html/websites');

        // console.log('Project Delete CWD after delete: ', process.cwd());
        // process.cwd() = 

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