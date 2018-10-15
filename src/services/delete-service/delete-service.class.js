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
  setup(app) {
      this.app = app
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
   return new Promise((resolve , reject)=>{
      // console.log("params..........................--------",params)
      this.app.service("flows-dir-listing").remove('',params).then(function (response) {
      resolve(response)
      }).catch(function (err) {
        resolve(err)
      })
   })
    
    }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
