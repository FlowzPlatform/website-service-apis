const cloudinary = require('cloudinary');

module.exports = {
  before: {
    all: [],
    find: [
      hook => before_get_images(hook)
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
      hook => after_get_images(hook)
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


function before_get_images(hook) {
    hook.result = hook.data;
}

function after_get_images(hook) {
    return new Promise((resolve, reject) => {

      let cloud_name = hook.params.query.cloudName;
      let api_key = hook.params.query.apiKey;
      let api_secret = hook.params.query.apiSecret;
      
      cloudinary.config({
        cloud_name: cloud_name,
        api_key: api_key,
        api_secret: api_secret,
      });

      console.log('%%%%%%%%%%%%%%%Cursor: ', typeof hook.params.query.nextCursor);

      if(hook.params.query.nextCursor != 'undefined')
      {  
        cloudinary.v2.api.resources({ next_cursor: hook.params.query.nextCursor }, function(error, result){
          hook.result = result;
          resolve(hook)
        });      
       } else {
          cloudinary.v2.api.resources({}, function(error, result){
          hook.result = result;
          resolve(hook)
        });
       }     
    })
}