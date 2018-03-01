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

  //console.log("url", callApiUrl+'?id='+quoteId+'&user_id='+user_id+'&website_id='+website_settings['projectID']);
  //console.log("HTML", quoteDetailHtml);
  showPageAjaxLoading()
  axios({
      method: 'GET',
      url : callApiUrl+'?id='+quoteId+'&user_id='+user_id+'&website_id='+website_settings['projectID'],
    })
  .then(response_data => {
    let quote_data = response_data.data.data[0];
    let productData = quote_data.product_description;

    if (quote_data!= "") {
      //  project_settings.product_api_image_url
      let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+quote_data.product_id;

      // Start - Color Information
      colorRaw = '';
      if(typeof quote_data.color != "undefined" || quote_data.color!='') {
        for (var color_quantity in quote_data.color) {
          //console.log('colorSectionHtml', colorSectionHtml)
          var colorSection = colorSectionHtml.html();
          //console.log('colorSection', colorSection)
          colorSection = colorSection.replace("#data.color#",color_quantity)
          colorSection = colorSection.replace("#data.totalQty#",quote_data.color[color_quantity])
          colorRaw += colorSection;
        }
      }
      console.log('colorRaw', colorRaw)
      quoteDetailHtml.find(".js-color-info").html(colorRaw)
      // END - Color Information

      // Start - Shipping Information
      var shippingHtmlReplace = '';
      if(typeof quote_data.shipping_method != "undefined")
      {
        var shipping_detail = quote_data.shipping_method.shipping_detail;

        for(var shippingKey in shipping_detail)
        {
          var shippingHtml1 = shippingSectionHtml.html();
          console.log('shippingHtml1',shippingHtml1);
          var shipping_info = shipping_detail[shippingKey];
          var shipping_details = shipping_info.shipping_detail;

          shippingHtml1 = shippingHtml1.replace("#data.shippingCarrier#",shipping_details.shipping_carrier)
          shippingHtml1 = shippingHtml1.replace("#data.shippingMethod#",shipping_details.shipping_method)
          // var shippingHtml1 = shippingHtml1.replace("#data.ship_account#",' ')
          shippingHtml1 = shippingHtml1.replace("#data.onHandDate#",shipping_details.on_hand_date)
          shippingHtml1 = shippingHtml1.replace(/#data.shippingCharge#/g,shipping_details.shipping_charge);

          shippingHtmlReplace += shippingHtml1;
          console.log('shippingHtmlReplace',shippingHtmlReplace);
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
              colorHtml += "<div>Colour"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
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
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.product_link#/g,detailLink);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.imageUrl#/g, project_settings.product_api_image_url+productData.default_image);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.title#/g, productData.product_name);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.itemCode#/g, productData.sku);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.shippingCharge#/g, 0);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.zipCode#/g, 0);
    var detailHtmlReplace = detailHtmlReplace.replace(/#data.onHandDate#/g, 0);

    if(quote_data.special_instruction != "" || quote_data.special_instruction.length>0)
    {
      var detailHtmlReplace = detailHtmlReplace.replace(/#data.specialInstruction#/g,quote_data.special_instruction);
    }
    else{
      var detailHtmlReplace = detailHtmlReplace.replace(/#data.specialInstruction#/g,'N/A');
    }

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
