

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
       hook => before_insert_record(hook)
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

function before_insert_record(hook){
  hook.data.createAt = new Date();
  hook.data.userId = 1;
}