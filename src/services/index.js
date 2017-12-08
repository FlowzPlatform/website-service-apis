const flowsDirListing = require('./flows-dir-listing/flows-dir-listing.service.js');
const commitService = require('./commit-service/commit-service.service.js');
const gitlabAddRepo = require('./gitlab-add-repo/gitlab-add-repo.service.js');
const userService = require('./user-service/user-service.service.js');
const metalsmith = require('./metalsmith/metalsmith.service.js');
const transaction = require('./transaction/transaction.service.js');
const imageUpload = require('./image-upload/image-upload.service.js');
const getDirectoryList = require('./get-directory-list/get-directory-list.service.js');
const shoppingCart = require('./shoppingCart/shoppingCart.service.js');
const register = require('./register/register.service.js');

const webpackApi = require('./webpack-api/webpack-api.service.js');

module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(flowsDirListing);
  app.configure(commitService);
  app.configure(gitlabAddRepo);
  app.configure(userService);
  app.configure(metalsmith);

  app.configure(transaction);

  app.configure(imageUpload);
  app.configure(getDirectoryList);
  app.configure(shoppingCart);
  app.configure(register);
  app.configure(webpackApi);
};
