const flowsDirListing = require('./flows-dir-listing/flows-dir-listing.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(flowsDirListing);
};
