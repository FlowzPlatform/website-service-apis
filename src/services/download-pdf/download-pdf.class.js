/* eslint-disable no-unused-vars */
let fs = require('fs');
// let pdf = require('html-pdf');
let htmlToPdf = require('html-to-pdf');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    return new Promise((resolve , reject) =>{
      // pdf.create(data.html).toBuffer(function(err, buffer){
      //   console.log('This is a buffer:', buffer);
        
      //   resolve(buffer)
      // });
      htmlToPdf.convertHTMLString(data.html, './destination.pdf',
          function (error, success) {
            if (error) {
                  console.log('Oh noes! Errorz!');
                  console.log(error);
              } else {
                  console.log('Woot! Success!');
                  console.log(success);
                  fs.readFile('./destination.pdf', function(err,buffer){
                    fs.unlinkSync('./destination.pdf')
                    resolve(buffer)
                  });
              }
          }
      );

      // var fs = require('fs');
      // var html1 = fs.readFileSync(__dirname+'/compare.html','utf8');
      // var conversion = require("phantom-html-to-pdf")();
      // conversion({ html: data.html }, function(err, pdf) {
      //   var output = fs.createWriteStream('./output_new.pdf')
      //   console.log(pdf);
      //   console.log(pdf.numberOfPages);
      //   pdf.stream.pipe(output);
      //   fs.readFile('./output_new.pdf', function(err,buffer){
      //     resolve(buffer)
      //   });
      //   });
    })
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
