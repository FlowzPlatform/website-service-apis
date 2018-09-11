let flyerUrl = project_settings.flyers_api_url+"?website="+website_settings['projectID'];
if(getParameterByName('fcid')) {
    flyerUrl += "&fcid="+getParameterByName('fcid');
}

flyers = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': flyerUrl,
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

flyer_categories = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': project_settings.flyer_category_api_url+"?website="+website_settings['projectID'],
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

flyer_data(flyers);
async function flyer_data(flyers) {
    if(flyers.length > 0)
    {
        showPageAjaxLoading();
        await sleep(100);

        let listHtml = $('#myFlyers .js-list').html();
        $.each( flyers, function( key, flyerArray ) {            
            let listHtml1 = "";

            listHtml1 = listHtml.replace('#flyer-image#',flyerArray.flyer_image);

            listHtml1 = listHtml1.replace(/#flyer-id#/g,flyerArray.id);
            
            listHtml1 = listHtml1.replace(/#flyer-title#/g,flyerArray.flyer_name);
                            
            listHtml1 = listHtml1.replace(/#flyer-image-link#/g,flyerArray.flyer_image);

            listHtml1 = listHtml1.replace(/#flyer-pdf-link#/g,flyerArray.flyer_pdf);
            if(typeof flyerArray.client_friendly_pdf != "undefined")
            {
                listHtml1 = listHtml1.replace(/#flyer-client_friendly-link#/g,flyerArray.client_friendly_pdf);
            }
            $('#myFlyers .listing').append(listHtml1);
            if(typeof flyerArray.client_friendly_pdf == "undefined")
            {
                $('#myFlyers .listing').find('.product-'+flyerArray.id+' .js_client_friendly_pdf').remove();
            }
        });

        
        hidePageAjaxLoading();
    }
    else {
        $('#myFlyers .listing').html('No records found.');
    }
}