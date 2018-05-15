

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
    find: [
      hook => afterFind(hook)
    ],
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
  if (hook.params.query.hasOwnProperty('banner_status') && (hook.params.query.banner_status === 'true' || hook.params.query.banner_status === 'false')) {
    hook.params.query.banner_status = JSON.parse(hook.params.query.banner_status)
  }
  if (hook.params.query && hook.params.query.$paginate) {
    hook.params.paginate = hook.params.query.$paginate === 'false' || hook.params.query.$paginate === false;
    delete hook.params.query.$paginate;
  }
  if (hook.params.query.hasOwnProperty('website')) {
    // console.log('Before:: ', hook.params.query.website, hook.params)
    hook.params.mywebid = hook.params.query.website
    delete hook.params.query.website
  }
};

let afterFind = async function(hook) {
  if (hook.params.hasOwnProperty('mywebid')) {
    let arr = []
    for(let item of hook.result.data) {
      const query = {};
      let resp = await hook.app.service('bannertype').get(item.banner_type, {query}).then(res => {
        if (res.website_id == hook.params.mywebid) {
          arr.push(item)
        }
      })
    }
    hook.result.data = arr;
    hook.result.total = arr.length;
  }
}