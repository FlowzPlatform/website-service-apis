let axios = require('axios');
let rp = require('request-promise')
const subscription = require('/home/software/AllProjects/subscription/index')

module.exports = async function () {


  


  //***************AXIOS CALL******************/
  // async function getTotal(params) {
  //   let op = await(axios.get('http://localhost:3030/flows-dir-listing?website=harshp'))
  //   console.log('resule', op.data.children.length)      
  //   return op.data.children.length
  // }


  // Add your custom middleware here. Remember, that
  // in Express the order matters
  const app = this; // eslint-disable-line no-unused-vars
  app.use(subscription.subscription)

  //service call
  // let totalMessage = await getTotal() 
  // console.log("totalMsg",totalMessage)
  //let totalMessage = 4;
  subscription.secureService.validate = (route, params, secureRouteInfo) => {
    return new Promise(async function (resolve, reject) {
      let totalMessage;
      //***************************RP CALL***********/
      await rp('http://localhost:3032/flows-dir-listing?website=harshp')
        .then(function (response) {
          // console.log(typeof response)
          response = JSON.parse(response)
          totalMessage = response.children.length
          console.log("totalmessage",totalMessage)
        })
        .catch(function (err) {
          console.log(err)
        });
        console.log(secureRouteInfo.value, '====', totalMessage)
        if (route === '/flows-dir-listing' && secureRouteInfo.value > totalMessage) {
          resolve(true)
        }
        resolve(false)
      }) 
      
  }
};