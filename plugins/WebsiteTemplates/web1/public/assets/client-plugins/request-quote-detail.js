if (user_id == null ) {
  window.location = 'login.html';
}

$(document).ready(function(){
  detailRequestQuote();
});

function detailRequestQuote() {
  let quoteId= getParameterByName('id');
  let callApiUrl = project_settings.request_quote_api_url;
  var quoteDetailHtml = $("#quote-detail");
  var imprintSectionHtml = $(".js-imprint-information").wrap('<p>');
  var colorSectionHtml = $(".js-color-info");
  var shippingSectionHtml = $(".js-shipping-info").wrap('<p>');

  let quote_api_url = project_settings.request_quote_api_url+'?id='+quoteId+'&user_id='+user_id+'&website_id='+website_settings['projectID']
  if(admin_role_flag == 1){
      quote_api_url = project_settings.request_quote_api_url+'?id='+quoteId+'&website_id='+website_settings['projectID']
  }
  //console.log("url", callApiUrl+'?id='+quoteId+'&user_id='+user_id+'&website_id='+website_settings['projectID']);
  //console.log("HTML", quoteDetailHtml);
  showPageAjaxLoading()
  axios({
      method: 'GET',
      url : quote_api_url,
    })
  .then(async response_data => {
    let quote_data = response_data.data.data[0];
    let productData = quote_data.product_description;

    if (quote_data!= "") {
      //  project_settings.product_api_image_url
      let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+quote_data.product_id;

      // Start - Color Information
      colorRaw = '';
      if(quote_data.color!='') {
        for (var color_quantity in quote_data.color) {
          var colorSection = colorSectionHtml.html();
          colorSection = colorSection.replace("#data.color#",color_quantity)
          colorSection = colorSection.replace("#data.totalQty#",quote_data.color[color_quantity])
          colorRaw += colorSection;
        }
      }

      quoteDetailHtml.find(".js-color-info").html(colorRaw)
      // END - Color Information

      // Start - Shipping Information
      var shippingHtmlReplace = '';
      if(typeof quote_data.shipping_method != "undefined")
      {
        var shipping_detail = quote_data.shipping_method.shipping_detail;

        console.log(quote_data);
        for(var shippingKey in shipping_detail)
        {
          var shippingHtml1 = shippingSectionHtml.html();
          var shipping_info = shipping_detail[shippingKey];
          var shipping_details = shipping_info.shipping_detail;
          var selected_address_id = shipping_info.selected_address_id;

          var quantityHtml = '<table class="size-quantity-table" style="margin-bottom:0px;">';
          for (var color_quantity in shipping_info.color_quantity) {
            quantityHtml += "<tr>";
            quantityHtml += "<td>"+color_quantity+": </td>";
            quantityHtml += "<td>"+shipping_info.color_quantity[color_quantity]+"</td>";
            quantityHtml += "</tr>";
          }

          quantityHtml += "</table>";

          shippingHtml1 = shippingHtml1.replace("#data.color_quantity#",quantityHtml)

          let replaceAddressHtml = await addressBookHtml(selected_address_id)
          shippingHtml1 = shippingHtml1.replace("#data.address_book#",replaceAddressHtml)

          shippingHtml1 = shippingHtml1.replace("#data.shippingCarrier#",shipping_details.shipping_carrier)
          shippingHtml1 = shippingHtml1.replace("#data.shippingMethod#",shipping_details.shipping_method)
          // var shippingHtml1 = shippingHtml1.replace("#data.ship_account#",' ')
          shippingHtml1 = shippingHtml1.replace("#data.onHandDate#",shipping_details.on_hand_date)
          shippingHtml1 = shippingHtml1.replace(/#data.shippingCharge#/g,shipping_details.shipping_charge);

          shippingHtmlReplace += shippingHtml1;
        }
      }
      quoteDetailHtml.find(".js-shipping-info").unwrap().html(shippingHtmlReplace)

      // END - Shipping Information

      //Imprint Information
      imprintHtml = '';
      if(typeof quote_data.imprint != "undefined")
      {
        for (let [i,imprint_info] of quote_data.imprint.entries())
        {
          var imprintSectionHtml1 = imprintSectionHtml.html();
          //console.log('imprintSectionHtml1',imprintSectionHtml1);
          imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprintPostion#",imprint_info.imprint_position_name)
          imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprintMethod#",imprint_info.imprint_method_name)
          imprintSectionHtml1 = imprintSectionHtml1.replace("#data.howmanyColors#",imprint_info.no_of_color)

          colorHtml = '';

          if(typeof imprint_info.selected_colors != "undefined")
          {
            for(var selected_color in imprint_info.selected_colors)
            {
              let colorCount = parseInt(selected_color)+1;
              colorHtml += "<div>Color"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
            }
          }
          imprintSectionHtml1 = imprintSectionHtml1.replace("#data.imprintColors#",colorHtml)
          imprintHtml += imprintSectionHtml1;
          //console.log('imprintHtml',imprintHtml);
        }
      }
      //END - Imprint Information
     quoteDetailHtml.find(".js-imprint-information").unwrap().html(imprintHtml)


    var detailHtmlReplace = quoteDetailHtml.html();
    var detailHtmlReplace = detailHtmlReplace.replace("#data.product_link#",detailLink);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.imageUrl#", productData.default_image.images[0].images[0].secure_url);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.title#", productData.product_name);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.itemCode#", productData.sku);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.shippingCharge#", 0);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.zipCode#", 0);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.onHandDate#", 0);

    if(quote_data.special_instruction != "" || quote_data.special_instruction.length>0)
    {
      var detailHtmlReplace = detailHtmlReplace.replace(/#data.specialInstruction#/g,quote_data.special_instruction);
    }
    else{
      var detailHtmlReplace = detailHtmlReplace.replace(/#data.specialInstruction#/g,'N/A');
    }

    // My acccount Info
    var myAccountInfo = quote_data.user_info;

    var fullname = (myAccountInfo['fullname'])? myAccountInfo['fullname'] : '';
    var firstname = (myAccountInfo['firstname'])? myAccountInfo['firstname'] : '';
    var lastname = (myAccountInfo['lastname']) ? myAccountInfo['lastname'] : '';
    var address1 = (myAccountInfo['address1']) ? myAccountInfo['address1'] : '';
    var address2 = (myAccountInfo['address2']) ? myAccountInfo['address2'] : '';
    var country = (myAccountInfo['country']) ? myAccountInfo['country'] : '';
    var state = (myAccountInfo['state']) ? myAccountInfo['state']  : '';
    var city = (myAccountInfo['city']) ? myAccountInfo['city'] : '';
    var postalcode = (myAccountInfo['postalcode']) ? myAccountInfo['postalcode'] : '';
    var phone = (myAccountInfo['phone']) ? myAccountInfo['phone'] : '';
    var mobile = (myAccountInfo['mobile']) ? myAccountInfo['mobile'] : '';
    var email = (myAccountInfo['email']) ? myAccountInfo['email'] : '';
    var userEmail = (myAccountInfo['userEmail']) ? myAccountInfo['userEmail'] : '';

    var detailHtmlReplace = detailHtmlReplace.replace("#data.fullname#", fullname);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.firstname#", firstname);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.lastname#", lastname);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.address1#", address1);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.address2#", address2);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.country#", country);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.state#", state);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.city#", city);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.postalcode#", postalcode);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.phone#", phone);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.mobile#", mobile);
    var detailHtmlReplace = detailHtmlReplace.replace("#data.email#", email);

  //  console.log("detailHtmlReplace", detailHtmlReplace);
    $("#quote-detail").html(detailHtmlReplace);
    }
    else if(response_data == '')
    {
      window.location.href = "myInquiriesList.html"
    }
    hidePageAjaxLoading()
  })

}
