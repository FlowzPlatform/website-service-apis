var fs = require('fs');

module.exports = {
  before: {
    all: [],
    get: [],
    create: [
          hook => before_get_list(hook)
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
          hook => after_get_list(hook)
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


function before_get_list(hook) {
    hook.result = hook.data;
}

 function after_get_list(hook) {
    console.log(hook.params.query);
    return new Promise((resolve, reject) => {
        let folderUrl = hook.params.query.folderUrl;
        console.log("****",folderUrl)
        var dirPath = folderUrl;  //directory path
        // var fileType = '.html'; //file extension
        var files = [];
        fs.readdirSync(dirPath).forEach(file => {
          files.push(file)
        })
        hook.result = files;
        resolve(hook)
    })
}