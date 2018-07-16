var grand_total=0.00;
var total_qty=0;
showPageAjaxLoading()
if(user_id == null) {
  hidePageAjaxLoading()
	window.location = "login.html";
}

document.addEventListener("DOMContentLoaded", function(event)
{
  if(websiteConfiguration.transaction.place_order.checkout.status == 0){
    let html = 'Access Denied';
    $('#shopping_cart').html(html);
    return false;
  }
})

$.ajax({
  type : 'GET',
  url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
  dataType : 'json',
  success : function(response_data) {
    var newHtml = "";
    if (response_data!= "") {
      for (var key in response_data) {
        var productHtml = $(".checkout_product_list").find('tbody tr:first').clone().wrap('<p>').parent();
        $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+"?_id="+response_data[key].product_id,
          async: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
          },
          dataType: 'json',
          success: function (data) {
            rawData = data.hits.hits;
            productData = rawData;
            let ProductImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
            if(productData[0]._source.images != undefined)  {
                ProductImage = productData[0]._source.images[0].images[0].secure_url;
            }
            productHtml.find(".js-checkout-image").attr('src',ProductImage);
            productHtml.find(".js-checkout-product-name").html(productData[0]._source.product_name);
            if(typeof response_data[key].special_instruction != "undefined" && response_data[key].special_instruction!='')
            {
              productHtml.find(".js-checkout-description").html(response_data[key].special_instruction);
            }

            productHtml.find(".js-checkout-unit-price").html("$"+parseFloat(response_data[key].unit_price).toFixed(project_settings.price_decimal));
            productHtml.find(".js-checkout-qty").html(response_data[key].total_qty);

            // charges
            let charges=0;
            if(typeof response_data[key].charges != "undefined")
            {
              for(let charge_list in response_data[key].charges)
              {
                charges = charges+parseFloat(response_data[key].charges[charge_list]);
              }
            }

            // END - charges

            // shipping charge
            let shipping_charges=0.00;
            if(typeof response_data[key].shipping_method.shipping_detail != "undefined")
            {
              var shipping_detail = response_data[key].shipping_method.shipping_detail;

              for(var shippingKey in shipping_detail)
              {
                var shipping_details = shipping_detail[shippingKey].shipping_detail;

                if(shipping_details.shipping_charge != "")
                {
                  shipping_charges = shipping_charges + + parseFloat(shipping_details.shipping_charge);
                }
              }
            }
            // END - shipping charge

            // Taxcloud
            // console.log('Taxcloud', response_data[key])
            let tax = 0.00;
            if (response_data[key].hasOwnProperty('taxcloud')) {
              tax = response_data[key].taxcloud.tax_amount
            }

            var total = parseFloat(response_data[key].total_qty)*parseFloat(response_data[key].unit_price)+charges+shipping_charges + tax ;
            total = total.toFixed(project_settings.price_decimal);

            productHtml.find(".js-checkout-product-total").html("$"+total);
            newHtml += productHtml.html();


            grand_total = grand_total + parseFloat(total);
            total_qty = total_qty + parseInt(response_data[key].total_qty);
          }
        });
      }

      grand_total = grand_total.toFixed(project_settings.price_decimal)
      $(newHtml).insertAfter(".js-replace-products");
      $(".js-checkout-grand-total").html("$"+grand_total);
      $(".checkout_product_list").find('tbody tr:first').remove();
      $('.js-hide-div').removeClass("js-hide-div");
      hidePageAjaxLoading()
    }
  },
  error: function(err){
    hidePageAjaxLoading()
  }
});
