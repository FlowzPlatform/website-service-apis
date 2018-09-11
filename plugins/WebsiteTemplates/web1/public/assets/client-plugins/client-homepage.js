let img1 = $('Slider').attr('Image1');
let img2 = $('Slider').attr('Image2');
let img3 = $('Slider').attr('Image3');
let img4 = $('Slider').attr('Image4');
let img5 = $('Slider').attr('Image5');

let i1 = i2 = i3 = i4 = i5 = "http://placehold.it/1146x466";
if(img1 !=''){ i1=img1 }
if(img2 !=''){ i2=img2 }
if(img3 !=''){ i3=img3 }
if(img4 !=''){ i4=img4 }
if(img5 !=''){ i5=img5 }

let SliderHtml='<Slider style="display: block; min-height: 50px"> <style>body{padding: 20px 0;}#slider{margin: 0 auto; width: 1146px; position: relative;}#slides{background: #fff; padding: 5px; -webkit-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -moz-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -o-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -ms-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;}.inner{width: 500%;}.inner:after{display: block; height: 0; clear: both;}.page{float: left; width: 20%;}.page img{width: 100%; height: 466px;}#overflow{overflow: hidden;}#slider input{display: none;}#controls{position: absolute; width: 94%; top: 216px; left: 3%; height: 50px;}#controls label{display: none; opacity: 0.8; cursor: pointer;}#controls label:hover{opacity: 0.8;}#slide1:checked ~ #controls label:nth-child(2), #slide2:checked ~ #controls label:nth-child(3), #slide3:checked ~ #controls label:nth-child(4), #slide4:checked ~ #controls label:nth-child(5), #slide5:checked ~ #controls label:nth-child(1){width: 0; height: 0; border-top: 20px solid transparent; border-left: 20px solid rgb(255, 255, 255); border-bottom: 20px solid transparent; float: right; margin-right: -30px; display: block;}#slide1:checked ~ #controls label:nth-child(5), #slide2:checked ~ #controls label:nth-child(1), #slide3:checked ~ #controls label:nth-child(2), #slide4:checked ~ #controls label:nth-child(3), #slide5:checked ~ #controls label:nth-child(4){width: 0; height: 0; border-top: 20px solid transparent; border-bottom: 20px solid transparent; border-right: 20px solid rgb(255, 255, 255); float: left; display: block; margin-left: -27px;}#slide1:checked ~ #slides .inner{margin-left: 0;}#slide2:checked ~ #slides .inner{margin-left: -100%;}#slide3:checked ~ #slides .inner{margin-left: -200%;}#slide4:checked ~ #slides .inner{margin-left: -300%;}#slide5:checked ~ #slides .inner{margin-left: -400%;}#active{text-align: center; margin-top: 10px; text-align: center; vertical-align: middle; padding-right: 3px;}#active label{padding: 6px; width: 230px; height: 53px; background: #f1f1f1; display: table-cell; cursor: pointer; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; line-height: 19px; font-family: sans-serif; font-size: small;}#active label:hover{background: #c4bebe;}#slide1:checked ~ #active label:nth-child(1), #slide2:checked ~ #active label:nth-child(2), #slide3:checked ~ #active label:nth-child(3), #slide4:checked ~ #active label:nth-child(4), #slide5:checked ~ #active label:nth-child(5){background: #dddddd;}#slides .inner{-webkit-transition: all 0.8s ease-in-out; -moz-transition: all 0.8s ease-in-out; -ms-transition: all 0.8s ease-in-out; -o-transition: all 0.8s ease-in-out; transition: all 0.8s ease-in-out;}#slide1:checked ~ #controls label:nth-child(2):before {content: "";border-top: 20px solid transparent;border-left: 20px solid #333;border-bottom: 20px solid transparent;position: absolute;top: 0;right: -27px;}#slide2:checked ~ #controls label:nth-child(3):before {content: "";border-top: 20px solid transparent;border-left: 20px solid #333;border-bottom: 20px solid transparent;position: absolute;top: 0;right: -27px;}#slide3:checked ~ #controls label:nth-child(4):before {content: "";border-top: 20px solid transparent;border-left: 20px solid #333;border-bottom: 20px solid transparent;position: absolute;top: 0;right: -27px;}#slide4:checked ~ #controls label:nth-child(5):before {content: "";border-top: 20px solid transparent;border-left: 20px solid #333;border-bottom: 20px solid transparent;position: absolute;top: 0;right: -27px;}#slide5:checked ~ #controls label:nth-child(1):before {content: "";border-top: 20px solid transparent;border-left: 20px solid #333;border-bottom: 20px solid transparent;position: absolute;top: 0;right: -27px;}#slide1:checked ~ #controls label:nth-child(5):before {content: "";border-top: 20px solid transparent;border-bottom: 20px solid transparent;border-right: 20px solid rgb(0, 0, 0);position: absolute;left: -23px;top: 0;}#slide2:checked ~ #controls label:nth-child(1):before {content: "";border-top: 20px solid transparent;border-bottom: 20px solid transparent;border-right: 20px solid rgb(0, 0, 0);position: absolute;left: -23px;top: 0;}#slide3:checked ~ #controls label:nth-child(2):before {content: "";border-top: 20px solid transparent;border-bottom: 20px solid transparent;border-right: 20px solid rgb(0, 0, 0);position: absolute;left: -23px;top: 0;}#slide4:checked ~ #controls label:nth-child(3):before {content: "";border-top: 20px solid transparent;border-bottom: 20px solid transparent;border-right: 20px solid rgb(0, 0, 0);position: absolute;left: -23px;top: 0;}#slide5:checked ~ #controls label:nth-child(4):before {content: "";border-top: 20px solid transparent;border-bottom: 20px solid transparent;border-right: 20px solid rgb(0, 0, 0);position: absolute;left: -23px;top: 0;}</style> <div id="slider"> <input type="radio" id="slide1" name="slider" checked/> <input type="radio" id="slide2" name="slider"/> <input type="radio" id="slide3" name="slider"/> <input type="radio" id="slide4" name="slider"/> <input type="radio" id="slide5" name="slider"/> <div id="slides"> <div id="overflow"> <div class="inner"> <div class="page"><img src="'+i1+'" class="lazyLoad" alt="banner" title="banner" /> </div><div class="page"><img src="'+i2+'" class="lazyLoad" alt="banner" title="banner" /> </div><div class="page"><img src="'+i3+'" class="lazyLoad" alt="banner" title="banner" /> </div><div class="page"><img src="'+i4+'" class="lazyLoad" alt="banner" title="banner" /> </div><div class="page"><img src="'+i5+'" class="lazyLoad" alt="banner" title="banner" /> </div></div></div></div><div id="controls"> <label for="slide1"></label> <label for="slide2"></label> <label for="slide3"></label> <label for="slide4"></label> <label for="slide5"></label> </div></Slider>';
$('Slider').html(SliderHtml);


$(function() {
    $('.lazyLoad').Lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
});

let tagInfo = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'url': project_settings.tags_api_url + "?website=" + website_settings['projectID'],
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

if(tagInfo.length > 0) {
    let tagHtml = "";
    $.each( tagInfo, function( key, tagArray ) {
        tagHtml += '<div class="item"> <div class="pro-box"> <div class="pro-image box01"> <div class="product-img-blk"> <a href="productTags.html?locale=en_us&tid='+tagArray.id+'" target="_blank"><img src="'+tagArray.tag_icon+'" class="img-responsive center-block lazyLoad" alt="'+tagArray.tag_name+'" title="'+tagArray.tag_name+'"> </a> </div></div><div class="pro-desc" style="min-height:0"> <a href="productTags.html?locale=en_us&tid='+tagArray.id+'" target="_blank"> '+tagArray.tag_name+' </a></div><div class="clearfix"></div></div></div>';
    });
    $('.js-tag-listing').html(tagHtml);
    $('.js-product-tags').removeClass('hide');
}

$("#owl-product-tags").owlCarousel({
    navigation: true,
    items:4,
    autoPlay: 3200,
    margin: 10,
    autoplayHoverPause: true,
    lazyLoad: true,
    stopOnHover: true,
    itemsCustom: false,
    itemsDesktop: [1170, 4],
    itemsDesktop: [1024, 3],
    itemsTabletSmall: false,
    itemsMobile: [400, 2],
    itemsMobile: [399, 1],
    singleItem: false,
    itemsScaleUp: false,
    afterInit: function (elem) {
        var that = this
        that.owlControls.prependTo(elem)
    }
});


let catDetails = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'url': project_settings.category_api_url + "?website=" + website_settings['projectID'] + "&homepage=true&&status=true",
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

if(Array.isArray(catDetails) && catDetails.length > 0) {
    let catHtml = "";
    $.each( catDetails, function( key, catArray ) {
        catHtml += '<div class="in-box-cont"><div class="right-part"><a href="search.html?SearchSensor='+catArray.name+'"><img class="lazyLoad" data-src="'+catArray.icon+'" alt="'+catArray.name+'" title="'+catArray.name+'"></a></div><div class="left-part"><div class="pro-title"><a href="search.html?SearchSensor='+catArray.name+'" data-item-type="product-category">'+catArray.name+'</a></div></div></div>';
    });
    $('.js-show-category').html(catHtml);
    $('.js-category-list').removeClass('hide');
}

