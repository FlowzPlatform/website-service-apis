

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
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


let beforeFind = function(hook) {
  if (hook.params.query.hasOwnProperty('flyer_status') && (hook.params.query.flyer_status === 'true' || hook.params.query.flyer_status === 'false')) {
    hook.params.query.flyer_status = JSON.parse(hook.params.query.flyer_status)
  }
  if (hook.params.query && hook.params.query.$paginate) {
    hook.params.paginate = hook.params.query.$paginate === 'false' || hook.params.query.$paginate === false;
    delete hook.params.query.$paginate;
  }
  if (hook.params.query.hasOwnProperty('website')) {
    hook.params.mywebid = hook.params.query.website
  }
};