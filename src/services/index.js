const flowsDirListing = require('./flows-dir-listing/flows-dir-listing.service.js');
const commitService = require('./commit-service/commit-service.service.js');
const gitlabAddRepo = require('./gitlab-add-repo/gitlab-add-repo.service.js');
const userService = require('./user-service/user-service.service.js');
const metalsmith = require('./metalsmith/metalsmith.service.js');
const imageUpload = require('./image-upload/image-upload.service.js');
const getDirectoryList = require('./get-directory-list/get-directory-list.service.js');
const shoppingCart = require('./shoppingCart/shoppingCart.service.js');
const register = require('./register/register.service.js');

const requestInfo = require('./request-info/request-info.service.js');
const publishNow = require('./publish-now/publish-now.service.js');
const projectConfiguration = require('./project-configuration/project-configuration.service.js');
const webpackApi = require('./webpack-api/webpack-api.service.js');

const addressBook = require('./address-book/address-book.service.js');

const emailSubscribers = require('./email-subscribers/email-subscribers.service.js');

const publishSurge = require('./publish-surge/publish-surge.service.js');


const copyWebsite = require('./copy-website/copy-website.service.js');


module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(flowsDirListing);
  app.configure(commitService);
  app.configure(gitlabAddRepo);
  app.configure(userService);
  app.configure(metalsmith);

  //app.configure(transaction);
  app.configure(imageUpload);
  app.configure(getDirectoryList);
  app.configure(shoppingCart);
  app.configure(register);

  app.configure(requestInfo);
  app.configure(publishNow);
  app.configure(projectConfiguration);
  app.configure(webpackApi);
  app.configure(publishSurge);
  app.configure(copyWebsite);

  app.configure(addressBook);
  app.configure(emailSubscribers);
};
