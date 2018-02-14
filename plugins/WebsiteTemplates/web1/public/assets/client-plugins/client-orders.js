document.addEventListener("DOMContentLoaded", function(event){
showOrders();
})

function showOrders()
{
  var shippingSectionHtml = $(".product-quantity-list").closest( "tr" ).clone().wrap('<p>').parent().html();
  // $(".product-quantity-list").closest( "tr" ).remove();

  var imprintSectionHtml = $(".js-imprint-information").closest( "td" ).html();
  alert(imprintSectionHtml)
  // $(".js-imprint-information").remove();

  var listHtml = $(".js-order-info").parent().html();
  var productHtml = $(".js-order-product-info").parent().html();
  alert(productHtml)

  $.ajax({
    type : 'GET',
    url : 'http://172.16.230.226:3032/myOrders?owner_id=59db1335dd92ed001a69aae2',
    dataType : 'json',
    success : function(response_data) {
      if (response_data!= "") {
        for (var key in response_data) {
          var tax = 0;
          var charges = 0;
          var shipping_charges = 0;
          var additional_charges = 0;
          var product_total = 0;
          var product_additional_charge_total = 0;
          var product_shipping_charge_total = 0;
          var product_tax_total = 0;
          var grand_total = 0;

          var apiUrl = project_settings.product_api_url;
          console.log("response_data",response_data)

          let listHtmlReplace = listHtml.replace('#data.grand_total#',response_data[key].total);
          listHtmlReplace = listHtmlReplace.replace('#data.total_quantity#',response_data[key].quantity);
          $(".js_search_list").append(listHtmlReplace);
          alert(listHtmlReplace);

          for (var product_key in response_data[key].products) {
            let product_details = response_data[key].products[product_key]
            console.log('product_details',product_details)
            $.ajax({
              type: 'GET',
              url: apiUrl+product_details.product_id,
              async: false,
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
              },
              dataType: 'json',
              success: function (data) {
            
                rawData = data.hits.hits;
                productData = rawData;

                console.log('productData',productData)
                

                let productHtmlReplace = productHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
                let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+productData[0]._id;
                productHtmlReplace = productHtmlReplace.replace(/#data.product_link#/g,detailLink);
                productHtmlReplace = productHtmlReplace.replace(/#data.id#/g,response_data[key].id);
                productHtmlReplace = productHtmlReplace.replace(/#data.product_id#/g,response_data[key].id);
                productHtmlReplace = productHtmlReplace.replace('#data.product_name#',productData[0]._source.product_name);
                productHtmlReplace = productHtmlReplace.replace('#data.sku#',productData[0]._source.sku);
                productHtmlReplace = productHtmlReplace.replace('#data.price#',productData[0]._source.price_1);
                productHtmlReplace = productHtmlReplace.replace('#data.currency#',productData[0]._source.currency);

                productHtmlReplace = productHtmlReplace.replace('#data.description#',productData[0]._source.description);
                productHtmlReplace = productHtmlReplace.replace('#data.order_type#',product_details.order_type);
                if(typeof product_details.special_instruction != "undefined")
                {
                  productHtmlReplace = productHtmlReplace.replace('#data.special_instruction#',product_details.special_instruction);
                }
                else{
                  productHtmlReplace = productHtmlReplace.replace('#data.special_instruction#','-');
                }

                productHtmlReplace = productHtmlReplace.replace('#data.quantitye#',product_details.total_qty);
                productHtmlReplace = productHtmlReplace.replace('#data.unit_price#',product_details.unit_price);
                var total = parseFloat(product_details.total_qty)*parseFloat(product_details.unit_price);
                total_display = total.toFixed(project_settings.price_decimal);
                productHtmlReplace = productHtmlReplace.replace(/#data.total#/g, total_display);
                productHtmlReplace = productHtmlReplace.replace(/#data.tax#/g,tax);

                let additional_charges_list = '';
                if(typeof product_details.charges != "undefined")
                {
                  for(let charge_list in product_details.charges)
                  {
                    additional_charges_list += capitalize(charge_list)+": $ "+product_details.charges[charge_list];
                    charges = charges+parseFloat(product_details.charges[charge_list]);
                  }
                }

                productHtmlReplace = productHtmlReplace.replace(/#data.additional_charges_list#/g,additional_charges_list);
                productHtmlReplace = productHtmlReplace.replace(/#data.charges#/g,charges);


                productHtmlReplace = productHtmlReplace.replace(/#data.shipping_charges#/g,shipping_charges);

                var sub_total = total + charges + tax + shipping_charges;
                sub_total_display = sub_total.toFixed(project_settings.price_decimal);
                productHtmlReplace = productHtmlReplace.replace(/#data.subtotal#/g, sub_total_display);

                product_total = product_total + total;
                product_additional_charge_total = product_additional_charge_total + charges;
                product_shipping_charge_total = product_shipping_charge_total + shipping_charges;
                product_tax_total = product_tax_total + tax;

                //Imprint Information
                imprintHtml = '';
                if(typeof product_details.imprint != "undefined")
                {
                  for (let [i,imprint_info] of product_details.imprint.entries())
                  {
                    var imprintSectionHtml1 = imprintSectionHtml;

                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.print_position#",imprint_info.imprint_position_name)
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprint_method#",imprint_info.imprint_method_name)
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.howmany_colors#",imprint_info.no_of_color)

                    colorHtml = '';

                    if(typeof imprint_info.selected_colors != "undefined")
                    {
                      for(var selected_color in imprint_info.selected_colors)
                      {
                        let colorCount = parseInt(selected_color)+1;
                        colorHtml += "<div>Colour"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
                      }
                    }

                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.colours#",colorHtml)

                    imprintHtml += imprintSectionHtml1;
                  }
                }
                else{
                }

                //END - Imprint Information

                if(typeof product_details.shipping_method.shipping_type != "undefined")
                {
                  productHtmlReplace = productHtmlReplace.replace('#data.shipping_type#',product_details.shipping_method.shipping_type);
                }
                else{
                  productHtmlReplace = productHtmlReplace.replace('#data.shipping_type#',"-");
                }

                productHtmlReplace = productHtmlReplace.replace('#data.cart_id#',response_data[key].id);
                alert(productHtmlReplace);
                productHtml = productHtmlReplace;
                if(key == 0) {
                  $('#js-cart_data .js-listing').html(productHtml);
                }
                else {
                  $('#js-cart_data .js-listing').append(productHtml);
                }
                alert(imprintHtml)
                $(".js-product-ce88eedb-a7fc-42af-b156-3ee1d4f3ecf8").find(".js_imprint_info").html(imprintHtml);
                alert($('666666666',".js-product-ce88eedb-a7fc-42af-b156-3ee1d4f3ecf8").find(".js_imprint_info").html())
                // Shipping Section
                if(typeof product_details.shipping_method != "undefined")
                {
                  var shipping_detail = product_details.shipping_method.shipping_detail;
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
                  $( shippingHtmlReplace ).insertAfter( ".js-product-"+response_data[key].id );
                }
                // END - Shipping Section
                $(".js_search_list").append(productHtmlReplace);
              }
            });  
            
          }
          
          // return false;
        }
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
}