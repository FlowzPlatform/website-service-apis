const subscription = require('flowz-subscription')
module.exports.subscription = subscription
module.exports = async function () {
  const app = this;
  subscription.moduleResource.moduleName = 'webbuilder'
  let registerAppModule = {
    'project-configuration': ['create'],
    'delete-service': ['remove']
  }
  subscription.moduleResource.registerAppModule = registerAppModule
  subscription.moduleResource.appRoles = ['admin', 'developer', 'client']
  subscription.registeredAppModulesRole()
  console.log("registerAppModule.....from middle", registerAppModule)
  subscription.registerDynamicHooks(app, registerAppModule)
};

