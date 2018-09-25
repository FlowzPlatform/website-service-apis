// $(function() {
//     $('.lazyLoad').Lazy({
//         scrollDirection: 'vertical',
//         effect: 'fadeIn',
//         visibleOnly: true,
//         onError: function(element) {
//             console.log('error loading ' + element.data('src'));
//         }
//     });
// });

$(document).ready(async function(){
    // Awards
    $(".owl-brand").closest(".row").css({"display": "flex"});
    $(".owl-brand").owlCarousel({
        stopOnHover : true,
        navigation:true,
        items : 7,
        itemsDesktop: [1199, 7],
        itemsDesktopSmall: [979, 7],
        itemsTablet: [767, 2],
        itemsMobile: [479, 2]
    });

    // featured product
    if($(".js-tag-featured-product-list").length > 0){
        let tagHtmlList = $(".js-tag-featured-product-list");
        let productBoxHtml = $(".js-tag-featured-product-list").find('.js-list').html()
        let productSlug = $(".js-tag-featured-product-list").attr("data-slug")
        
        if(productSlug != ""){
            let replaceProductBox = '';
            replaceProductBox = await tagProducts("tag_slug="+productSlug,productBoxHtml)
            if(replaceProductBox != ''){
                tagHtmlList.find('.js-list').html(replaceProductBox)
                tagHtmlList.removeClass('hide')
                tagHtmlList.find("#owl-carousel-recommeded").closest(".row").css({"display": "flex"});
                
                $("#owl-carousel-recommeded").owlCarousel({
                    navigation: true,
                    items:6,
                    autoPlay: 3200,
                    margin: 10,
                    autoplayHoverPause: true,
                    lazyLoad: true,
                    stopOnHover: true,
                    itemsCustom: false,
                    itemsDesktop: [1170, 6],
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
            }
        }
    }
})

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
        catHtml += '<li><a href="search.html?Categorylist='+catArray.name+'"><div class="pro-box product-cat-box"><div class="pro-image"><img src="'+catArray.icon+'" class="img-responsive center-block" alt="'+catArray.name+'" title="'+catArray.icon+'"></div></div><div class="item-title product-cat-title">'+catArray.name+'</div></a></li>';
    });
    $('.js-show-category').html(catHtml);
    $('.js-category-list').removeClass('hide');
}