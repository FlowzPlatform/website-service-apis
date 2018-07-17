var Metalsmith=require('/var/www/html/node_modules/metalsmith');
var markdown=require('/var/www/html/node_modules/metalsmith-markdown');
var layouts=require('/var/www/html/node_modules/metalsmith-layouts');
var permalinks=require('/var/www/html/node_modules/metalsmith-permalinks');
var inPlace = require('/var/www/html/node_modules/metalsmith-in-place')
var fs=require('/var/www/html/node_modules/file-system');
var Handlebars=require('/var/www/html/node_modules/handlebars');
 Metalsmith(__dirname)
.metadata({
title: "Demo Title",
description: "Some Description",
generator: "Metalsmith",
url: "http://www.metalsmith.io/"})
.source('')
.destination('/var/www/html/websites/5add7e10a93fff0013a5296e/7f31adcd54f040899e3343af414ad4ad/public')
.clean(false)
.use(markdown())
.use(inPlace(true))
.use(layouts({engine:'handlebars',directory:'/var/www/html/websites/5add7e10a93fff0013a5296e/7f31adcd54f040899e3343af414ad4ad/Layout'}))
.build(function(err,files)
{if(err){
console.log(err)
}});