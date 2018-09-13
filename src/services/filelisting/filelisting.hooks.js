let shell = require('shelljs')
var fs = require('fs');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_create_ms(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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


function before_create_ms(hook) {
   return new Promise((resolve, reject) => {

    fs.readdir(hook.params.query.path, function(err, items) {
    hook.result = {"data":items};
    resolve(hook)
    });
   })

}