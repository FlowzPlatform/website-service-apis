// Activate smooth scroll
$(document).on("click", ".smooth-scroll", function(event) {
    event.preventDefault();
    $("html, body").animate({
        scrollTop: $($.attr(this, "href")).offset().top
    }, 500);
});

// Progressbar component
try{
    var progress = $('progressbar').attr('progress');
    $(document).ready(function() {
        $('.progress-bar').attr('aria-valuenow', progress);
        $('.progress-bar').css('width', progress+ "%");
        $('.progress-bar').text(progress + "%")
    });
}
catch (err) {
    console.log('Progressbar not found!', err);
}

// Image gradient animation js
try {
    var color1 = $('imageanimation').attr('color1');
    var color2 = $('imageanimation').attr('color2');
    var color3 = $('imageanimation').attr('color3');
    var color4 = $('imageanimation').attr('color4');
    var color5 = $('imageanimation').attr('color5');
    var color6 = $('imageanimation').attr('color6');

    function hex_to_RGB(hex) {
        var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        return [parseInt(m[1], 16),parseInt(m[2], 16),parseInt(m[3], 16) ]
    }

    var color1 = hex_to_RGB(color1) 
    var color2 = hex_to_RGB(color2) 
    var color3 = hex_to_RGB(color3) 
    var color4 = hex_to_RGB(color4) 
    var color5 = hex_to_RGB(color5) 
    var color6 = hex_to_RGB(color6) 

    var colors = new Array(
    color1,
    color2,
    color3,
    color4,
    color5,
    color6);

    var step = 0;
    //color table indices for: 
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0,1,2,3];

    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient()
    {
    
        if ( $===undefined ) return;
        
        var c0_0 = colors[colorIndices[0]];
        var c0_1 = colors[colorIndices[1]];
        var c1_0 = colors[colorIndices[2]];
        var c1_1 = colors[colorIndices[3]];

        var istep = 1 - step;
        var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
        var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
        var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
        var color1 = "rgb("+r1+","+g1+","+b1+")";

        var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
        var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
        var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
        var color2 = "rgb("+r2+","+g2+","+b2+")";

        $('#gradient').css({
        background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
            background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
        
        step += gradientSpeed;
        if ( step >= 1 )
        {
            step %= 1;
            colorIndices[0] = colorIndices[1];
            colorIndices[2] = colorIndices[3];
            
            //pick two new target color indices
            //do not pick the same as the current one
            colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            
        }
    }

    setInterval(updateGradient,10);
}
catch (err){
    console.log('Image gradient animation not found!', err);
}
// Image gradient animation ends

// Navbar Plugins JS
try{
    var JSON;
    var menuJsonName = './assets/' + $('navimenu').attr('menuId') + '.json';

    $.ajax({
        type: 'GET',
        url: menuJsonName,
        async: true,
        dataType: 'json',
        success: function(data) {
            JSON = {
                "menu": data
            };
        }
    });

    function makeUL(lst, topLevelUl, rootLvl) {
        var html = [];
        if (topLevelUl) {
            html.push('<ul class="nav navbar-nav" id="menu">');
            topLevelUl = false;
        } else {
            html.push('<ul class="dropdown-menu" role="menu">');
        }

        $(lst).each(function() {
            html.push(makeLI(this, topLevelUl, rootLvl))
        });
        html.push('</ul>');
        rootLvl = true;
        return html.join("\n");
    }

    function makeLI(elem, topLevelUl, rootLvl) {
        var html = [];
        if (elem.children && !rootLvl) {
            html.push('<li>');
        } else {
            html.push('<li>');
            rootLvl = false;
        }
        if (elem.title) {
            if (elem.children != undefined) {
                html.push('<a class="dropdown-toggle" data-toggle="dropdown" href="' + elem.customSelect + '">' + elem.title + ' </a>');
            } else {
                html.push('<a href="' + elem.customSelect + '">' + elem.title + ' </a>');
            }
        }

        if (elem.children) {
            html.push(makeUL(elem.children, topLevelUl, rootLvl));
        }
        html.push('</li>');
        return html.join("\n");
    }

    $(function() {
        var topLevelUl = true;
        $("#navigationDiv").html(makeUL(JSON.menu, topLevelUl, true));

    });

    $(document).ready(function() {
        $('.navbar a.dropdown-toggle').on('click', function(e) {
            var $el = $(this);
            var $parent = $(this).offsetParent(".dropdown-menu");
            $(this).parent("li").toggleClass('open');

            if(!$parent.parent().hasClass('nav')) {
                $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
            }

            $('.nav li.open').not($(this).parents("li")).removeClass("open");

            return false;
        });
    });
}
catch (err) {
    console.log('Navigation menu not found!', err);
}
// Navbar Plugins JS ends

// Pagination Plugin
try{
    var nameAZ = $('Pagination').attr('nameaz');
    var nameZA = $('Pagination').attr('nameza');
    var priceLH = $('Pagination').attr('pricelh');
    var priceHL = $('Pagination').attr('pricehl');
    var itemAZ = $('Pagination').attr('itemaz');
    var itemZA = $('Pagination').attr('itemza');
    var options;

    if (nameAZ=='true')
    {
        options=options+'<option value="nameAZ">Name [A-Z]</option>'
    }

    if (nameZA=='true')
    {
        options=options+'<option value="nameZA">Name [Z-A]</option>'
    }

    if (priceLH=='true')
    {
        options=options+'<option value="priceLH">Price [Low-High]</option>'
    }

    if (priceHL=='true')
    {
        options=options+'<option value="priceLH">Price [High-Low]</option>'
    }

    if (itemAZ=='true')
    {
        options=options+'<option value="priceLH">#Item [A-Z]</option>'
    }

    if (itemZA=='true')
    {
        options=options+'<option value="itemZA"># Item [Z-A]</option>'
    }

    var PaginationHTML='<Pagination style="display:block; min-height: 20px; padding: 20px;"><head><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><style>.fa{margin-top:24px;float: left;font-size: x-large;} select{margin-top:18px; height: 30px;float:left; width:auto;/* display:table-cell; */}a{color: #0088cc; text-decoration: none;}a:hover{color: #005580; text-decoration: underline;}h2{padding-top: 20px;}h2:first-of-type{padding-top: 0;}ul{padding: 0;}.pagination{height: 30px;/* margin: 18px 0; */ float:right;}.pagination ul{/* display: table-cell; */ /* IE7 inline-block hack */ *zoom: 1; margin-left: 0; margin-bottom: 0; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);}.pagination li{display: inline;}.pagination a{float: left; padding: 0 14px; line-height: 34px; text-decoration: none; border: 1px solid #ddd; border-left-width: 0;}.pagination a:hover,.pagination .active a{background-color: #f5f5f5;}.pagination .active a{color: #999999; cursor: default;}.pagination .disabled span,.pagination .disabled a,.pagination .disabled a:hover{color: #999999; background-color: transparent; cursor: default;}.pagination li:first-child a{border-left-width: 1px; -webkit-border-radius: 3px 0 0 3px; -moz-border-radius: 3px 0 0 3px; border-radius: 3px 0 0 3px;}.pagination li:last-child a{-webkit-border-radius: 0 3px 3px 0; -moz-border-radius: 0 3px 3px 0; border-radius: 0 3px 3px 0;}.pagination-centered{text-align: center;}.pagination-right{text-align: right;}.button{background-color: #e7e7e7; /* Green */ border: none; color: black; padding: 10px 32px; text-align: center; text-decoration: none;/* display: table-cell; */ font-size: 16px; margin: 14px 2px; cursor: pointer; float:right;}.paginationtext{margin-top:20px; font-size:medium; color:black; float:left;}</style></head><div class="container"> <div class="row" style="background-color:rgba(208, 208, 208, 0.33); border:groove; margin:5px;"> <div class="col-sm-3"><i style="margin-top:24px;float: left;font-size: x-large;" aria-hidden=true class="fa fa-list fa-2x"><span style=display:inline-block;width:10px></span> </i><i style="margin-top:24px;float: left;" aria-hidden=true class="fa fa-table fa-2x"><span style=display:inline-block;width:15px></span></i> <select style="margin-top:20px;"> <option value="nameAZ"> '+options+'</option> </select> </div><div class="col-sm-4"> <p class="paginationtext"> Showing 130 Products</p><button class="button">Show All</button> </div><div class="col-sm-5"> <div class="pagination"> <ul> <li><a href="#">Prev</a></li><li class="active"> <a href="#">1</a> </li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">Next</a></li></ul> </div></div></div></div></Pagination>'

    $('Pagination').html(PaginationHTML);
}
catch (err) {
    console.log('Pagination not found!', err);
}
// Pagination JS ends

// Popular products slider
try {
    var projectName = 'setNameHere';
    var rawData = {};
    var productData = {};
    var productHtml = "";
    var id = $("popularProducts").attr("id");
    var apiUrl = $('popularProducts').attr('apiurl');
    var apiUsername = $('popularProducts').attr('apiusername');
    var apiPassword = $('popularProducts').attr('apipassword');
    var numberOfItems = $('popularProducts').attr('numberofitems');

    $('#sliderListItems').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw">');

    $.ajax({
    type: 'GET',
    url: apiUrl,
    async: false,
    beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa( apiUsername + ":" + apiPassword));
        },
    dataType: 'json',
    success: function (data) {
        rawData = data.hits.hits; 
        productData = rawData;
    }
    });

    if(numberOfItems == 'all' || numberOfItems == '' ){
        productHtml = '';
        for( var i in productData){
            productHtml += '<div class="col-sm-3"> <a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=' + productData[i]._source.sku + '"> <div class="col-item"> <div class="photo"> <img src="http://104.239.249.114/live-api/web/images/'+ productData[i]._source.default_image+'" class="img-responsive" alt="a"/> </div><div class="info"> <div class="row"> <div class="price col-md-6"> <h5>'+ productData[i]._source.product_name + '</h5> <h5 class="price-text-color">$ '+ productData[i]._source.price_1 +'</h5> </div><div class="rating hidden-sm col-md-6"> <i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="fa fa-star"></i> </div></div><div class="separator clear-left"> <p class="btn-add"> <i class="fa fa-shopping-cart"></i><a href="#" class="hidden-sm">Add to cart</a></p><p class="btn-details"> <i class="fa fa-list"></i><a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=" class="hidden-sm">More details</a></p></div><div class="clearfix"> </div></div></div></a> </div>';
        }
    } else {
        productHtml = '';
        for( var i = 0; i<numberOfItems; i++ ){
            productHtml += '<div class="col-sm-3"> <a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=' + productData[i]._source.sku + '"> <div class="col-item"> <div class="photo"> <img src="http://104.239.249.114/live-api/web/images/'+ productData[i]._source.default_image+'" class="img-responsive" alt="a"/> </div><div class="info"> <div class="row"> <div class="price col-md-6"> <h5>'+ productData[i]._source.product_name + '</h5> <h5 class="price-text-color">$ '+ productData[i]._source.price_1 +'</h5> </div><div class="rating hidden-sm col-md-6"> <i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="price-text-color fa fa-star"></i><i class="price-text-color fa fa-star"> </i><i class="fa fa-star"></i> </div></div><div class="separator clear-left"> <p class="btn-add"> <i class="fa fa-shopping-cart"></i><a href="#" class="hidden-sm">Add to cart</a></p><p class="btn-details"> <i class="fa fa-list"></i><a href="http://localhost/websites/' + projectName + '/product-detail.layout?sku=" class="hidden-sm">More details</a></p></div><div class="clearfix"> </div></div></div></a> </div>';
        }
    }

    $('#sliderListItems').html(productHtml);
}
catch (err) {
    console.log('Popular products slider not found!', err);
}
// Popular products ends

// dataField JS
// const MyGroup = Vue.component('datafieldgroup', {
//   template: `<div class="dfgroup">
//                     <div class="dfrepeate" v-for="item in items"><slot :text="item"></slot></div>
//             </div>`,
//   props: ['data_api', 'data_schema'],
//   computed: {},
//   data: function() {
//     return {
//       items: []
//     }
//   },
//   mounted() {
//     this.getData()
//   },
//   methods: {
//     getData() {
//       let self = this;
//       console.log("data_schema", this.data_schema)
//       console.log("data_api", this.data_api)
//       if (this.data_schema != undefined) {
//         if (this.data_schema.length > 0) {
//           console.log("hello")
//           this.data_schema;
//           let schemaVal = this.data_schema.split(":");
//           let connString = $.trim(schemaVal[0]);
//           let schemaName = $.trim(schemaVal[1]);
//           let apiUrl = 'http://172.16.230.80:3080/connectiondata/' + connString + '?schemaname=' + schemaName;
//           $.getJSON(apiUrl, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         } else {
//           $.getJSON(this.data_api, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         }
//       } else {
//         $.getJSON(this.data_api, function(data) {
//           console.log(data)
//           self.items = data;
//         });
//       }
//     }
//   }
// });

// const MyObj = Vue.component('datafieldobject', {
//   template: `<div class="dfgroup">
//                     <div class="dfrepeate"><slot :text="items"></slot></div>
//             </div>`,
//   props: ['data_api', 'data_schema'],
//   computed: {},
//   data: function() {
//     return {
//       items: []
//     }
//   },
//   mounted() {
//     this.getData()
//   },
//   methods: {
//     getData() {
//       let self = this;
//       console.log("data_schema", this.data_schema)
//       console.log("data_api", this.data_api)
//       if (this.data_schema != undefined) {
//         if (this.data_schema.length > 0) {
//           console.log("hello")
//           this.data_schema;
//           let schemaVal = this.data_schema.split(":");
//           let connString = $.trim(schemaVal[0]);
//           let schemaName = $.trim(schemaVal[1]);
//           let apiUrl = 'http://172.16.230.80:3080/connectiondata/' + connString + '?schemaname=' + schemaName;
//           $.getJSON(apiUrl, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         } else {
//           $.getJSON(this.data_api, function(data) {
//             console.log(data)
//             self.items = data;
//           });
//         }
//       } else {
//         $.getJSON(this.data_api, function(data) {
//           console.log(data)
//           self.items = data;
//         });
//       }
//     }
//   }
// });

// const MyList = Vue.component('datafieldlist', {
//   template: '<div class="dflist"><div v-for="item in items"><slot :text="item"></slot></div></div>',
//   props: ['items']
// });

// const MyText = Vue.component('datafieldtext', {
//   template: '<div class="dftext"><h3>{{text}}</h3></div>',
//   props: ['text']
// });

// new Vue({
//   el: '#app',
//   components: {
//     MyGroup,
//     MyList,
//     MyText
//   }
// })
// dataField js ends

// Payment JS
try{
    var paymentgateways = [];

    var userEmail = '';
    var projectName = '';
    var configDataUrl = '';
    // var baseURL = 'http://localhost:3032';
    // var socketURL = 'http://localhost:4032';
    var baseURL = 'http://api.flowz.com/serverapi';
    var socketHost = 'http://ws.flowz.com:4032';

    $(document).ready(function() {
        getProjectInfo();
        // ImpletementSocekt();
    });

    async function getProjectInfo() {
        await $.getJSON( "./assets/project-details.json", function( data ) {  
            var configData = data;
            userEmail = data[0].projectOwner;
            projectName = data[0].projectName;

            configDataUrl = baseURL + "/project-configuration?userEmail=" + userEmail + "&websiteName=" + projectName;
        });
        getConfigData();
    }

    async function getConfigData () {

        await $.getJSON( configDataUrl , function( data ) {  
            var configData = data.data[0].configData;
            // globalVariables = configData[1].projectSettings[1].GlobalVariables;
            paymentgateways=configData[1].projectSettings[1].PaymentGateways
        console.log('configData',configData[1].projectSettings[1].PaymentGateways)
        }); 
        Paymentgateways();
    }


    async function Paymentgateways () {
        var paymentbuttons=''
        for(let i=0;i<paymentgateways.length;i++){
            if(paymentgateways[i].checked==true){
                paymentbuttons=paymentbuttons+'<button type="button" class="btn" data-id="'+ paymentgateways[i].name+'" title="'+ paymentgateways[i].description+'">'+paymentgateways[i].gateway+'</button>'
            }
        }
        $('paymentgateway').replaceWith(paymentbuttons);
            
    }
}
catch (err) {
    console.log('Error in Payment Module: ', err);
}
// Payment JS Ends