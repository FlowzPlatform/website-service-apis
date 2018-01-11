var shippingSectionHtml = $(".product-quantity-list").closest( "tr" ).clone().wrap('<p>').parent().html();
$(".product-quantity-list").closest( "tr" ).remove();

var listHtml = $('#js-cart_data .js-listing').html()
var carAmountHtml = $('#js-cart_data .js-cart-amount').html()
$("#js-cart_data").addClass('hide');

// http://localhost:8181/api/products/US/464eaeb0-de49-11e7-9385-515f4b4bf449
var productHtml='';
var productData;
var product_total = 0;
var product_additional_charge_total = 0;
var product_shipping_charge_total = 0;
var product_tax_total = 0;
var grand_total = 0;
$.ajax({
  type : 'GET',
  url : 'http://172.16.230.226:3032/shopping?user_id=20',
  dataType : 'json',
  success : function(response_data) {
    if (response_data!= ""){      
      for (var key in response_data) {
        var tax = 0;
        var charges = 0;
        var shipping_charges = 0;
        var additional_charges = 0;
        
        var apiUrl = project_settings.product_api_url;

          $.ajax({
            type: 'GET',
            url: apiUrl+response_data[key]._id,
            async: false,
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
            },
            dataType: 'json',
            success: function (data) {
              rawData = data.hits.hits;
              productData = rawData;
              
              var listHtml1 = listHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
              var listHtml1 = listHtml1.replace(/#data.id#/g,response_data[key]._id);
              var listHtml1 = listHtml1.replace(/#data.product_id#/g,productData[0]._source.product_id);
              var listHtml1 = listHtml1.replace('#data.product_name#',productData[0]._source.product_name);
              var listHtml1 = listHtml1.replace('#data.sku#',productData[0]._source.sku);
              var listHtml1 = listHtml1.replace('#data.price#',productData[0]._source.price_1);
              var listHtml1 = listHtml1.replace('#data.currency#',productData[0]._source.currency);
  
              var listHtml1 = listHtml1.replace('#data.description#',productData[0]._source.description);
              var listHtml1 = listHtml1.replace('#data.order_type#',response_data[key].order_type);
              var listHtml1 = listHtml1.replace('#data.special_instruction#',response_data[key].special_instruction);
              var listHtml1 = listHtml1.replace('#data.quantitye#',response_data[key].total_qty);
              var listHtml1 = listHtml1.replace('#data.unit_price#',response_data[key].unit_price);
              var total = parseFloat(response_data[key].total_qty)*parseFloat(response_data[key].unit_price);
              var listHtml1 = listHtml1.replace(/#data.total#/g, total);
              var listHtml1 = listHtml1.replace(/#data.tax#/g,tax);
              var listHtml1 = listHtml1.replace(/#data.charges#/g,charges);
              var listHtml1 = listHtml1.replace(/#data.additional_charges#/g,additional_charges);
              var listHtml1 = listHtml1.replace(/#data.shipping_charges#/g,shipping_charges);
              
              var sub_total = total + charges + tax + additional_charges + shipping_charges;
              var listHtml1 = listHtml1.replace(/#data.subtotal#/g, sub_total);

              product_total = product_total + total;
              product_additional_charge_total = product_additional_charge_total + additional_charges;
              product_shipping_charge_total = product_shipping_charge_total + shipping_charges;
              product_tax_total = product_tax_total + tax;

              //Imprint Information
              imprintHtml = '';
              for (var imprint_key in productData[0]._source.imprint_data) {
                  var obj = productData[0]._source.imprint_data[imprint_key];
                  var imprint = response_data[key].imprint;
                  for (var cart_imprint in imprint) {
                    for (var cart_imprint1 in imprint[cart_imprint]) {
                      let imprint_infoArray = imprint[cart_imprint][cart_imprint1];
                      for (var imprintArrayKey in imprint_infoArray)
                      {
                        let imprint_info = imprint_infoArray[imprintArrayKey];

                        if(imprint_info.imprint_method_id == obj._id)
                        {
                          imprintHtml += "<div class='estimate-tag-block'>";
                          imprintHtml += "<div class='estimate-row'>Print Position: "+"<span>"+imprint_info.imprint_position_name+"</span></div>";
                          imprintHtml += "<div class='estimate-row'>Imprint Method: "+"<span>"+imprint_info.imprint_method_name+"</span></div>";
                          imprintHtml += "<div class='estimate-row'>How many colours: "+"<span>"+imprint_info.no_of_color+"</span></div>";
                          imprintHtml += "<div class='estimate-row'>";
                          for(var selected_color in imprint_info.selected_colors)
                          {
                            let colorCount = parseInt(selected_color)+1;
                            imprintHtml += "<div>Colour"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color].color_name+"</span></div>";
                          }
                          imprintHtml += "</div>"
                          imprintHtml += "</div>"
                        }
                      }
                    }
                  }
              }
              
              var listHtml1 = listHtml1.replace('#data.imprint_info#',imprintHtml);
              //END - Imprint Information
              
              
              // var color = response_data[key].color;
              // quantityHtml = '<table class="size-quantity-table">';
              // for (var key1 in color) {
              //   quantityHtml += "<tr class='grey-bottom-border'>";
              //   quantityHtml += "<td>"+key1+"</td>";
              //   quantityHtml += "<td>"+color[key1]+"</td>";
              //   quantityHtml += "</tr>";                
              // }
              // quantityHtml += "</table>";
              // var listHtml1 = listHtml1.replace('#data.color_quantity#',quantityHtml);

              var listHtml1 = listHtml1.replace('#data.shipping_type#',response_data[key].shipping_method.shipping_type);
              
              productHtml = listHtml1;

              if(key == 0)
                $('#js-cart_data .js-listing').html(productHtml);
              else
                $('#js-cart_data .js-listing').append(productHtml);
              
              // Shipping Section
              var shipping_detail = response_data[key].shipping_method.shipping_detail;
              var shippingHtml = shippingSectionHtml;
              var shippingHtmlReplace = '';
              for(var shippingKey in shipping_detail)
              {
                var shippingKeyCount = parseInt(shippingKey)+1;
                var shipping_info = shipping_detail[shippingKey];
                
                var quantityHtml = '<table class="size-quantity-table">';
                
                for (var color_quantity in shipping_info.color_quantity) {
                  quantityHtml += "<tr class='grey-bottom-border'>";
                  quantityHtml += "<td>"+color_quantity+"</td>";
                  quantityHtml += "<td>"+shipping_info.color_quantity[color_quantity]+"</td>";
                  quantityHtml += "</tr>";                
                }

                quantityHtml += "</table>";

                
                var shippingHtml1 = shippingHtml.replace("#data.color_quantity#",quantityHtml)

                var shipping_details = shipping_info.shipping_detail;
                
                var shippingHtml1 = shippingHtml1.replace("#data.shipping_carrier#",shipping_details.shipping_carrier)
                var shippingHtml1 = shippingHtml1.replace("#data.shipping_count#",shippingKeyCount)
                var shippingHtml1 = shippingHtml1.replace("#data.shipping_method#",shipping_details.shipping_method)
                var shippingHtml1 = shippingHtml1.replace("#data.ship_account#",'')
                var shippingHtml1 = shippingHtml1.replace("#data.on_hand_date#",shipping_details.on_hand_date)
                var shippingHtml1 = shippingHtml1.replace(/#data.shipping_charges#/g,shipping_charges);

                shippingHtmlReplace += shippingHtml1; 
              }
              $( shippingHtmlReplace ).insertAfter( ".js-product-"+productData[0]._source.product_id );
              // END - Shipping Section
            }
          });
      }

      grand_total = product_total + product_additional_charge_total + product_shipping_charge_total + product_tax_total;
      
      carAmountHtml = carAmountHtml.replace('#data.grand_total#',product_total);
      carAmountHtml = carAmountHtml.replace('#data.additional_charges#',product_additional_charge_total);
      carAmountHtml = carAmountHtml.replace('#data.shipping_charges#',product_shipping_charge_total);
      carAmountHtml = carAmountHtml.replace('#data.tax#',product_tax_total);
      carAmountHtml = carAmountHtml.replace('#data.grand_total_with_tax#',grand_total);

      $('#js-cart_data .js-cart-amount').html(carAmountHtml)
      $("#js-cart_data").removeClass('hide');
    }
    else if(response_data == '')
    {
      $('#js-cart_data').html("<hr> No records found.")
      $("#js-cart_data").removeClass('hide');
    }
    else if(response_data.status=='error')
    {
      $('#js-cart_data').html("<hr> Error.")
      $("#js-cart_data").removeClass('hide');
    }
  }
})

$(document).on("click",".js_view_order",function () {
  $(this).parents('.js_main_shopping_block').find('.js_view_item_details').slideToggle( "slow" );
});
