const subscription = require('flowz-subscription')
module.exports.subscription = subscription
module.exports = async function () {
  const app = this;
  subscription.moduleResource.moduleName = 'webbuilder'
  let registerAppModule = {
    'project-configuration': ['create'],
    'delete-service': ['remove'],
    // 'subscription-websites' : ['find' , 'get']
    // 'address-book': ['create', 'get', 'find', 'patch'],
    // 'request-info': ['create', 'get', 'find'],
    // 'myOrders': ['create', 'get', 'find'],
    // 'request-quote': ['create', 'get', 'find']
  }
  subscription.moduleResource.registerAppModule = registerAppModule
  subscription.moduleResource.appRoles = ['admin', 'developer', 'client']
  subscription.registeredAppModulesRole()
  subscription.registerDynamicHooks(app, registerAppModule)
};
