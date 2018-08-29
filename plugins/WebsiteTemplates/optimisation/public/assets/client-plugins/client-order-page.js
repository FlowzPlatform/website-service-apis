if (user_id == null ) {
  window.location = 'login.html';
}

document.addEventListener("DOMContentLoaded", function(event){
  if(websiteConfiguration.my_account.my_order.status == 0)
  {
    let html = '<div class="col-sm-12 col-md-12 col-lg-12 col-xs-12"><div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">Access Denied</div></div>';

    $(".ob-main-address-block").html(html);
    $('.js-hide-div').removeClass("js-hide-div");
    return false;
  }

  $(".breadcrumb li:last-child").html('<strong> My Orders </strong>')

  if( admin_role_flag == 1 ){
      $(".main-title").html('<i class="fa fa-file-text"></i> Received Order List')
      $(".breadcrumb li:last-child").html('<strong> Received Order List </strong>')
      $(".js_is_admin").removeClass("hide")
  }
  $(".breadcrumb li:last-child").removeClass("hide")
  $('.js-main-address-block').addClass("hide");
  showOrders();
})

function showOrders()
{
  showPageAjaxLoading()
  var shippingSectionHtml = $(".product-quantity-list").closest( "tr" ).clone().wrap('<p>').parent().html();
  var orderInfo = $(".js-order-info").clone().wrap('<p>').parent().html();
  $(".js-order-info:first").hide();

  var orderTotalSection = $(".js-order-total-section").clone().wrap('<p>').parent().html();

  var billingHtml = $("#js_product_list .track-top-line").clone().wrap('<p>').parent().html();

  var imprintSectionHtml = $("#js_product_list .cart-item-view").clone().wrap('<p>').parent();
  var shippingSectionHtml = $("#js_product_list .product-quantity-list").clone().wrap('<p>').parent().html();

  var img_sku = $("#js_product_list .js-order-basic").clone().wrap('<p>').parent().html();
  // $(".js_search_list tbody").append(img_sku);
  var imprintInfoHtml = $(".js-imprint-information").closest( "td" ).html();
  var subTotalInfoHtml = $("#js_product_list .js-order-item-subtotal").clone().wrap('<p>').parent().html();

  // console.log('subTotalInfoHtml',subTotalInfoHtml)
  // $(".js-imprint-information").remove();

  // var listHtml = $(".js-order-info").parent().html();
  // var productHtml = $(".js-order-product-info").parent().html();
  // alert(productHtml)
  let finalHtml1 = '';
  let orderApiUrl = project_settings.myorders_api_url+'?user_id='+user_id+"&website_id="+website_settings['projectID']
  let view_colspan = 7
  if( admin_role_flag == 1 ){
      orderApiUrl = project_settings.myorders_api_url+"?website_id="+website_settings['projectID']
      view_colspan = 10
  }
  //alert(admin_role_flag)

  axios({
    method: 'GET',
    url : orderApiUrl,
  })
  .then(async response_data => {
    if (response_data.data.total > 0 ) {
      showPageAjaxLoading()
      var response_data2 = response_data.data

      for (var key in response_data2.data) {
        // console.log("response_data2",response_data2.data[key])
        var response_data1 = response_data2.data[key];
        var tax = 0;
        var charges = 0;
        var shipping_charges = 0;
        var additional_charges = 0;
        var product_shipping_charges = 0.00;

        var product_total = 0;
        var product_additional_charge_total = 0;
        var product_shipping_charge_total = 0;
        var product_tax_total = 0;
        var grand_total = 0;

        var apiUrl = project_settings.product_api_url;
        // console.log("response_data1",response_data1)

        // let listHtmlReplace = listHtml.replace('#data.grand_total#',response_data1[key].total);
        // listHtmlReplace = listHtmlReplace.replace('#data.total_quantity#',response_data1[key].quantity);
        // $(".js_search_list").append(listHtmlReplace);
        // alert(listHtmlReplace);
        // console.log('product_details------------',response_data1[key])
        let finalHtml = '';

        let user_billing_info = response_data1.user_billing_info
        let billingHtmlReplace = billingHtml.replace('#data.name#',user_billing_info.name);
        billingHtmlReplace = billingHtmlReplace.replace('#data.street#',user_billing_info.street1);
        billingHtmlReplace = billingHtmlReplace.replace('#data.state#',user_billing_info.state);
        billingHtmlReplace = billingHtmlReplace.replace('#data.city#',user_billing_info.city);
        billingHtmlReplace = billingHtmlReplace.replace('#data.postalcode#',user_billing_info.postalcode);
        billingHtmlReplace = billingHtmlReplace.replace('#data.country#',user_billing_info.country);
        billingHtmlReplace = billingHtmlReplace.replace('#data.phone#',user_billing_info.phone);
        billingHtmlReplace = billingHtmlReplace.replace('#data.email#',user_billing_info.email);

        for (var product_key in response_data1.products) {
          product_shipping_charges = 0.00;
          let product_details = response_data1.products[product_key]

          let productData = product_details.product_description;//await getProductDetailById(product_details.product_id)

          // console.log('productData',productData)
          let imgSkuReplace = img_sku.replace('#data.sku#',productData.sku);
          let productImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
          if(productData.images != undefined){
              productImage = productData.images[0].images[0].secure_url
          }
          imgSkuReplace = imgSkuReplace.replace('#data.image#',productImage);
          // let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+product_details.product_id;
          // imgSkuReplace = imgSkuReplace.replace(/#data.product_link#/g,detailLink);
          imgSkuReplace = imgSkuReplace.replace('#data.title#',productData.product_name);

          //Imprint Information
          imprintHtml = '';
          if(typeof product_details.imprint != "undefined")
          {
            for (let [i,imprint_info] of product_details.imprint.entries())
            {
              var imprintSectionHtml1 = imprintInfoHtml;

              imprintSectionHtml1 = imprintSectionHtml1.replace("#data.print_position#",imprint_info.imprint_position_name)
              imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprint_method#",imprint_info.imprint_method_name)
              imprintSectionHtml1 = imprintSectionHtml1.replace("#data.howmany_colors#",imprint_info.no_of_color)

              colorHtml = '';

              if(typeof imprint_info.selected_colors != "undefined")
              {
                for(var selected_color in imprint_info.selected_colors)
                {
                  let colorCount = parseInt(selected_color)+1;
                  colorHtml += "<div>Color"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
                }
              }

              imprintSectionHtml1 = imprintSectionHtml1.replace("#data.colours#",colorHtml)



              if(typeof imprint_info.artwork_type != "undefined" && typeof imprint_info.artwork != "undefined"){
                    let artwork_type = imprint_info.artwork_type;
                    let checkSendEmail = '';
                    if(artwork_type == "upload_artwork_typeset"){
                        if(typeof imprint_info.artwork.artwork_text_email != "undefined"){
                          checkSendEmail = 'Art Work Via Email: <span>artwork@flowz.com</span>';
                        }
                    }
                    else if(artwork_type == "upload_artwork"){
                        if(typeof imprint_info.artwork.artwork_email != "undefined"){
                          checkSendEmail = 'Art Work Via Email: <span>artwork@flowz.com</span>';
                        }
                    }

                    if(checkSendEmail != ""){
                      // imprintHtml += checkSendEmail;
                    }
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.sendmail#",checkSendEmail)
                    let thumbImg = '';

                    if(typeof imprint_info.artwork.artwork_thumb != "undefined"){
                        for (let [i,artwork_thumb] of imprint_info.artwork.artwork_thumb.entries()){
                            let j = i+1;
                            thumbImg += 'Uploaded Artwork '+j+': <img alt="" src="'+artwork_thumb+'" style="max-width:50px;max-height:50px;"><br><br>';
                        }
                    }
                    // thumbImg += '</div>'

                    if(thumbImg != ""){
                      // imprintHtml += thumbImg;

                    }
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.artwork#",thumbImg)

                    let artText = '';

                    if(typeof imprint_info.artwork.artwork_text != "undefined"){
                      for (let [i,artwork_text] of imprint_info.artwork.artwork_text.entries()){
                          let j = i+1;
                          artText += 'Text '+j+' : <span> '+artwork_text+'</span><br>';
                      }
                    }

                    if(typeof imprint_info.artwork.artwork_instruction != "undefined"){
                      artText += 'Instructions :</span> <span> '+imprint_info.artwork.artwork_instruction+'</span><br>';
                    }
                    //imprintHtml += artText;
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.artwork_text#",artText)
                }else{
                  imprintSectionHtml1 = imprintSectionHtml1.replace("#data.sendmail#",'')
                  imprintSectionHtml1 = imprintSectionHtml1.replace("#data.artwork#",'')
                  imprintSectionHtml1 = imprintSectionHtml1.replace("#data.artwork_text#",'')
                }

                imprintHtml += imprintSectionHtml1;
            }
          }

          $(imprintSectionHtml).find(".js_imprint_info").html(imprintHtml)

          let imprintSectionHtmlReplace = imprintSectionHtml.html();

          let additional_charges_list = '';
          if(typeof product_details.charges != "undefined")
          {
            for(let charge_list in product_details.charges)
            {
              additional_charges_list += capitalize(charge_list)+": <span>$"+product_details.charges[charge_list]+"</span>";
              charges = charges+parseFloat(product_details.charges[charge_list]);
            }
          }
          if(additional_charges_list == "") imprintSectionHtmlReplace = imprintSectionHtmlReplace.replace(/#data.additional_charges_list#/g,'N/A');
          else imprintSectionHtmlReplace = imprintSectionHtmlReplace.replace(/#data.additional_charges_list#/g,additional_charges_list);
          imprintSectionHtmlReplace = imprintSectionHtmlReplace.replace(/#data.charges#/g,"$"+charges.toFixed(project_settings.price_decimal));

          if(typeof product_details.special_instruction != "undefined" && product_details.special_instruction != '')
          {
            imprintSectionHtmlReplace = imprintSectionHtmlReplace.replace('#data.special_instruction#',product_details.special_instruction);
          }
          else{
            imprintSectionHtmlReplace = imprintSectionHtmlReplace.replace('#data.special_instruction#','-');
          }

          // var listHtmlReplace = listHtmlReplace.replace('#data.imprint_info#',imprintHtml);
          //END - Imprint Information


          // Shipping Section
          if(typeof product_details.shipping_method != "undefined")
          {
            var shipping_detail = product_details.shipping_method.shipping_detail;
            var shippingHtml = shippingSectionHtml;
            var shippingHtmlReplace = '';
            //let getMeHtml = getMeHtmlFunc(shipping_detail)
            for(var shippingKey in shipping_detail)
            {
              var shippingKeyCount = parseInt(shippingKey)+1;
              var shipping_info = shipping_detail[shippingKey];
              var quantityHtml = '<table class="size-quantity-table">';
              quantityHtml += '<thead><tr><th>Color</th><th class="border-right-none">Quantity</th></tr></thead>';
              for (var color_quantity in shipping_info.color_quantity) {
                quantityHtml += "<tr class='grey-bottom-border'>";
                quantityHtml += "<td>"+color_quantity+"</td>";
                quantityHtml += "<td>"+shipping_info.color_quantity[color_quantity]+"</td>";
                quantityHtml += "</tr>";
              }

              quantityHtml += "</table>";

              var shippingHtml1 = shippingHtml.replace("#data.color_quantity#",quantityHtml)
              var shipping_details = shipping_info.shipping_detail;

              var shippingHtml1 = shippingHtml1.replace("#data.shipping_carrier#",shipping_details.shipping_carrier.toUpperCase())
              var shippingHtml1 = shippingHtml1.replace("#data.shipping_count#",shippingKeyCount)
              var shippingHtml1 = shippingHtml1.replace("#data.shipping_method#",shipping_details.shipping_method)
              var shippingHtml1 = shippingHtml1.replace("#data.ship_account#",'')
              var shippingHtml1 = shippingHtml1.replace("#data.on_hand_date#",formatDate(shipping_details.on_hand_date,project_settings.format_date))

              if(shipping_details.shipping_charge != "")
              {
                var shippingHtml1 = shippingHtml1.replace(/#data.shipping_charges#/g,"$"+shipping_details.shipping_charge);

                product_shipping_charge_total = product_shipping_charge_total + parseFloat(shipping_details.shipping_charge);
                product_shipping_charges = product_shipping_charges + parseFloat(shipping_details.shipping_charge);
              }
              else{
                var shippingHtml1 = shippingHtml1.replace(/#data.shipping_charges#/g,"$0.00");
              }

		// Tax

              if (typeof product_details.taxcloud !== 'undefined') {
                tax = product_details.taxcloud.tax_amount
              }
              //change
              // alert(product_shipping_charges)

              // $(".js-shipping-"+response_data[key].id).find(".js-product_total_shipping_charge").html(product_shipping_charges);

              //END - change
              // console.log("shipping_info",shipping_info.shipping_address);
              //let replaceAddressHtml = await addressBookHtml(shipping_info.selected_address_id)
              let replaceAddressHtml = '';
              replaceAddressHtml += shipping_info.shipping_address.name+"<br>";
              if(shipping_info.shipping_address.street2 != undefined && shipping_info.shipping_address.street2 !=''){
                replaceAddressHtml += shipping_info.shipping_address.street1;
                replaceAddressHtml += ","+shipping_info.shipping_address.street2+",<br>";
              }
              else{
                replaceAddressHtml += shipping_info.shipping_address.street1+",<br>";
              }
              replaceAddressHtml += shipping_info.shipping_address.city+",";
              replaceAddressHtml += shipping_info.shipping_address.state,2+"<br>";
              replaceAddressHtml += shipping_info.shipping_address.country;
              if(shipping_info.shipping_address.postalcode != undefined ){
                replaceAddressHtml += " - "+shipping_info.shipping_address.postalcode+"<br>";
              }
              replaceAddressHtml += "Email: "+shipping_info.shipping_address.email+"<br>";
              if(shipping_info.shipping_address.phone != undefined ){
                replaceAddressHtml += "T: "+shipping_info.shipping_address.phone;
              }
              if(shipping_info.shipping_address.mobile != undefined && shipping_info.shipping_address.mobile !=''){
                replaceAddressHtml += ",<br>M: "+shipping_info.shipping_address.mobile+"<br>";
              }

              shippingHtml1 = shippingHtml1.replace("#data.address_book#",replaceAddressHtml)
              //  console.log("replaceAddressHtml replaceAddressHtmlreplaceAddressHtml " , replaceAddressHtml)
              // let replaceAddressHtml = addressBookHtml(shipping_info.selected_address_id).then(function(html){
              // //  console.log("html <<<<<<<<<<< " , html)
              //     shippingHtml1 = shippingHtml1.replace("#data.address_book#",html)
              //     console.log("shippingHtml1",shippingHtml1);
              //     return shippingHtml1;
              // })

              // console.log("replaceAddressHtml " , replaceAddressHtml)
              // shippingHtmlReplace += replaceAddressHtml;
              shippingHtmlReplace += shippingHtml1;

            }
            // console.log("-----------shippingHtmlReplace--------------",shippingHtmlReplace)
            // $( shippingHtmlReplace ).insertAfter( ".js-product-"+response_data[key].id );
          }
          // END - Shipping Section

          let subTotalInfoHtmlReplace = subTotalInfoHtml;
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace(/#data.charges#/g,charges.toFixed(project_settings.price_decimal));
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace('#data.quantitye#',product_details.total_qty);
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace('#data.unit_price#',product_details.unit_price);
          var total = parseFloat(product_details.total_qty)*parseFloat(product_details.unit_price);
          total_display = total.toFixed(project_settings.price_decimal);
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace(/#data.total#/g, total_display);
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace(/#data.tax#/g,tax.toFixed(project_settings.price_decimal));

          var sub_total = total + charges + tax + product_shipping_charges;
          sub_total_display = sub_total.toFixed(project_settings.price_decimal);

          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace(/#data.subtotal#/g, sub_total_display);
          subTotalInfoHtmlReplace = subTotalInfoHtmlReplace.replace("#data.total_shipping_charges#", product_shipping_charges.toFixed(project_settings.price_decimal));

          product_total = product_total + total;
          product_additional_charge_total = product_additional_charge_total + charges;
          //change // product_shipping_charge_total = product_shipping_charge_total + shipping_charges;
          product_tax_total = product_tax_total + tax;

          // console.log('billingHtmlReplace',billingHtmlReplace)
          finalHtml += imgSkuReplace
          finalHtml += imprintSectionHtmlReplace
          finalHtml += shippingHtmlReplace
          finalHtml += subTotalInfoHtmlReplace

          // console.log("finalHtml",finalHtml)
          // return false;
          // $.ajax({
          //   type: 'GET',
          //   url: apiUrl+"?_id="+product_details.product_id,
          //   async: false,
          //   beforeSend: function (xhr) {
          //     xhr.setRequestHeader ("vid", project_settings.vid);
          //   },
          //   dataType: 'json',
          //   success: function (data) {
          //     rawData = data.hits.hits;
          //     productData = rawData;
          //     // alert(3)
          //     let billingHtmlReplace = billingHtml.replace('#data.name#','sds'+key);


          //     console.log('billingHtmlReplace',billingHtmlReplace)
          //     finalHtml += orderInfo
          //     finalHtml += "<tr class='track-order-view-block click-track-order'><td colspan='7'>";
          //     finalHtml += billingHtmlReplace
          //     finalHtml += img_sku
          //     finalHtml += imprintHtml
          //     finalHtml += shippingHtml
          //     finalHtml += "</td></tr>";


          //     console.log('productData',productData)
          //   }
          // });

        }

        grand_total = product_total + product_additional_charge_total + product_shipping_charge_total + product_tax_total;

        product_total                     = product_total.toFixed(project_settings.price_decimal);
        product_additional_charge_total   = product_additional_charge_total.toFixed(project_settings.price_decimal);
        product_shipping_charge_total     = product_shipping_charge_total.toFixed(project_settings.price_decimal);
        product_tax_total                 = product_tax_total.toFixed(project_settings.price_decimal);
        grand_total                       = grand_total.toFixed(project_settings.price_decimal);

        let orderTotalSectionReplace = orderTotalSection;
        orderTotalSectionReplace = orderTotalSectionReplace.replace('#data.grand_total#',product_total);
        orderTotalSectionReplace = orderTotalSectionReplace.replace('#data.charges#',product_additional_charge_total);
        orderTotalSectionReplace = orderTotalSectionReplace.replace('#data.shipping_charges#',product_shipping_charge_total);
        orderTotalSectionReplace = orderTotalSectionReplace.replace('#data.tax#',product_tax_total);
        orderTotalSectionReplace = orderTotalSectionReplace.replace('#data.grand_total_with_tax#',grand_total);

        let orderInfoReplace = orderInfo;
        orderInfoReplace = orderInfoReplace.replace(/#data.order_id#/g,response_data1.id);
        if(response_data1.order_id != undefined){
            orderInfoReplace = orderInfoReplace.replace("#data.order_id1#",response_data1.order_id);
          }
          else {
             orderInfoReplace = orderInfoReplace.replace("#data.order_id1#",'-');
          }
        orderInfoReplace = orderInfoReplace.replace('#data.order_date#',formatDate(response_data1.created_at,project_settings.format_date));
        orderInfoReplace = orderInfoReplace.replace('#data.payment_type#',response_data1.payment_via);
        orderInfoReplace = orderInfoReplace.replace('#data.quantity#',response_data1.products.length);
        orderInfoReplace = orderInfoReplace.replace('#data.payment_status#','Success');
        orderInfoReplace = orderInfoReplace.replace('#data.total_price#',response_data1.total);
        if( admin_role_flag == 1 ){
            orderInfoReplace = orderInfoReplace.replace('#data.user_name#',response_data1.user_info.fullname);
            orderInfoReplace = orderInfoReplace.replace('#data.user_email#',response_data1.user_info.email);
        }

        finalHtml1 = orderInfoReplace
        finalHtml1 += "<tr class='track-order-view-block click-track-order js-view-order-detail' id='displayblock-"+response_data1.id+"' style='display:none;'><td colspan='"+view_colspan+"'>";
        finalHtml1 += billingHtmlReplace
        finalHtml1 += finalHtml
        finalHtml1 += orderTotalSectionReplace
        // finalHtml1 += subTotalInfoHtmlReplace1
        finalHtml1 += "</td></tr>";
        // if(key==0)
        // {
          // $( finalHtml1 ).insertAfter( ".js_search_list tr:last" );
          $( finalHtml1 ).insertAfter( "tr.track-order-view-block:last" );
        // }
        // else{
        //   console.log('orderInfo',orderInfo)
        //   console.log('finalHtml1',finalHtml1)
        // }
        // return false;
        let sectionCount = 0;

        $('#displayblock-'+response_data1.id).find( ".js-section-number" ).each(function( index ) {
          sectionCount = sectionCount + 1;
          $(this).html(sectionCount);
        });
      }
      $('.js-main-address-block').removeClass("hide");

      hidePageAjaxLoading()
    }
    else
    {
      $('.js-main-address-block').removeClass("hide");
      hidePageAjaxLoading()
      $('.ob-my-quote-section').html("<hr> No records found.")
    }

  })
}

$(document).on("click",'.js_preview_order',function (e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  var thisObj = $(this);
  var orderId= thisObj.data('order-id');

  if($('#'+ thisObj.data('call')).is(':visible')){
    $('#'+ thisObj.data('call')).hide();
  }else{
    $('.tab-track-block .click-track-order').hide();
    $('#'+ thisObj.data('call')).show();
  }
});
