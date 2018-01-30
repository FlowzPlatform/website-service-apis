

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeInsertRequestQuote(hook)
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

function beforeInsertRequestQuote(hook){
      hook.data.created_at = new Date();
      hook.data.deleted_at = '';
}
