/* eslint-disable no-unused-vars */
var dir = require('node-dir');
const path = require('path');
let fs = require('fs');
let _ = require('lodash');
let rimraf = require('rimraf');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        if(params.query.website == undefined){
            const dirTree = require('directory-tree');
            const tree = dirTree(appRoot);
            return Promise.resolve(tree)
        }else{
            const dirTree = require('directory-tree');
            const tree = dirTree(appRoot+"/"+params.query.website);
            if(!tree)
            {
                return Promise.resolve({code : 204 , message: "website "+params.query.website+" not found"})
            }
            return Promise.resolve(tree)
        }
    }

    get(id, params) {
        console.log(id);
        return Promise.resolve(fs.readFileSync(params.query.path, 'utf8'));
    }
    create(data, params) {
        if (data.type == "folder") {
            return new Promise((resolve, reject) => {
                fs.mkdir(data.foldername, function(err) {
                    //console.log('test');
                    err ? reject(err) : resolve(data)
                });
            }).then(content => {
                const dirTree = require('directory-tree');
                const folderdetails = dirTree(content.foldername);
                return folderdetails;
            }).catch(err => {
                console.error(err);
                return err;
            });
        } else {
            return new Promise((resolve, reject) => {
                fs.writeFile(data.filename, data.text, function(err) {
                    //console.log('test');
                    err ? reject(err) : resolve(data)
                });
            }).then(content => {
                var filename = content.filename.replace(/^.*[\\\/]/, '')
                if (filename.includes(".layout")) {
                    console.log('filename', filename.replace('.layout', '.html'))
                    fs.writeFile('/opt/lampp/htdocs/exported/' + filename.replace('.layout', '.html'), data.text, function(err) {
                        console.log(err);
                        //err ? reject(err) : resolve(data)
                    });
                }
                // console.log(content);
                const dirTree = require('directory-tree');
                const filedetails = dirTree(content.filename);
                return filedetails;
            }).catch(err => {
                console.error(err);
                return err;
            });
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return new Promise((resolve, reject) => {
            fs.stat(params.query.filename, function(err, stats) {
                if (!err) {
                    if (stats.isFile()) {
                        fs.unlink(params.query.filename, function(err) {
                            err ? reject(err) : resolve(params.query.filename.replace(/\//g, "\\"))
                        });
                    } else {
                        rimraf(params.query.filename, function(err) {
                            err ? reject(err) : resolve(params.query.filename.replace(/\//g, "\\"))
                        });
                    }
                } else {
                    reject(err)
                }
            });


        }).then(content => {
            console.log(content);
            return content;
        }).catch(err => {
            console.error(err);
            return err;
        });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;
