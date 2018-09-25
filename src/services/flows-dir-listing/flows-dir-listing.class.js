/* eslint-disable no-unused-vars */
var dir = require('node-dir');
const path = require('path');
let fs = require('fs');
let _ = require('lodash');
let rimraf = require('rimraf');
let shell = require('shelljs');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app
    }

    find(params) {
        if(params.query.website == undefined){
            const dirTree = require('directory-tree');
            const tree = dirTree(appRoot);
            return Promise.resolve(tree)
        }else{
            const dirTree = require('directory-tree');
            const tree = dirTree(appRoot+"/"+params.query.website);
            // console.log(tree)
            
            
            if(!tree)
            {
                return Promise.resolve({code : 204 , message: "website "+params.query.website+" not found"})
            }

            if (params.query.subscriptionId != undefined) 
            {

            return new Promise((resolve , reject)=>{
                let subTree = tree;
                let arr_id = []
                this.app.service("project-configuration").find({ query: { subscriptionId: params.query.subscriptionId } }).then(function (response) {
                    for (let index = 0; index < response.data.length; index++) {
                        arr_id.push(response.data[index].id)
                    }
                    
                    if (arr_id.length > 0) {
                        for (let i = 0; i < tree.children.length; i++) {
                            let myIndex = _.findIndex(arr_id, function (o) {
                                return o == tree.children[i].name
                            });
                            
                            if (myIndex == -1) {
                                tree.children.splice(i, 1)
                                i--;
                            }
                        }
                    }
                    else {
                        tree.children = []
                    }

                    resolve(tree)

                }).catch(function (err) {
                    resolve(tree)
                })
            })

              
              
            } else {
                const dirTree = require('directory-tree');
                const tree = dirTree(appRoot+"/"+params.query.website);
                if(!tree)
                {
                    return Promise.resolve({code : 204 , message: "website "+params.query.website+" not found"})
                }
                return Promise.resolve(tree)
            }
            // return Promise.resolve(tree)
        }
    }

    get(id, params) {
        console.log(id);
        return Promise.resolve(fs.readFileSync(params.query.path, 'utf8'));
    }
    create(data, params) {
        console.log('data.socketListen : ',data.socketListen);

        let socketListen = false;

        if(data.socketListen == true) {
            socketListen = true;    
        } else {
            socketListen = false;
        }

        console.log('socketListen : ',socketListen);
        if (data.type == "folder") {
            return new Promise((resolve, reject) => {
                if(!fs.existsSync(data.foldername)) {
                    fs.mkdir(data.foldername, function(err) {
                         if(!err && data.folderType == 'preview') {
                            shell.exec('ln -s ' + data.folderBasePath + '/public/assets ' + data.foldername + '/assets');
                        }
                    err ? reject(err) : resolve(data)
                    });    
                } else {
                    resolve(data)
                }
            }).then(content => {
                const dirTree = require('directory-tree');
                const folderdetails = dirTree(content.foldername);
                folderdetails.socketListen = socketListen;
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
                // console.log(content);
                const dirTree = require('directory-tree');
                const filedetails = dirTree(content.filename);
                filedetails.socketListen = socketListen;
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
                        // console.log('Stats%%%%%%%%%', stats);
                        // console.log('To Delete FileName :', params.query.filename);
                        fs.unlink(params.query.filename);      
                        resolve(params.query.filename.replace(/\//g, "\\"));                
                        // fs.unlink(params.query.filename, function(err) {
                        //     err ? reject(err) : resolve(params.query.filename.replace(/\//g, "\\"))
                        // });
                        
                    } else {
                        // console.log('Stats%%%%%%%%%', stats);
                        console.log('To Delete FolderName :', params.query.filename);
                        rimraf( params.query.filename,function(){});
                        resolve(params.query.filename.replace(/\//g, "\\"));
                        // shell.rm(params.query.filename);
                        // rimraf(params.query.filename, function(err) {
                        //     err ? reject(err) : resolve(params.query.filename.replace(/\//g, "\\"))
                        // });
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
