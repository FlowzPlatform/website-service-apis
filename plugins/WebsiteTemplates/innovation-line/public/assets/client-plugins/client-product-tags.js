product_tags = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': project_settings.tag_products_api_url+"?tag_id="+getParameterByName('tid')+"&website="+website_settings['projectID'],
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

$.ajax({
    'async': false,
    'type': "GET",
    'global': false,
    'dataType': 'json',
    'url': project_settings.tag_api_url+"?id="+getParameterByName('tid'),
    'success': function (res) {
        $('#myProductTags .main-title').html("<i class='fa fa-tag'></i> "+res.data[0].tag_name);
    }
});


product_tag_data(product_tags);
async function product_tag_data(product_tags) {
    if(product_tags != null && product_tags.length > 0)
    {
        showPageAjaxLoading();
        await sleep(100);
        $.each( product_tags, function( key, tagArray ) {
            $.ajax({
                type: 'GET',
                url: project_settings.product_api_url+"?_id="+tagArray.product_id+"&source=default_image,product_id,sku,product_name,currency,min_price,description",
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
                },
                dataType: 'json',
                success: function (data) {
                    let productData = data.hits.hits;
                    let listHtml1 = "";
                    let listHtml = $('#myProductTags .js-list').html();
                    if(productData.length > 0)
                    {
                        let productImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                        if(productData[0]._source.images != undefined){
                            productImage = productData[0]._source.images[0].images[0].secure_url
                        }
                        listHtml1 = listHtml.replace('#data.image#',productImage);

                        listHtml1 = listHtml1.replace(/#data.id#/g,tagArray.id);
                        
                        listHtml1 = listHtml1.replace('#data.title#',productData[0]._source.product_name);
                        
                        listHtml1 = listHtml1.replace('#data.sku#',productData[0]._source.sku);
                        
                        listHtml1 = listHtml1.replace('#data.price#',parseFloat(productData[0]._source.min_price).toFixed(project_settings.price_decimal));
                        
                        listHtml1 = listHtml1.replace('#data.currency#',productData[0]._source.currency);

                        let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+tagArray.product_id;
                        
                        listHtml1 = listHtml1.replace(/#data.product_link#/g,detailLink);

                        listHtml1 = listHtml1.replace('#data.description#',productData[0]._source.description);       
                    }

                    $('#myProductTags .listing').append(listHtml1);

                    if(user_id == null) {
                        $("#myProductTags .listing").find(".item-price").remove()
                    }
                }
            });
        });

        hidePageAjaxLoading();
    }
    else {
        $('#myProductTags .listing').html('No records found.');
    }
}