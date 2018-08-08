let axios = require('axios');
const config = require('../config');

module.exports = {
  mailSend : function(toMail,fromMail,subject,mailBody,ccMail=''){
    return new Promise((resolve , reject) => {
      axios.post(config.mailSendApi, {
        to:toMail,
        from: fromMail,
        cc: ccMail,
        subject: subject,
        body: mailBody
      }).then(data => {
        resolve(data.data.response.messageId);
      }).catch(error => {
        reject(error);
      })
    })
  }
}