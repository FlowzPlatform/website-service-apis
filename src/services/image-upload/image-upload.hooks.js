var dir = require('node-dir');
const path = require('path');
let fs = require('fs');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_image_upload(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => after_image_upload(hook)
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


function before_image_upload(hook) {
    hook.result = hook.data;
}

function after_image_upload(hook) {
    return new Promise((resolve, reject) => {
      console.log("Image details:", hook.data);

      fs.writeFile(hook.data.filename, hook.data.text, function(err) {
          //console.log('test');
          err ? reject(err) : resolve(hook)
      });
      
    })
}