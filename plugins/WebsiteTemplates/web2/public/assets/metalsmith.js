var Metalsmith=require('/var/www/html/node_modules/metalsmith');
var markdown=require('/var/www/html/node_modules/metalsmith-markdown');
var layouts=require('/var/www/html/node_modules/metalsmith-layouts');
var permalinks=require('/var/www/html/node_modules/metalsmith-permalinks');
var inPlace = require('/var/www/html/node_modules/metalsmith-in-place')
var fs=require('/var/www/html/node_modules/file-system');
var Handlebars=require('/var/www/html/node_modules/handlebars');
Handlebars.registerPartial('Header_header', fs.readFileSync('/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/temp/Header_header.html').toString())
Handlebars.registerPartial('Footer_footer', fs.readFileSync('/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/temp/Footer_footer.html').toString())
Handlebars.registerPartial('wishlist_list', fs.readFileSync('/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/temp/wishlist_list.html').toString())
 Metalsmith(__dirname)
.metadata({
title: "Demo Title",
description: "Some Description",
generator: "Metalsmith",
url: "http://www.metalsmith.io/"})
.source('/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/Preview')
.destination('/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/public')
.clean(false)
.use(markdown())
.use(inPlace(true))
.use(layouts({engine:'handlebars',directory:'/var/www/html/websites/59a8e0dd41dc17001aeb1e67/aakron/Layout'}))
.build(function(err,files)
{if(err){
console.log(err)
}});