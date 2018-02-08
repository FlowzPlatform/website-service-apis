var callApiUrl = project_settings.shopping_api_url;
$("#js-cart_data").addClass("hide");

document.addEventListener("DOMContentLoaded", function(event){
  if(user_details != null && $('#js-cart_data').length > 0){
    showCart();
  }
  else if(user_details != null)
  {
    $.ajax({
      type : 'GET',
      url : callApiUrl+'?user_id='+user_id+'&type=2',
      dataType : 'json',
      success : function(response_data) {
        if (response_data!= "") {      
          $("#cartCount").html(response_data.length); 
        }
      }
    })
  }
  else{
    $('#js-cart_data').html("<hr> No records found.")
    $("#js-cart_data").removeClass('hide');
  }
});

function showCart()
{
  var shippingSectionHtml = $(".product-quantity-list").closest( "tr" ).clone().wrap('<p>').parent().html();
  $(".product-quantity-list").closest( "tr" ).remove();
  
  var imprintSectionHtml = $(".js-imprint-information").closest( "td" ).html();
  $(".js-imprint-information").remove();
  
  var listHtml = $('#js-cart_data .js-listing').html()
  var carAmountHtml = $('#js-cart_data .js-cart-amount').html()
  $("#js-cart_data").addClass('hide');
  
  var productHtml='';
  var productData;
  var product_total = 0;
  var product_additional_charge_total = 0;
  var product_shipping_charge_total = 0;
  var product_tax_total = 0;
  var grand_total = 0;
  
  $.ajax({
    type : 'GET',
    url : callApiUrl+'?user_id='+user_id+'&type=2',
    dataType : 'json',
    success : function(response_data) {
      if (response_data!= "") {      
        $("#cartCount").html(response_data.length);        
        for (var key in response_data) {
          var tax = 0;
          var charges = 0;
          var shipping_charges = 0;
          var additional_charges = 0;
          
          var apiUrl = project_settings.product_api_url;
  
            $.ajax({
              type: 'GET',
              url: apiUrl+response_data[key].product_id,
              async: false,
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
              },
              dataType: 'json',
              success: function (data) {
                rawData = data.hits.hits;
                productData = rawData;

                var listHtmlReplace = listHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
                var listHtmlReplace = listHtmlReplace.replace(/#data.id#/g,response_data[key].id);
                var listHtmlReplace = listHtmlReplace.replace(/#data.product_id#/g,response_data[key].id);
                var listHtmlReplace = listHtmlReplace.replace('#data.product_name#',productData[0]._source.product_name);
                var listHtmlReplace = listHtmlReplace.replace('#data.sku#',productData[0]._source.sku);
                var listHtmlReplace = listHtmlReplace.replace('#data.price#',productData[0]._source.price_1);
                var listHtmlReplace = listHtmlReplace.replace('#data.currency#',productData[0]._source.currency);
    
                var listHtmlReplace = listHtmlReplace.replace('#data.description#',productData[0]._source.description);
                var listHtmlReplace = listHtmlReplace.replace('#data.order_type#',response_data[key].order_type);
                if(typeof response_data[key].special_instruction != "undefined")
                {
                  var listHtmlReplace = listHtmlReplace.replace('#data.special_instruction#',response_data[key].special_instruction);
                }
                else{
                  var listHtmlReplace = listHtmlReplace.replace('#data.special_instruction#','-');                
                }
                  
                var listHtmlReplace = listHtmlReplace.replace('#data.quantitye#',response_data[key].total_qty);
                var listHtmlReplace = listHtmlReplace.replace('#data.unit_price#',response_data[key].unit_price);
                var total = parseFloat(response_data[key].total_qty)*parseFloat(response_data[key].unit_price);
                total_display = total.toFixed(project_settings.price_decimal);
                var listHtmlReplace = listHtmlReplace.replace(/#data.total#/g, total_display);
                var listHtmlReplace = listHtmlReplace.replace(/#data.tax#/g,tax);

                let additional_charges_list = '';
                if(typeof response_data[key].charges != "undefined")
                {
                  for(let charge_list in response_data[key].charges)
                  {
                    additional_charges_list += capitalize(charge_list)+": $ "+response_data[key].charges[charge_list];
                    charges = charges+parseFloat(response_data[key].charges[charge_list]);
                  }
                }

                var listHtmlReplace = listHtmlReplace.replace(/#data.additional_charges_list#/g,additional_charges_list);                
                var listHtmlReplace = listHtmlReplace.replace(/#data.charges#/g,charges);
                
                
                var listHtmlReplace = listHtmlReplace.replace(/#data.shipping_charges#/g,shipping_charges);
                
                var sub_total = total + charges + tax + shipping_charges;
                sub_total_display = sub_total.toFixed(project_settings.price_decimal);
                var listHtmlReplace = listHtmlReplace.replace(/#data.subtotal#/g, sub_total_display);
  
                product_total = product_total + total;
                product_additional_charge_total = product_additional_charge_total + charges;
                product_shipping_charge_total = product_shipping_charge_total + shipping_charges;
                product_tax_total = product_tax_total + tax;
  
                //Imprint Information
                imprintHtml = '';
                if(typeof response_data[key].imprint != "undefined")
                {  
                  for (let [i,imprint_info] of response_data[key].imprint.entries())
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
  
                    // imprintHtml += "<div class='estimate-tag-block'>";
                    // imprintHtml += "<div class='estimate-row'>Print Position: "+"<span>"+imprint_info.imprint_position_name+"</span></div>";
                    // imprintHtml += "<div class='estimate-row'>Imprint Method: "+"<span>"+imprint_info.imprint_method_name+"</span></div>";
                    // imprintHtml += "<div class='estimate-row'>How many colours: "+"<span>"+imprint_info.no_of_color+"</span></div>";
                    // imprintHtml += "<div class='estimate-row'>";
                    // for(var selected_color in imprint_info.selected_colors)
                    // {
                    //   let colorCount = parseInt(selected_color)+1;
                    //   imprintHtml += "<div>Colour"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color].color_name+"</span></div>";
                    // }
                    // imprintHtml += "</div>"
                    // imprintHtml += "</div>"
                  }
                }
                else{
                  // var imprintSectionHtml1 = imprintSectionHtml;
                  
                  // imprintSectionHtml1 = imprintSectionHtml1.replace("#data.print_position#",'')
                  // imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprint_method#",'')
                  // imprintSectionHtml1 = imprintSectionHtml1.replace("#data.howmany_colors#",'')
                  
                  // colorHtml = '';
                  // imprintSectionHtml1 = imprintSectionHtml1.replace("#data.colours#",'')
  
                  // imprintHtml += imprintSectionHtml1;
                }
                    
  
                // var listHtmlReplace = listHtmlReplace.replace('#data.imprint_info#',imprintHtml);
                //END - Imprint Information
                
                if(typeof response_data[key].shipping_method.shipping_type != "undefined")
                {
                  var listHtmlReplace = listHtmlReplace.replace('#data.shipping_type#',response_data[key].shipping_method.shipping_type);                
                }
                else{
                  var listHtmlReplace = listHtmlReplace.replace('#data.shipping_type#',"-");                
                }
                
                var listHtmlReplace = listHtmlReplace.replace('#data.cart_id#',response_data[key].id);
                
                productHtml = listHtmlReplace;
                if(key == 0) {
                  $('#js-cart_data .js-listing').html(productHtml);
                }
                else {
                  $('#js-cart_data .js-listing').append(productHtml);
                }
                
                $(".js-product-"+response_data[key].id).find(".js_imprint_info").html(imprintHtml);
                
                // Shipping Section
                if(typeof response_data[key].shipping_method != "undefined")
                {
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
                  $( shippingHtmlReplace ).insertAfter( ".js-product-"+response_data[key].id );
                }
                // END - Shipping Section
              }
            });
        }
  
        grand_total = product_total + product_additional_charge_total + product_shipping_charge_total + product_tax_total;
        
        product_total                     = product_total.toFixed(project_settings.price_decimal);
        product_additional_charge_total   = product_additional_charge_total.toFixed(project_settings.price_decimal);
        product_shipping_charge_total     = product_shipping_charge_total.toFixed(project_settings.price_decimal);
        product_tax_total                 = product_tax_total.toFixed(project_settings.price_decimal);
        grand_total                       = grand_total.toFixed(project_settings.price_decimal);

        carAmountHtml = carAmountHtml.replace('#data.grand_total#',product_total);
        carAmountHtml = carAmountHtml.replace('#data.charges#',product_additional_charge_total);
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
}

$(document).on("click",".js_view_order",function () {
  $(this).parents('.js_main_shopping_block').find('.js_view_item_details').slideToggle( "slow" );
});

// onclick delete button

$(document).on('click', '.js-btn-delete-cart-list', function(e) {
  e.preventDefault();
  var confirmation = confirm("Are you sure want to delete?");
  if(confirmation)
  {
    var id = $(this).data('cart-id');
    $(this).closest('.js_deleted_product').addClass('js-cart-'+id);

    $.ajax({
      type : 'DELETE',
      url : callApiUrl+'/'+id,
      dataType : 'json',
      success : function(response_data) {
        
        if(response_data != "")
        {
          $('.js-cart-'+id).remove();
          var replaceTotal = 0;
      
          if($( ".js-total" ).length == 0)
          {
            location.reload();
          }
          
          $( ".js-total" ).each(function( index ) {
            replaceTotal = replaceTotal + parseFloat($( this ).html().replace("$",""));
          });
      
          $(".js-cart-total").html(replaceTotal)
          var additional_charges = parseFloat($('.js-additional-charges').html());
          var shipping_charges = parseFloat($('.js-shipping-charges').html());
          var tax = parseFloat($('.js-tax').html());
          
          var grand_total = replaceTotal + additional_charges + shipping_charges + tax;
          $(".js-grand-total").html(grand_total)  ;
        }
      }
    });
  }
 });

 // END - onclick delete button
 function capitalize(str) {
  var frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}