var grand_total=total_qty=0;

$.ajax({
  type : 'GET',
  url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2',
  dataType : 'json',
  success : function(response_data) {
    // console.log(response_data);
    var newHtml = "";
    if (response_data!= "") {
      for (var key in response_data) {
        var productHtml = $(".checkout_product_list").find('tbody tr:first').clone().wrap('<p>').parent();
        $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+response_data[key].product_id,
          async: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
          },
          dataType: 'json',
          success: function (data) {
            rawData = data.hits.hits;
            productData = rawData;
            productHtml.find(".js-checkout-image").attr('src',project_settings.product_api_image_url+productData[0]._source.default_image);
            productHtml.find(".js-checkout-product-name").html(productData[0]._source.product_name);
            if(typeof response_data[key].special_instruction != "undefined")
            {
              productHtml.find(".js-checkout-description").html(response_data[key].special_instruction);
            }

            productHtml.find(".js-checkout-unit-price").html("$"+response_data[key].unit_price);
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
            var total = parseFloat(response_data[key].total_qty)*parseFloat(response_data[key].unit_price)+charges;

            productHtml.find(".js-checkout-product-total").html("$"+total);
            newHtml += productHtml.html();


            grand_total = grand_total + total;
            total_qty = total_qty + parseInt(response_data[key].total_qty);
          }
        });
      }

      $(newHtml).insertAfter(".js-replace-products");
      $(".js-checkout-grand-total").html("$"+grand_total);
      $(".checkout_product_list").find('tbody tr:first').remove();
    }
  }
});
