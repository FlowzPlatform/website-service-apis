// section cart count

document.addEventListener("DOMContentLoaded", function(event){
    if (user_id != null ) {
        if(websiteConfiguration.transaction.place_order.cart_list.parent_status == 0 && websiteConfiguration.transaction.place_order.cart_list.status == 0){
            let html = 'Access Denied';
            $('.main-shopping-cart-block').html(html);
            return false;
        }
    }
  
    $("#js-cart_data").addClass("hide");
  
    if(user_details != null && $('#js-cart_data').length > 0) {
        showCart();
    }
    else if(user_details != null) {
        $.ajax({
            type : 'GET',
            url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
            dataType : 'json',
            success : function(response_data) {
                if (response_data!= "") {
                    $("#cartCount").html(response_data.length);
                }
            }
        })
    }
    else {
        $('#js-cart_data').html("<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'><div class='col-sm-6 col-md-6 col-lg-6 col-xs-12'>No records found.</div></div>")    
        $("#js-cart_data").removeClass('hide');
    }
});



// section advance search

let optionsAsCategory = '';
let CategoryArr = [];
let ResultCategory = [];
let MinPriceVal = '';
let MaxPriceVal = '';
let KeywordTextVal  = '';
let SkuTextVal = '';

if(getParameterByName("MinPrice")){
    MinPriceVal = getParameterByName("MinPrice")
}
if(getParameterByName("MaxPrice")){
    MaxPriceVal = getParameterByName("MaxPrice")
}

if(getParameterByName("KeywordSensor")){
    KeywordTextVal = getParameterByName("KeywordSensor")
}

if(getParameterByName("SkuSensor")){
    SkuTextVal = getParameterByName("SkuSensor")
}

$(document).ready(function(){
    if($("#min_price").length > 0){
        $("#min_price").val(MinPriceVal)
    }
    if($("#max_price").length > 0){
        $("#max_price").val(MaxPriceVal)
    }
    if($("#KeywordSensor").length > 0){
        $("#KeywordSensor").val(KeywordTextVal)
    }
    if($("#SkuSensor").length > 0){
        $("#SkuSensor").val(SkuTextVal)
    }

    let CategoryFilter1 = {
        "async": true,
        "crossDomain": true,
        "url": project_settings.search_api_url + '?size=0',
        "method": "POST",
        "headers": {
            "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
        }
    }

    $.ajax(CategoryFilter1).done(function (data) {
        let total_hits_CategoryFilter = data.hits.total;
        let CategoryFilter2 = {
            "async": true,
            "crossDomain": true,
            "url": project_settings.search_api_url + '?from=0&size='+total_hits_CategoryFilter,
            "method": "POST",
            "headers": {
                "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
            }
        }
        $.ajax(CategoryFilter2).done(function (data) {
            $.each(data.hits.hits,  function( index1, value1 ) {
                $.each(value1._source.categories,  function( index2, value2 ) {
                CategoryArr.push(value2);
                ResultCategory = _.uniq(CategoryArr);
                ResultCategory.sort();
                
                });
            });
            $.each(ResultCategory,  function( index3, value3 ) {
                optionsAsCategory += "<option value='" + value3 + "'>" + value3 + "</option>"; 
            });
            $( 'select#CategorySensor' ).append( optionsAsCategory ); 
            $(".multi_category").multiselect({

            });
        });        
    });

    $( ".search-button" ).on( "click", function() {
        let formId = $(this).closest('form').attr("id")
        $("#"+formId).submit(function(e){
            e.stopImmediatePropagation()
             let KeywordVal = $('#KeywordSensor').val();
             let SkuVal = $('#SkuSensor').val();
             let CategoryVal = $('#CategorySensor').val();
             let BrandVal = $('#BrandSensor').val();
             MinPriceVal = $('#min_price').val();
             MaxPriceVal = $('#max_price').val();
             window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+KeywordVal+'&'+'CategorySensor='+CategoryVal+'&'+'SkuSensor='+SkuVal+'&'+'MinPrice='+MinPriceVal+'&'+'MaxPrice='+MaxPriceVal;
            return false;
        })
    });
});