document.addEventListener("DOMContentLoaded", function(event){
  if (user_id != null ) {
    if(websiteConfiguration.transaction.place_order.cart_list.parent_status == 0 && websiteConfiguration.transaction.place_order.cart_list.status == 0){
        let html = 'Access Denied';
        $('.main-shopping-cart-block').html(html);
        return false;
    }
  }

  $("#js-cart_data").addClass("hide");

  if(user_details != null && $('#js-cart_data').length > 0){
    showCart();
  }
  else if(user_details != null)
  {
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
  else{
    $('#js-cart_data').html("<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'><div class='col-sm-6 col-md-6 col-lg-6 col-xs-12'>No records found.</div></div>")    
    $("#js-cart_data").removeClass('hide');
  }
});

let destAddress = async function (ADD) {
  if (typeof TaxCloud != 'undefined' && TaxCloud.apiKey != '' && TaxCloud.apiId != '') {
    let taxid = TaxCloud.apiId;
    let taxkey = TaxCloud.apiKey;
    ADD.apiLoginID = taxid, 
    ADD.apiKey = taxkey
    ADD.City = ''  
    let result = await axios({
      method: 'POST',
      url: project_settings.taxcloud_url+ '/VerifyAddress',
      data: ADD
    }).then(res => {
      if (res.data.ErrNumber == '0') {
        delete res.data.ErrNumber
        delete res.data.ErrDescription
        return res.data
      } else {
        return {}
      }
    }).catch(err => {
      console.log('Err', err)
      return {}
    })
    return result
  } else {
    return {}
  }
};

function showCart()
{
  var shippingSectionHtml = $(".product-quantity-list").closest( "tr" ).clone().wrap('<p>').parent().html();
  $(".product-quantity-list").closest( "tr" ).remove();

  var imprintSectionHtml = $(".js-imprint-information").html();
  //$(".js-imprint-information").remove();

  var listHtml = $('#js-cart_data .js-listing').html()
  var carAmountHtml = $('#js-cart_data .js-cart-amount').html()
  $("#js-cart_data").addClass('hide');

  var productHtml='';
  var productData;
  var product_total = 0.00;
  var product_additional_charge_total = 0.00;
  var product_shipping_charge_total = 0.00;
  var product_tax_total = 0.00;
  var grand_total = 0.00;
  showPageAjaxLoading()
  axios({
      method: 'GET',
      url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
    })
  .then(async response_data => {
    response_data = response_data.data
  // $.ajax({
    // type : 'GET',
    // url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2',
    // dataType : 'json',
    // success : function(response_data) {
      if (response_data!= "") {
        $("#cartCount").html(response_data.length);
        // console.log('response_data :::::::::', response_data);
        for (let key in response_data) {
          let tax = 0.00;
          let charges = 0.00;
          let shipping_charges = 0.00;
          let additional_charges = 0.00;
          let product_shipping_charges = 0.00;
          let apiUrl = project_settings.product_api_url+'?_id=';

          let productData = await getProductDetailById(response_data[key].product_id)

          // set tax using /taxcloud
          // console.log('TaxCloud', TaxCloud)
          if (typeof TaxCloud != 'undefined' && TaxCloud.apiKey != '' && TaxCloud.apiId != '') {
            if (productData.shipping[0].fob_country_code == 'US') {
              let taxdata = {
                "apiLoginID": TaxCloud.apiId, 
                "apiKey": TaxCloud.apiKey
              };
              if (response_data[key].shipping_method.shipping_type == 'split') {
                console.log(response_data[key].shipping_method.shipping_detail)
                let subtax = [];
                for (let [inx, item] of response_data[key].shipping_method.shipping_detail.entries()) {
                  console.log(inx, item)
                  let destinationAdd = await returnAddressBookDetailById(response_data[key].shipping_method.shipping_detail[inx].selected_address_id)
                  let City = await getCountryStateCityById(destinationAdd.city, 3) 
                  let countryCodes = await getStateCode(destinationAdd.state , 2)
                  if (countryCodes.countrycode == 'US') {
                    if (!response_data[key].hasOwnProperty('taxcloud') || (response_data[key].hasOwnProperty('taxcloud') && response_data[key].taxcloud.api_id != taxdata.apiLoginID)) {
                      // console.log('response_data[key]', response_data[key], productData, destinationAdd)
                      let taxcloudurl = project_settings.taxcloud_url;
                      let getLocation = await getStreetLocation(productData.shipping[0].fob_zip_code)
                      let getStreet = await getStreetData(getLocation)
                      let qty = 0;
                      for (let k in item.color_quantity) {
                        qty += parseInt(item.color_quantity[k])
                      }
                      // console.log('qty', qty)
                      let origin = {
                          "Address1": getStreet,
                          "Address2": '',
                          "City": productData.shipping[0].fob_city,
                          "State": productData.shipping[0].fob_state_code,
                          "Zip5": productData.shipping[0].fob_zip_code,
                          "Zip4": '0000'
                      };
                      let destination = {
                          "Address1": destinationAdd.street1,
                          "Address2": '',
                          "City": City,
                          "State": countryCodes.statecode,
                          "Zip5": destinationAdd.postalcode,
                          "Zip4": '0000'
                      };
                      destination = await destAddress(destination)
                      let cartItems = [{
                        "Qty": qty.toString(),
                        "Price": response_data[key].unit_price,
                        "TIC": '00000',
                        "ItemID": response_data[key].product_id,
                        "Index": 0
                      }]
                      let customerID = user_details.fullname + ' ' + response_data[key].user_id
                      // console.log('>>>>>>>>>>>>>>>>>>>>>>', origin, destination, cartItems, customerID, user_details.fullname)
                      let lookupData = {
                        "apiLoginID": taxdata.apiLoginID, 
                        "apiKey": taxdata.apiKey,
                        "customerID": customerID,
                        "cartItems": cartItems,
                        "origin": origin,
                        "destination": destination,
                        "cartID": "",
                        "deliveredBySeller": false
                      } 
                      await axios({
                        method: 'POST',
                        url: project_settings.taxcloud_url+ '/Lookup',
                        data: lookupData
                      }).then(res => {
                        console.log('======>>', res)
                        if (res.data.ResponseType !== 0) {
                          tax += res.data.CartItemsResponse[0].TaxAmount
                          subtax.push({
                            tax_id: res.data.CartID,
                            tax_amount: res.data.CartItemsResponse[0].TaxAmount
                          })
                          // await axios({
                          //   method: 'PATCH',
                          //   url: project_settings.shopping_api_url + '/' + response_data[key].id,
                          //   data: {
                          //     taxcloud : {
                          //       tax_id: res.data.CartID,
                          //       api_id: lookupData.apiLoginID,
                          //       tax_amount: res.data.CartItemsResponse[0].TaxAmount 
                          //     }
                          //   }
                          // }).then(res => {
                          //   console.log('Card Tax Updated', res.data)
                          // }).catch(errr => {
                          //   console.log('Card Tax Not Updated', errr)
                          // })
                        }
                      }).catch(err => {
                        console.log('Taxcloud Lookup Error ::', err)
                      })
                    } else {
                      tax = response_data[key].taxcloud.tax_amount     
                    }
                  }
                }
                if (subtax.length > 0) {
                  await axios({
                    method: 'PATCH',
                    url: project_settings.shopping_api_url + '/' + response_data[key].id,
                    data: {
                      taxcloud : {
                        // tax_id: res.data.CartID,
                        api_id: taxdata.apiLoginID,
                        tax_amount: tax,
                        type: 'split',
                        subtax: subtax 
                      }
                    }
                  }).then(res => {
                    console.log('Card Tax Updated', res.data)
                  }).catch(errr => {
                    console.log('Card Tax Not Updated', errr)
                  })
                }
              } else {
                let destinationAdd = await returnAddressBookDetailById(response_data[key].shipping_method.shipping_detail[0].selected_address_id)
                let City = await getCountryStateCityById(destinationAdd.city, 3) 
                let countryCodes = await getStateCode(destinationAdd.state , 2)
                // console.log('destination address :: ', destination, country)
                if (countryCodes.countrycode == 'US') {
                  if (!response_data[key].hasOwnProperty('taxcloud') || (response_data[key].hasOwnProperty('taxcloud') && response_data[key].taxcloud.api_id != taxdata.apiLoginID)) {
                    // console.log('response_data[key]', response_data[key], productData, destinationAdd, country)
                    // console.log('response_data[key]', response_data[key])
                    let taxcloudurl = project_settings.taxcloud_url;
                    // console.log('taxcloudurl', taxcloudurl)
                    let getLocation = await getStreetLocation(productData.shipping[0].fob_zip_code)
                    let getStreet = await getStreetData(getLocation)
                    let origin = {
                        "Address1": getStreet,
                        "Address2": '',
                        "City": productData.shipping[0].fob_city,
                        "State": productData.shipping[0].fob_state_code,
                        "Zip5": productData.shipping[0].fob_zip_code,
                        "Zip4": '0000'
                    };
                    let destination = {
                        "Address1": destinationAdd.street1,
                        "Address2": '',
                        "City": City,
                        "State": countryCodes.statecode,
                        "Zip5": destinationAdd.postalcode,
                        "Zip4": '0000'
                    };
                    destination = await destAddress(destination)
                    let cartItems = [{
                      "Qty": response_data[key].total_qty,
                      "Price": response_data[key].unit_price,
                      "TIC": '00000',
                      "ItemID": response_data[key].product_id,
                      "Index": 0
                    }]
                    let customerID = user_details.fullname + ' ' + response_data[key].user_id
                    // console.log('>>>>>>>>>>>>>>>>>>>>>>', origin, destination, cartItems, customerID, user_details.fullname)
                    let lookupData = {
                      "apiLoginID": taxdata.apiLoginID, 
                      "apiKey": taxdata.apiKey,
                      "customerID": customerID,
                      "cartItems": cartItems,
                      "origin": origin,
                      "destination": destination,
                      "cartID": "",
                      "deliveredBySeller": false
                    } 
                    await axios({
                      method: 'POST',
                      url: project_settings.taxcloud_url+ '/Lookup',
                      data: lookupData
                    }).then(async res => {
                      console.log('======>>', res)
                      if (res.data.ResponseType !== 0) {
                        tax = res.data.CartItemsResponse[0].TaxAmount
                        await axios({
                          method: 'PATCH',
                          url: project_settings.shopping_api_url + '/' + response_data[key].id,
                          data: {
                            taxcloud : {
                              tax_id: res.data.CartID,
                              api_id: lookupData.apiLoginID,
                              tax_amount: res.data.CartItemsResponse[0].TaxAmount,
                              type: 'standard'
                            }
                          }
                        }).then(res => {
                          console.log('Card Tax Updated', res.data)
                        }).catch(errr => {
                          console.log('Card Tax Not Updated', errr)
                        })
                      }
                    }).catch(err => {
                      console.log('Taxcloud Lookup Error ::', err)
                    })
                  } else {
                    tax = response_data[key].taxcloud.tax_amount     
                  }
                }
                
              }
            }
          }

          if(productData != null)
          {
            // $.ajax({
            //   type: 'GET',
            //   url: apiUrl+response_data[key].product_id,
            //   async: false,
            //   beforeSend: function (xhr) {
            //     xhr.setRequestHeader ('vid' , project_settings.vid);
            //   },
            //   dataType: 'json',
            //   success:  function (data) {
                // rawData = data.hits.hits;
                // productData = rawData;
                let ProductImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                if(productData.images != undefined)  {
                    ProductImage = productData.images[0].images[0].secure_url;
                }
                let listHtmlReplace = listHtml.replace('#data.image#',ProductImage);
                // let detailLink = project_settings.base_url+'productdetail.html?locale='+project_settings.default_culture+'&pid='+productData[0]._id;
                let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+response_data[key].product_id;
                listHtmlReplace = listHtmlReplace.replace(/#data.product_link#/g,detailLink);
                listHtmlReplace = listHtmlReplace.replace(/#data.id#/g,response_data[key].id);
                listHtmlReplace = listHtmlReplace.replace(/#data.product_id#/g,response_data[key].id);
                listHtmlReplace = listHtmlReplace.replace('#data.product_name#',productData.product_name);
                listHtmlReplace = listHtmlReplace.replace('#data.sku#',productData.sku);
                listHtmlReplace = listHtmlReplace.replace('#data.price#',parseFloat(productData.price_1).toFixed(project_settings.price_decimal));
                listHtmlReplace = listHtmlReplace.replace('#data.currency#',productData.currency);

                listHtmlReplace = listHtmlReplace.replace('#data.description#',productData.description);
                listHtmlReplace = listHtmlReplace.replace('#data.order_type#',response_data[key].order_type);

                if(typeof response_data[key].special_instruction != "undefined" && response_data[key].special_instruction !='')
                {
                  listHtmlReplace = listHtmlReplace.replace('#data.special_instruction#',"<div class='estimate-row heading'><span>Special Instructions</span></div><div><p>#data.special_instruction#</p></div>");
                }
                let special_instruction = nl2br(response_data[key].special_instruction);
                listHtmlReplace = listHtmlReplace.replace('#data.special_instruction#',special_instruction);

                listHtmlReplace = listHtmlReplace.replace('#data.quantitye#',response_data[key].total_qty);
                listHtmlReplace = listHtmlReplace.replace('#data.unit_price#',parseFloat(response_data[key].unit_price).toFixed(project_settings.price_decimal));
                var total = parseFloat(response_data[key].total_qty)*parseFloat(response_data[key].unit_price);
                total_display = total.toFixed(project_settings.price_decimal);
                listHtmlReplace = listHtmlReplace.replace(/#data.total#/g, total_display);
                listHtmlReplace = listHtmlReplace.replace(/#data.tax#/g,tax.toFixed(project_settings.price_decimal));

                let additional_charges_list = '';
                if(typeof response_data[key].charges != "undefined")
                {
                  for(let charge_list in response_data[key].charges)
                  {
                    additional_charges_list += capitalize(charge_list)+": $"+response_data[key].charges[charge_list];
                    charges = charges+parseFloat(response_data[key].charges[charge_list]);
                  }
                }

                if(additional_charges_list != '') {
                  listHtmlReplace = listHtmlReplace.replace(/#data.additional_charges_list#/g,additional_charges_list);
                }
                else {
                  listHtmlReplace = listHtmlReplace.replace(/#data.additional_charges_list#/g,"N/A");
                }

                listHtmlReplace = listHtmlReplace.replace(/#data.charges#/g,charges.toFixed(project_settings.price_decimal));


                //change // var listHtmlReplace = listHtmlReplace.replace("#data.shipping_charges#",shipping_charges);

                //Imprint Information
                let imprintHtml = '';
                let print_position = '';
                let imprint_method = '';
                let howmany_colors = '';
                if(typeof response_data[key].imprint != "undefined")
                {
                  for (let [i,imprint_info] of response_data[key].imprint.entries())
                  {
                    var imprintSectionHtml1 = imprintSectionHtml;

                    if(typeof imprint_info.imprint_position_name != "undefined" && imprint_info.imprint_position_name != "")
                    {
                      print_position = "<span class='header-color'>Print Position: </span> "+imprint_info.imprint_position_name+" <br />";
                    }
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.print_position#",print_position)

                    if(typeof imprint_info.imprint_method_name != "undefined" && imprint_info.imprint_method_name != "")
                    {
                      imprint_method = "<span class='header-color'>Imprint Method: </span> "+imprint_info.imprint_method_name+" <br />";
                    }
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprint_method#",imprint_method)

                    if(typeof imprint_info.no_of_color != "undefined" && imprint_info.no_of_color != "") {
                      howmany_colors = "<span class='header-color'>How many colors: </span> "+imprint_info.no_of_color+" <br />";
                    }
                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.howmany_colors#",howmany_colors)

                    colorHtml = '';
                    if(typeof imprint_info.selected_colors != "undefined")
                    {
                      for(var selected_color in imprint_info.selected_colors)
                      {
                        let colorCount = parseInt(selected_color)+1;
                        colorHtml += "<div>Color"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
                      }
                    }

                    imprintSectionHtml1 = imprintSectionHtml1.replace("#data.colours#",colorHtml+"<br />")
                    imprintHtml += imprintSectionHtml1;

                    //artwork
                    if(typeof imprint_info.artwork_type != "undefined" && typeof imprint_info.artwork != "undefined")
                    {
                      let artwork_type = imprint_info.artwork_type;
                      let checkSendEmail = '';
                      if(artwork_type == "upload_artwork_typeset")
                      {
                          if(typeof imprint_info.artwork.artwork_text_email != "undefined")
                          {
                            checkSendEmail = '<span class="header-color">Art Work Via Email</span>: <span>artwork@flowz.com</span>';
                          }
                      }
                      else if(artwork_type == "upload_artwork")
                      {
                          if(typeof imprint_info.artwork.artwork_email != "undefined")
                          {
                            checkSendEmail = '<span class="header-color">Art Work Via Email</span>: <span>artwork@flowz.com</span>';
                          }
                      }

                      if(checkSendEmail != "")
                      {
                        imprintHtml += checkSendEmail;
                      }

                      let thumbImg = '';

                      if(typeof imprint_info.artwork.artwork_thumb != "undefined")
                      {
                          for (let [i,artwork_thumb] of imprint_info.artwork.artwork_thumb.entries())
                          {
                              let j = i+1;
                              thumbImg += '<div class="estimate-row"><span class="header-color">Uploaded Artwork '+j+'</span>: <img alt="" src="'+artwork_thumb+'" style="max-width:50px;max-height:50px;"><br><br></div>';
                          }
                      }

                      if(thumbImg != "")
                      {
                        imprintHtml += thumbImg;
                      }

                      let artText = '';

                      if(typeof imprint_info.artwork.artwork_text != "undefined")
                      {
                        for (let [i,artwork_text] of imprint_info.artwork.artwork_text.entries())
                        {
                            let j = i+1;
                            artText += '<div class="estimate-row"><span class="header-color">Text '+j+'</span> : <span> '+artwork_text+'</span><br></div>';
                        }
                      }

                      if(typeof imprint_info.artwork.artwork_instruction != "undefined")
                      {
                        artText += '<div class="estimate-row"><span class="header-color">Instructions :</span> <span> '+imprint_info.artwork.artwork_instruction+'</span><br></div>';
                      }
                      imprintHtml += artText;
                    }
                    //artwork -end

                  }
                }

                // var listHtmlReplace = listHtmlReplace.replace('#data.imprint_info#',imprintHtml);
                //END - Imprint Information

                if(typeof response_data[key].shipping_method.shipping_type != "undefined")
                {
                  listHtmlReplace = listHtmlReplace.replace('#data.shipping_type#',response_data[key].shipping_method.shipping_type);
                }
                else{
                  listHtmlReplace = listHtmlReplace.replace('#data.shipping_type#',"-");
                }

                listHtmlReplace = listHtmlReplace.replace(/#data.cart_id#/g,response_data[key].id);
                listHtmlReplace = listHtmlReplace.replace('#data.edit_link#',website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+response_data[key].product_id+'&cid='+response_data[key].id);

                // Shipping Section
                if(typeof response_data[key].shipping_method != "undefined")
                {
                  var shipping_detail = response_data[key].shipping_method.shipping_detail;
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

                    if(shipping_details.shipping_carrier == '' && shipping_details.shipping_method == '' && shipping_details.on_hand_date == '') {
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_method#",'');
                      shippingHtml1 = shippingHtml1.replace("#data.ship_account#",'');
                      shippingHtml1 = shippingHtml1.replace("#data.on_hand_date#",'');
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_carrier#","N/A");
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_count#",shippingKeyCount);
                    }
                    else {
                      if(shipping_details.shipping_carrier != '') {
                        shippingHtml1 = shippingHtml1.replace("#data.shipping_carrier#","<span>Shipping Carrier: </span> #data.shipping_carrier# <br />");
                      }
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_carrier#",shipping_details.shipping_carrier.toUpperCase());
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_count#",shippingKeyCount);
                      if(shipping_details.shipping_method != '') {
                        shippingHtml1 = shippingHtml1.replace("#data.shipping_method#","<span>Method: </span> #data.shipping_method# <br />");
                      }
                      shippingHtml1 = shippingHtml1.replace("#data.shipping_method#",shipping_details.shipping_method);
                      shippingHtml1 = shippingHtml1.replace("#data.ship_account#",'')
                      if(shipping_details.on_hand_date != '') {
                        shippingHtml1 = shippingHtml1.replace("#data.on_hand_date#","<span>In Hand Date: </span> #data.on_hand_date#");
                      }
                      shippingHtml1 = shippingHtml1.replace("#data.on_hand_date#",shipping_details.on_hand_date);
                    }


                    //change
                    if(shipping_details.shipping_charge != "")
                    {
                      var shippingHtml1 = shippingHtml1.replace(/#data.shipping_charges#/g,parseFloat(shipping_details.shipping_charge).toFixed(project_settings.price_decimal));

                      product_shipping_charge_total = product_shipping_charge_total + parseFloat(shipping_details.shipping_charge);
                      product_shipping_charges = product_shipping_charges + parseFloat(shipping_details.shipping_charge);
                    }
                    else{
                      var shippingHtml1 = shippingHtml1.replace(/#data.shipping_charges#/g,"0.00");
                    }
                    $(".js-shipping-"+response_data[key].id).find(".js-product_total_shipping_charge").html(product_shipping_charges.toFixed(project_settings.price_decimal));

                    //END - change

                    let replaceAddressHtml = await addressBookHtml(shipping_info.selected_address_id)
                    shippingHtml1 = shippingHtml1.replace("#data.address_book#",replaceAddressHtml)
                    // shippingHtmlReplace += replaceAddressHtml;
                    shippingHtmlReplace += shippingHtml1;

                  }
                  // $( shippingHtmlReplace ).insertAfter( ".js-product-"+response_data[key].id );
                }
                // END - Shipping Section
                var sub_total = total + charges + tax + product_shipping_charges;
                sub_total_display = sub_total.toFixed(project_settings.price_decimal);
                listHtmlReplace = listHtmlReplace.replace(/#data.subtotal#/g, sub_total_display);
                listHtmlReplace = listHtmlReplace.replace("#data.total_shipping_charges#", product_shipping_charges.toFixed(project_settings.price_decimal));

                product_total = product_total + total;
                product_additional_charge_total = product_additional_charge_total + charges;
                //change // product_shipping_charge_total = product_shipping_charge_total + shipping_charges;
                product_tax_total = product_tax_total + tax;

                productHtml = listHtmlReplace;

                if(key == 0) {
                  $('#js-cart_data .js-listing').html(productHtml);
                }
                else {
                  $('#js-cart_data .js-listing').append(productHtml);
                }

                if(websiteConfiguration.transaction.place_order.cart_list.view_button.status == 0){
                  $(".js-product-action-"+response_data[key].id).find(".js_view_order").remove();
                }

                if(websiteConfiguration.transaction.place_order.cart_list.edit_button.status == 0){
                  $(".js-product-action-"+response_data[key].id).find(".js_edit_order").remove();
                }

                if(websiteConfiguration.transaction.place_order.cart_list.delete_button.status == 0){
                  $(".js-product-action-"+response_data[key].id).find(".js-btn-delete-cart-list").remove();
                }
                
                if(websiteConfiguration.transaction.place_order.checkout.status == 0){
                  $(".js_proceed_checkout").remove();                  
                }
                
                
                if(productData.pricing != undefined){
                  let priceRang = '';
                  $.each(productData.pricing, function(index,element){
                          if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                               $.each(element.price_range,function(index,element2){
                                 if(element2.qty.lte != undefined){
                                    priceRang += '<div><div class="table-heading">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content">' + '$' + element2.price + '</div></div>';
                                  }
                                  else
                                  {
                                    priceRang += '<div><div class="table-heading">'+ element2.qty.gte + '+' + '</div><div class="table-content">' + '$' + element2.price + '</div></div>';
                                  }
                                 });
                               $(".js-product-"+response_data[key].id).find(".quantity-table-col").html(priceRang);
                          }
                  });
             }
                if(imprintHtml != '') {
                  $(".js-product-"+response_data[key].id).find(".js-imprint-information").html(imprintHtml);
                }
                else {
                  $(".js-product-"+response_data[key].id).find(".js-imprint-information").html('N/A');
                }

                $( shippingHtmlReplace ).insertAfter( ".js-product-"+response_data[key].id );
              // }
            // });
          }
          else{
            if(key == 0)
            {
              $('#js-cart_data .js-listing').html('');
            }
            $("#cartCount").html(response_data.length-1);
            await deleteItemById(project_settings.shopping_api_url+"/"+response_data[key].id);
          }
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
        if($("#cartCount").html() == 0)
        {
          $('#js-cart_data').html("<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'><div class='col-sm-6 col-md-6 col-lg-6 col-xs-12'>No records found.</div></div>")
        }

        $("#js-cart_data").removeClass('hide');
        replaceColorNameWithHexaCodesNew()

        // QUANTITY PRICE TABLE START
    $(".quantity-table-col").owlCarousel({
      stopOnHover : true,
      navigation:true,
      items : 4,
      itemsDesktop: [1199, 4],
      itemsDesktopSmall: [979, 4],
      itemsTablet: [767, 2],
      itemsMobile: [479, 2]
  });
  // END QUANTITY PRICE TABLE END
      }
      else if(response_data == '')
      {
        $('#js-cart_data').html("<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'><div class='col-sm-6 col-md-6 col-lg-6 col-xs-12'>No records found.</div></div>")
        $("#js-cart_data").removeClass('hide');
      }
      else if(response_data.status=='error')
      {
        $('#js-cart_data').html("<hr> Error.")
        $("#js-cart_data").removeClass('hide');
      }
      hidePageAjaxLoading()
    // }
  })
}

async function addressBookHtml(id) {
	if(id  != undefined )
	{
	    let addressBookData = await returnAddressBookDetailById(id)
        let replaceAddressHtml = '';
        if(addressBookData != null) {
            replaceAddressHtml += addressBookData.name+"<br>";
            if(addressBookData.street2 != undefined && addressBookData.street2 !=''){
              replaceAddressHtml += addressBookData.street1;
              replaceAddressHtml += ","+addressBookData.street2+",<br>";
            }
            else{
              replaceAddressHtml += addressBookData.street1+",<br>";
            }
            replaceAddressHtml += await getCountryStateCityById(addressBookData.city,3)+",";
            replaceAddressHtml += await getCountryStateCityById(addressBookData.state,2)+"<br>";
            replaceAddressHtml += await getCountryStateCityById(addressBookData.country,1);
            if(addressBookData.postalcode != undefined ){
              replaceAddressHtml += " - "+addressBookData.postalcode+"<br>";
            }
            replaceAddressHtml += "Email: "+addressBookData.email+"<br>";
            if(addressBookData.phone != undefined ){
              replaceAddressHtml += "T: "+addressBookData.phone;
            }
            if(addressBookData.mobile != undefined && addressBookData.mobile !=''){
              replaceAddressHtml += ",<br>M: "+addressBookData.mobile+"<br>";
            }
        }
	      return replaceAddressHtml;
	}
}

$(document).on("click",".js_view_order",function () {
  $(this).parents('.js_main_shopping_block').find('.js_view_item_details').slideToggle( "slow" );
});

// onclick delete button

$(document).on('click', '.js-btn-delete-cart-list', function(e) {
  e.preventDefault();
  
  if(websiteConfiguration.transaction.place_order.cart_list.delete_button.status == 1)
  {
    var id = $(this).data('cart-id');
    $(this).closest('.js_deleted_product').addClass('js-cart-'+id);

    bootbox.confirm("Are you sure want to delete?", function(confirmation)
    { 
      if(confirmation)
      {     
        showPageAjaxLoading()
        $.ajax({
          type : 'DELETE',
          url : project_settings.shopping_api_url+'/'+id,
          dataType : 'json',
          success : function(response_data) {

            if(response_data != "")
            {
              $('.js-cart-'+id).remove();
              let replaceTotal = 0;

              if($( ".js-total" ).length == 0)
              {
                location.reload();
              }

              $( ".js-total" ).each(function( index ) {
                replaceTotal = replaceTotal + parseFloat($( this ).html().replace("$",""));
              });

              let additinalChargeTotal = 0.00;

              $( ".js-product_additional_charge" ).each(function( index ) {
                additinalChargeTotal = additinalChargeTotal + parseFloat($( this ).html());
              });

              let shippingChargeTotal = 0.00;

              $( ".js-product_total_shipping_charge" ).each(function( index ) {
                shippingChargeTotal = shippingChargeTotal + parseFloat($( this ).html());
              });

              $(".js-cart-total").html(replaceTotal.toFixed(project_settings.price_decimal))
              // var additional_charges = parseFloat(additinalChargeTotal).toFixed(project_settings.price_decimal);;
              // var shipping_charges = parseFloat(shippingChargeTotal).toFixed(project_settings.price_decimal);;

              var tax = parseFloat($('.js-tax').html());
              $('.js-additional-charges').html(additinalChargeTotal.toFixed(project_settings.price_decimal));
              $('.js-shipping-charges').html(shippingChargeTotal.toFixed(project_settings.price_decimal));

              var grand_total = replaceTotal + additinalChargeTotal + shippingChargeTotal + tax;
              $(".js-grand-total").html(grand_total.toFixed(project_settings.price_decimal))  ;
              hidePageAjaxLoading()
            }
          }
        });
      }
    })
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

function replaceColorNameWithHexaCodesNew(){
    //var data = { 'colors': colors };
  let all_colors = [];
  $( ".shipping_color" ).each(function( index,colorCheckbox ) {
    let single_color = $( this ).data("color")
    single_color = single_color.replace(/_/g,' ');
    single_color = titleCase(single_color)

    all_colors.push(single_color)
  });

  let data = {'colorname':all_colors};
  //var data = {'colorname':all_colors,'skip':0,'limit':all_colors.length};
  $.ajax({
    type : 'GET',
    url : project_settings.color_table_api_url,
    data : data,
    dataType : 'json',
    success : function(response_data) {

      $( ".shipping_color" ).each(function( index ) {
        //var bgColor = $( this ).parent().css("background-color");
        var bgColor = $( this ).data("color");
        var checkbox = $( this )

        if(typeof response_data.data != 'undefined')
        {
          $.each(response_data.data, function( index, value ) {

            if(typeof value.colorname != 'undefined')
            {
              if(value.colorname.toLowerCase().replace(/_/g,' ') == bgColor.toLowerCase().replace(/_/g,' '))
              if(typeof value.hexcode != 'undefined')
              {
                checkbox.attr("data-color",value.hexcode)
                checkbox.css('background-color',value.hexcode)
                checkbox.attr('title',value.colorname)
              }
            }
          });
        }
      });
    }
  })
}


function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}
