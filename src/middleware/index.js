let axios = require('axios');
const subscription = require('/home/software/HarshPatel/project/subscription/index')

async function getTotal(params) {
  let op = await(axios.get('http://localhost:3030/flows-dir-listing?website=harshp'))
        // .then(response => {
        //   response.data.children = this.getTreeData(response.data);
        //   console.log("response.data......from middleware",response.data.children.length)
        //   totalMessage = response.data.children.length
        // })
        // .catch(e => {
        //   console.log(e);
        // });
  console.log('resule', op.data.children.length)      
  return op.data.children.length
}

module.exports = async function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  const app = this; // eslint-disable-line no-unused-vars
  app.use(subscription.subscription)
  
  //let totalMessage;
  // console.log("totalmessage")
  //service call
  let totalMessage = await getTotal() 
  console.log("totalMsg",totalMessage)
  //let totalmessage = 10     
  subscription.secureService.validate = (route, params, secureRouteInfo) => {
    return new Promise((resolve, reject) => {
      console.log(secureRouteInfo.value, '====', totalMessage)
      if (route === '/flows-dir-listing' && secureRouteInfo.value >= totalMessage) {
        resolve(true)
      }
      resolve(false)
    })
  }

};
