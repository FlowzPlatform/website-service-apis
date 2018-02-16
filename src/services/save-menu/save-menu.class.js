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
    return new Promise((resolve, reject) => {
        fs.writeFile(data.filename, data.text, function(err) {
            err ? reject(err) : resolve(data)
        });
    }).then(content => {
        var filename = content.filename.replace(/^.*[\\\/]/, '')
        const dirTree = require('directory-tree');
        const filedetails = dirTree(content.filename);
        return filedetails;
    }).catch(err => {
        console.error(err);
        return err;
    });
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
