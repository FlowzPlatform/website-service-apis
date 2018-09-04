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
        tagHtml += '<div class="item"> <div class="pro-box"> <div class="pro-image box01"> <div class="product-img-blk"> <a href="productTags.html?locale=en_us&tid='+tagArray.id+'" target="_blank"><img src="'+tagArray.tag_icon+'" class="img-responsive center-block" alt=""> </a> </div></div><div class="pro-desc" style="min-height:0"> <a href="productTags.html?locale=en_us&tid='+tagArray.id+'" target="_blank"> '+tagArray.tag_name+' </a></div><div class="clearfix"></div></div></div>';
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
        'url': project_settings.category_api_url + "?website=" + website_settings['projectID'] + "&homepage=true",
        'success': function (res) {
            console.log("res == ",res.data)
            tmp = res.data;
        }
    });
    return tmp;
}();

if(catDetails.length > 0) {
    let catHtml = "";
    $.each( catDetails, function( key, catArray ) {
        catHtml += '<div class="in-box-cont"><div class="right-part"><a href="search.html?SearchSensor='+catArray.name+'"><img class="lazyLoad" data-src="'+catArray.icon+'" alt=""></a></div><div class="left-part"><div class="pro-title"><a href="search.html?SearchSensor='+catArray.name+'" data-item-type="product-category">'+catArray.name+'</a></div></div></div>';
    });
    $('.js-show-category').html(catHtml);
    $('.js-category-list').removeClass('hide');
}

