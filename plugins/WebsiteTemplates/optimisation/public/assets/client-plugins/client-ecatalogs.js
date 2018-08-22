let ecatalogUrl = project_settings.ecatalogs_api_url+"?website="+website_settings['projectID'];
if(getParameterByName('fcid')) {
    ecatalogUrl += "&fcid="+getParameterByName('fcid');
}

ecatalogs = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': ecatalogUrl,
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

ecatalog_categories = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': project_settings.ecatalog_category_api_url+"?website="+website_settings['projectID'],
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

ecatalog_data(ecatalogs);
async function ecatalog_data(ecatalogs) {
    if(ecatalogs != null && ecatalogs.length > 0)
    {
        showPageAjaxLoading();
        await sleep(100);

        let listHtml = $('#myEcatalogs .js-list').html();
        $.each( ecatalogs, function( key, ecatalogArray ) {
            let listHtml1 = "";

            listHtml1 = listHtml.replace('#ecatalog-image#',ecatalogArray.ecatalog_image);

            listHtml1 = listHtml1.replace(/#ecatalog-id#/g,ecatalogArray.id);

            listHtml1 = listHtml1.replace('#ecatalog-title#',ecatalogArray.ecatalog_name);

            listHtml1 = listHtml1.replace(/#ecatalog-image-link#/g,ecatalogArray.ecatalog_image);

            if(ecatalogArray.ecatalog_url == ""){
                listHtml1 = listHtml1.replace(/#data.pdflink#/g,ecatalogArray.ecatalog_pdf);
            }else{
                listHtml1 = listHtml1.replace(/#data.pdflink#/g,ecatalogArray.ecatalog_url);
            }
            $('#myEcatalogs .listing').append(listHtml1);
            if(ecatalogArray.ecatalog_url == ""){
                $(".download-pdf-"+ecatalogArray.id).attr("download",true)
            }
        });


        hidePageAjaxLoading();
    }
    else {
        $('#myEcatalogs .listing').html('No records found.');
    }
}


$(document).on("click", '.js-open-modal-ecatalog', function(e){
    $('#modal-table').addClass('model-popup-black');
    $('#modal-table').addClass('banner-copy-block add-flyer-modal');
    $("#modal-table").find(".modal-title").html('<i class="fa fa-eye"></i> View E-Catalog');
    $("#modal-table").find(".modal-dialog").addClass("modal-lg");
    let ecataloguHtml = $(".js_display_ecatalog").html();
    ecataloguHtml = ecataloguHtml.replace("#ecatalog-image-link#",$(this).attr("data-image"));
    $(".js_add_html").html(ecataloguHtml);
    $('#modal-table').modal('show');
});
