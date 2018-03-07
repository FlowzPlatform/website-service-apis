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
      // console.log("Image details:", hook.data);

      // console.log('Hook data: ', hook.data)

      var img = hook.data.text;

      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile(hook.data.filename, buf, function(err) {
        err ? reject(err) : resolve(hook)
      });

      // fs.writeFile(hook.data.filename, hook.data.text, function(err) {
      //     //console.log('test');
      //     err ? reject(err) : resolve(hook)
      // });
      
    })
}