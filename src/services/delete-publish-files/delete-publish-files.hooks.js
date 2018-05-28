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
        // let deleteresponse=shell.exec('find '+hook.params.query.path+ '/public -maxdepth 1 -type f -iname \*.html -delete');
        let deleteresponse=shell.exec('rm -rf '+hook.params.query.path+ '/.temppublish/*');
        console.log('########################### deleteresponse',deleteresponse)
        hook.result = 'Successfull deleted previous published files';
        resolve(hook);
  })
}