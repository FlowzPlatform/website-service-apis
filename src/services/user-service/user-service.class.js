var axios = require('axios');
const config = require('../../config');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  async get (id, params) {
    let username = params.query.username;
    let password = params.query.password;
    let privateToken = '';

    await axios.post( config.gitLabUrl + '/api/v4/session?login='+username+'&password='+password, {
    }, {
      headers: {
        'Content-Type'  : 'application/x-www-form-urlencoded; charset=UTF-8',
        'PRIVATE-TOKEN' : '-n128c9zzFJSB1_bSM7z'
      }
    }).then(response => {
      privateToken = response.data.private_token;
    }).catch(error => {
      console.log('Cannot get the user details..');
    })
    
    return Promise.resolve([
      {
        privateToken : privateToken,
      }
    ]);
  }

  async create (data, params) {

    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }

    // console.log('Data', data);
    // console.log('Params', params);
    // let email = data.email;
    // let password = data.password;
    // let username = data.username;
    // let name = data.name;

    // let response = '';

    // await axios.post('http://162.209.122.250/api/v4/users', {
    //   email: data.email,
    //   password: data.password,
    //   username: data.username,
    //   name: data.name
    // }, {
    //   headers: {
    //     'Content-Type'  : 'application/x-www-form-urlencoded; charset=UTF-8',
    //     'PRIVATE-TOKEN' : '-n128c9zzFJSB1_bSM7z'
    //   }
    // }).then(response => {
    //   response = response.data;
    // }).catch(error => {
    //   console.log(error);
    // })

    return Promise.resolve(data);
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