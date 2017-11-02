 let axios = require('axios');
 const config = require('../../config');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_create_login(hook)
    ],
    get: [
      
    ],
    create: [
      hook => before_create_user(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      hook => after_create_login(hook)
    ],
    get: [
      
    ],
    create: [
      hook => after_create_user(hook)
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

function before_create_user(hook) {
  hook.result = hook.data;
}

function after_create_user(hook) {
  return new Promise((resolve , reject) => {
    axios.post( config.gitLabUrl + '/api/v4/users', {
      email: hook.data.email,
      password: hook.data.password,
      username: hook.data.username,
      name: hook.data.name
    }, {
      headers: {
        'PRIVATE-TOKEN' : '-n128c9zzFJSB1_bSM7z'
      }
    }).then(response => {
      hook.result = response.data;
      resolve(hook)
    }).catch(error => {
      console.log(error);
      resolve(hook)
    })
  })
}


function before_create_login(hook) {
  hook.result = hook.data;
}

function after_create_login(hook) {
  return new Promise((resolve , reject) => {
    axios.post( config.gitLabUrl + '/api/v4/session?email='+hook.params.query.email+'&password='+hook.params.query.password, {
    }, {
      headers: {
        'PRIVATE-TOKEN' : '-n128c9zzFJSB1_bSM7z'
      }
    }).then(response => {
      hook.result = response.data;
      resolve(hook)
    }).catch(error => {
      console.log(error);
    })
        
  })

}