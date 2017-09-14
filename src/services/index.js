const flowsDirListing = require('./flows-dir-listing/flows-dir-listing.service.js');
const commitService = require('./commit-service/commit-service.service.js');
const gitlabAddRepo = require('./gitlab-add-repo/gitlab-add-repo.service.js');
const userService = require('./user-service/user-service.service.js');
const metalsmith = require('./metalsmith/metalsmith.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(flowsDirListing);
  app.configure(commitService);
  app.configure(gitlabAddRepo);
  app.configure(userService);
  app.configure(metalsmith);
};
