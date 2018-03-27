

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [
      hook => beforeCreate(hook)
    ],
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

let beforeCreate = function(hook) {
  hook.data.createdAt = new Date()
}

let beforeFind = function(hook) {
  if (hook.params.query.hasOwnProperty('status') && hook.params.query.status === 'true') {
    hook.params.query.status = true
  }
}