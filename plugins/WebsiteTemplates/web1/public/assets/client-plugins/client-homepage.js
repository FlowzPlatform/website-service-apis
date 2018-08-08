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

var tagInfo = function () {
    var tmp = null;
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
        tagHtml += '<div class="in-box-cont"><div class="right-part"><a href="productTags.html?locale=en_us&tid='+tagArray.id+'"><img width="134" height="118" class="lazyLoad" data-src="'+tagArray.tag_icon+'" alt=""></a></div><div class="left-part"><div class="pro-title"><a href="javascript:;">'+tagArray.tag_name+'</a></div><div class="pro-btn"><a href="productTags.html?locale=en_us&tid='+tagArray.id+'">See All</a></div></div></div>';
    });
    $('.js-tag-listing').html(tagHtml);
    $('.js-product-tags').removeClass('hide');
}
