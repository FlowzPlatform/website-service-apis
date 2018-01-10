/* eslint-disable no-unused-vars */

let rp = require('request-promise');
let password_length = 9;

// let email_url = process.env.EMAIL_URL || "http://172.16.61.20:3000/sendPassword";
let email_url = process.env.EMAIL_URL;

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

  async create (data, params) {

    return new Promise((resolve, reject) => {
      let password = this.randomPassword(password_length);
      var options = {
        method: 'POST',
        uri: process.env.REGISTER_URL,
        body: {
            email: data.email,
            password: password,
            fullname : data.firstName +" "+ data.lastName
        },
        json: true // Automatically stringifies the body to JSON
    };
     
    rp(options) 
        .then(function (parsedBody) {
            if(parsedBody.code == 200){
                let sendEmailOptions = {
                  method: 'POST',
                  uri: email_url,
                  body: {
                    "to":[data.email],
                    "from":"flowz@officebrain.com",
                    "subject":"Flowz password",
                    "body":"Thank You "+data.firstName +" "+ data.lastName+ " ,for registering with us. Your flowz password is  "+password
                  },
                  json: true // Automatically stringifies the body to JSON
              };
              rp(sendEmailOptions)
              .then(function (result) {
								console.log(1)
                resolve(parsedBody)
              })
              .catch(function (err) {
								console.log(2)
                resolve(err)
              });
              
            }else{
							console.log(3);
              resolve(parsedBody)
            }
          

        })
        .catch(function (err) {
          console.log(err)
          resolve(err)
        });
    })
    
   

   // return Promise.resolve(data);
  }


  randomPassword(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
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
