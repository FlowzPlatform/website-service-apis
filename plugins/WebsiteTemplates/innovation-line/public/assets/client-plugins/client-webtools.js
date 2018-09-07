let artTemplateUrl = project_settings.webtools_api_url+"?website="+website_settings['projectID'];
if(getParameterByName('sku')) {
    artTemplateUrl += "&sku="+getParameterByName('sku');
}

let webtools = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': artTemplateUrl,
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

webtools_data(webtools);
async function webtools_data(webtools) {
    if(webtools.length > 0)
    {
        showPageAjaxLoading();
        await sleep(100);
        
        if($('#myArtTemplates .js-list').html() !== undefined) {
            let listHtml = $('#myArtTemplates .js-list').html();
            $.each( webtools, function( key, artTemplateArray ) {            
                let listHtml1 = "";
    
                listHtml1 = listHtml.replace(/#art-template-id#/g,artTemplateArray.id);
    
                listHtml1 = listHtml1.replace('#art-template-pdf#',artTemplateArray.art_pdf);
    
                listHtml1 = listHtml1.replace('#art-template-thumb#',artTemplateArray.art_pdf_thumb);
    
                listHtml1 = listHtml1.replace('#art-template-sku#',artTemplateArray.sku);
               
                $('#myArtTemplates .listing').append(listHtml1);
            });
        }
        else if($('#myvideoLibrary .js-list').html() !== undefined) {
            let listHtml = $('#myvideoLibrary .js-list').html();
            $.each( webtools, function( key, videoArray ) {
                if(videoArray.brand_video_url != '' && videoArray.nonbrand_video_url != '') {         
                    let listHtml1 = "";
        
                    listHtml1 = listHtml.replace(/#video-template-id#/g,videoArray.id);
        
                    listHtml1 = listHtml1.replace(/#video-library-brand-url#/g,videoArray.brand_video_url);
        
                    listHtml1 = listHtml1.replace(/#video-library-nonbrand-url#/g,videoArray.nonbrand_video_url);

                    listHtml1 = listHtml1.replace(/#video-library-sku#/g,videoArray.sku);

                    $('#myvideoLibrary .listing').append(listHtml1);
                }
            });
        }
        
        hidePageAjaxLoading();
    }
    else {
        if($('#myArtTemplates .js-list').html() !== undefined) {
            $('#myArtTemplates .js-product-grid').html('No records found.');
        }
        else if($('#myvideoLibrary .js-list').html() !== undefined) {
            $('#myvideoLibrary .js-product-grid').html('No records found.');
        }
    }
}

$(document).on("click","#art_search",function() {
    if($('#art_sku').val() !== undefined && $('#art_sku').val() != '')
        location.href = "artTemplates.html?sku="+$('#art_sku').val();
});

$(document).on("click","#art_reset",function() {
    location.href = "artTemplates.html";
});

$(document).on("click","#video_search",function() {
    if($('#video_sku').val() !== undefined && $('#video_sku').val() != '')
        location.href = "videoLibrary.html?sku="+$('#video_sku').val();
});

$(document).on("click","#video_reset",function() {
    location.href = "videoLibrary.html";
});