const subscription = require('flowz-subscription');

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
      subscription.moduleResource.moduleName = 'website_' + websiteId;

      let registerAppModule = {
        'address-book': ['create', 'get', 'find', 'patch'],
        'request-info': ['create', 'get', 'find'],
        'my-orders': ['create', 'get', 'find'],
        'request-quote': ['create', 'get', 'find']
      }

      subscription.moduleResource.registerAppModule = registerAppModule;
      subscription.moduleResource.appRoles = ['guest', 'registered'];
      subscription.registeredAppModulesRole();

      resolve(hook);
            
    })
}