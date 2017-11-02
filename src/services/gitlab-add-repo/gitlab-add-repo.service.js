// Initializes the `gitlabAddRepo` service on path `/gitlab-add-repo`
const createService = require('./gitlab-add-repo.class.js');
const hooks = require('./gitlab-add-repo.hooks');
const filters = require('./gitlab-add-repo.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'gitlab-add-repo',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gitlab-add-repo', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gitlab-add-repo');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
