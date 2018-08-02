
let rp = require('request-promise');
let hb = require("handlebars");
let mjml = require("mjml");
let mailService = require("../../common/mail.js");

module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFindRequestQuote(hook)
    ],
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
    create: [
      hook => before_get_email_template(hook)
    ],
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


beforeFindRequestQuote = async hook => {

    if(hook.params.query.owner_id == undefined &&  hook.params.query.website_id == undefined &&  hook.params.query.user_id == undefined)
    {
      hook.result = {status:400, message: "Please pass user id or owner id or setting id or website_id"}
    }
    hook.params.query.$sort = { created_at: -1}
}

function beforeInsertRequestQuote(hook){
      hook.data.created_at = new Date();
      hook.data.deleted_at = '';
}

async function before_get_email_template(hook){
  if(hook.data.id != undefined){
    if(typeof hook.data.form_data != "undefined")
    {
      // console.log('+++++++++++++++');
      if(typeof hook.data.form_data.slug != "undefined")
      {
        let response = await hook.app.service("email-template").find({query: { slug: hook.data.form_data.slug ,website_id:hook.data.website_id}});

        // let response = await hook.app.service("email-template").find({query: { slug: hook.data.form_data.slug}});

        // console.log("response",response);
        if(response.total != 0){
            let data = hook.result;

            let userEmail = "";
            let fromEmail = "";
            let ccEmail = "";
            
            if(typeof hook.data.form_data.to_email != "undefined"){
                userEmail = hook.data.form_data.to_email;
            }
            else if(typeof hook.data.form_data.email != "undefined"){
                userEmail = hook.data.form_data.email;
            }
            // let userEmail = hook.data.form_data.to_email;
            let mjmlsrc =  response.data[0].template_content;
            let subject =  response.data[0].subject;
            
            if(typeof response.data[0].cc != "undefined")
            {
                ccEmail =  response.data[0].cc;
            }
            
            if(typeof hook.data.form_data.email != "undefined"){
                fromEmail =  hook.data.form_data.email;
            }
            else{
                fromEmail =  response.data[0].from;
            }
            

            hb.registerHelper("math", function(lvalue, operator, rvalue, options) {
              lvalue = parseFloat(lvalue);
              rvalue = parseFloat(rvalue);
              return {
                  "+": lvalue + rvalue
              }[operator];
            });

            hb.registerHelper('ifCond', function (v1, operator, v2, options) {
              switch (operator) {
                  case '==':
                      return (v1 == v2) ? options.fn(this) : options.inverse(this);
                  case '===':
                      return (v1 === v2) ? options.fn(this) : options.inverse(this);
                  case '!==':
                      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                  case '<':
                      return (v1 < v2) ? options.fn(this) : options.inverse(this);
                  case '<=':
                      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                  case '>':
                      return (v1 > v2) ? options.fn(this) : options.inverse(this);
                  case '>=':
                      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                  case '&&':
                      return (v1 && v2) ? options.fn(this) : options.inverse(this);
                  case '||':
                      return (v1 || v2) ? options.fn(this) : options.inverse(this);
                  default:
                      return options.inverse(this);
              }
          });

            let template = hb.compile(mjmlsrc);
            let mjmlresult = template({ data: data });

            let htmlOutput = mjml.mjml2html(mjmlresult).html;

            let messageId = await mailService.mailSend(userEmail,fromEmail,subject,htmlOutput,ccEmail);
          }
      }
    }
    else{
      // console.log("*****************");
      // let response = await hook.app.service("email-template").find({query: { slug: 'request-quote'}});
      
      let response = await hook.app.service("email-template").find({query: { slug: 'request-quote',website_id:hook.data.website_id }});
      // console.log("response",response);
      if(response.total != 0){
          let data = hook.result;
          // data.product_image = data.product_description.product_image_url+""+data.product_description.product_name
          // console.log("++++++++++",data);
          let userEmail = data.user_info.email;
          //let userEmail = 'divyesh2589@gmail.com';
          let mjmlsrc =  response.data[0].template_content;
          let subject =  response.data[0].subject;
          let fromEmail =  response.data[0].from;
          //let fromEmail =  'obsoftcare@gmail.com';

          hb.registerHelper("math", function(lvalue, operator, rvalue, options) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue
            }[operator];
          });

            hb.registerHelper('ifCond', function (v1, operator, v2, options) {
              switch (operator) {
                  case '==':
                      return (v1 == v2) ? options.fn(this) : options.inverse(this);
                  case '===':
                      return (v1 === v2) ? options.fn(this) : options.inverse(this);
                  case '!==':
                      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                  case '<':
                      return (v1 < v2) ? options.fn(this) : options.inverse(this);
                  case '<=':
                      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                  case '>':
                      return (v1 > v2) ? options.fn(this) : options.inverse(this);
                  case '>=':
                      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                  case '&&':
                      return (v1 && v2) ? options.fn(this) : options.inverse(this);
                  case '||':
                      return (v1 || v2) ? options.fn(this) : options.inverse(this);
                  default:
                      return options.inverse(this);
              }
          });

          let template = hb.compile(mjmlsrc);
          let mjmlresult = template({ data: data });
          //console.log('mjmlresult', mjmlresult);
          let htmlOutput = mjml.mjml2html(mjmlresult).html;
          let messageId = await mailService.mailSend(userEmail,fromEmail,subject,htmlOutput);
        }
    }
  }
}
