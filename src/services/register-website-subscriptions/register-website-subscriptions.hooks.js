//const extend = require('util')._extend
let subscription1 = require('flowz-subscription')
let subscription_1 = cloneObject(subscription1);
//const subscription1 = extend({},require('flowz-subscription'))
 function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => before_register_website(hook)
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
      hook => after_register_website(hook)
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

function before_register_website(hook) {
    hook.result = hook.data;
}


function after_register_website(hook) {
    return new Promise((resolve, reject) => {
      let websiteId = hook.data.websiteId;

      // subscribe website default roles in subscription project
      subscription_1.moduleResource.moduleName = 'website_' + websiteId;

      let registerAppModule = {
        'address-book': ['create', 'get', 'find', 'patch'],
        'request-info': ['create', 'get', 'find'],
        'my-orders': ['create', 'get', 'find'],
        'request-quote': ['create', 'get', 'find']
      }

      subscription_1.moduleResource.registerAppModule = registerAppModule;
      subscription_1.moduleResource.appRoles = ['guest', 'registered'];
      subscription_1.registeredAppModulesRole();

      resolve(hook);
            
    })
}