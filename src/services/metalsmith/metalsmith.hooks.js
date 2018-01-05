let shell = require('shelljs')

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
    find: [
      hook => after_create_ms(hook)
    ],
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
  hook.result = hook.data;
}

function after_create_ms(hook) {
  return new Promise((resolve, reject) => {
    console.log(hook.params.query.path);
      // let replace_path = (hook.params.query.path).replace(/\\/g,'\/')
      // console.log('Replaced path: '+replace_path);
      //  shell.cd(replace_path);
      //  shell.exec('pwd');
       shell.exec('node '+hook.params.query.path+'/public/assets/metalsmith.js');
       hook.result = 'Successfull executed MetalSmith';
      resolve(hook);
  })
}