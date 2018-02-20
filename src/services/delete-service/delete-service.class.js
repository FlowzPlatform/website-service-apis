/* eslint-disable no-unused-vars */
var dir = require('node-dir');
const path = require('path');
let fs = require('fs');
let _ = require('lodash');
let rimraf = require('rimraf');
let shell = require('shelljs');


class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
        return new Promise((resolve, reject) => {
            fs.stat(params.query.filename, function(err, stats) {
                if (!err) {
                    if (stats.isFile()) {
                        // console.log('Stats%%%%%%%%%', stats);
                        // console.log('To Delete FileName :', params.query.filename);
                        shell.rm(params.query.filename);      
                        resolve(params.query.filename.replace(/\//g, "\\"));                
                        // fs.unlink(params.query.filename, function(err) {
                        //     err ? reject(err) : resolve(params.query.filename.replace(/\//g, "\\"))
                        // });
                        
                    } else {
                        // console.log('Stats%%%%%%%%%', stats);
                        // console.log('To Delete FolderName :', params.query.filename);
                        shell.rm('-rf', params.query.filename);
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

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
