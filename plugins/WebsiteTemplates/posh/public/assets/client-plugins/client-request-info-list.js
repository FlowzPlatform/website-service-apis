if (user_id == null ) {
  window.location.href = 'login.html';
}

$(document).ready(function(){
  $(".breadcrumb li:last-child").html('<strong>My Sent Request Info</strong>')
  if( admin_role_flag == 1 ){
      $(".main-title").html('<i class="fa fa-user"></i> Received Inquiries List')
      $(".breadcrumb li:last-child").html('<strong>Received Inquiries List</strong>')
  }
  $(".breadcrumb li:last-child").removeClass("hide")
  $(".tabbable ul li.active").trigger("click");

});

if(websiteConfiguration.my_account.my_sent_inquiries.status == 0)
{
  let html = '<div class="col-sm-12 col-md-12 col-lg-12 col-xs-12"><div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">Access Denied</div></div>';

  $(".ob-main-address-block").html(html);
  $('.js-hide-div').removeClass("js-hide-div");
}

$(document).on("click", '.js-btn-comment-list', function(e){
    let RequestId = $(".js_add_html").find("#js-request_info_id").val()
    let message = $(".js_add_html").find("#js-comment_requestinfo").val()
    let Module = $(".js_add_html").find("#js-module_name").val()
    showPageAjaxLoading();
    var data = {'RequestId':RequestId,'Module':Module,'message':message,'websiteid':website_settings['projectID'],'subscriptionId':website_settings['subscriptionId']}
    axios({
        method: 'POST',
        url : project_settings.comment_request_url,
        'headers': {"Authorization": userToken},
        data : data,
        cache: false,
        dataType : 'json'
    }).then(async response_data => {
        let msgCount = await getAddedComments(RequestId)
        timeAgo()
        $("#row-"+RequestId).find(".js-total_comments").html(msgCount);
        hidePageAjaxLoading()
    }).catch(function (error) {
        console.log("error",error);
        hidePageAjaxLoading()
    });
});



$(".tabbable ul li").on("click",function(){
    // request info listing
    showPageAjaxLoading();
    let activeTab = $(this).data("target");
    if(activeTab == '#request-info'){
        let requestInfoApiUrl = project_settings.request_info_api_url+'?userId='+user_id+"&website_id="+website_settings['projectID']
        if( admin_role_flag == 1 ){
            requestInfoApiUrl = project_settings.request_info_api_url+"?website_id="+website_settings['projectID']
        }
        axios({
          method: 'GET',
          url : requestInfoApiUrl,
        })
        .then(async response_data => {
            if($(activeTab).find(".my-inquiry-data:gt(0)").length > 0 ) $(activeTab).find(".my-inquiry-data:gt(0)").remove(); // To reset list of info
            let inquiryHtml = $(activeTab).find(".my-inquiry-data:first").closest('tbody').html();
            let replaceHtml = ''
            if(response_data.data.total > 0){
                  for(let [key,dataVal] of response_data.data.data.entries()){
                  // console.log("dataVal",dataVal);
                    let inquiryHtml1 = inquiryHtml.replace(/#data.index#/g,key+1)
                    inquiryHtml1 = inquiryHtml1.replace(/#data.itemName#/g, dataVal.productInfo[0].product_name);
                    inquiryHtml1 = inquiryHtml1.replace(/#data.date#/g, formatDate(dataVal.createAt,project_settings.format_date));
                    let msgCount = await getAddedComments(dataVal.id)

                    inquiryHtml1 = inquiryHtml1.replace("#data.totalComments#", msgCount);
                    inquiryHtml1 = inquiryHtml1.replace(/#data.id#/g, dataVal.id);
                    if( admin_role_flag == 1 ){
                        if(dataVal.userId != null ){
                            let userInfo = await getUserDetailById(dataVal.userId)
                            if(userInfo != null){
                                inquiryHtml1 = inquiryHtml1.replace(/#data.userName#/g, userInfo.fullname);
                                inquiryHtml1 = inquiryHtml1.replace(/#data.userEmail#/g, userInfo.email);
                                inquiryHtml1 = inquiryHtml1.replace("#data.userType#", "Registered");
                            }
                        }else{
                          inquiryHtml1 = inquiryHtml1.replace(/#data.userName#/g, dataVal.guestUserInfo.fullName);
                          inquiryHtml1 = inquiryHtml1.replace(/#data.userEmail#/g, dataVal.guestUserInfo.email);
                          inquiryHtml1 = inquiryHtml1.replace("#data.userType#", "Guest");
                        }
                    }
                    replaceHtml += inquiryHtml1
                }
                $(activeTab).find(".my-inquiry-data:first").closest('tbody').append(replaceHtml)
                $(activeTab).find(".my-inquiry-data:first").nextAll().removeClass("hide")
                if( admin_role_flag == 1 ){
                  $(activeTab).find(".js_is_admin").removeClass("hide")
                  $(activeTab).find(".js_is_admin1").removeClass("hide")
                }
                //console.log("replaceHtml",replaceHtml);
            }else{
              replaceHtml = '<tr class="my-inquiry-data"><td colspan="5">There are no Record(s)</td></tr>';
              $(activeTab).find(".my-inquiry-data:first").closest('tbody').append(replaceHtml)
            }
            hidePageAjaxLoading();
        })
        .catch(function (error) {
            // console.log("error",error);
            hidePageAjaxLoading();
        });
    }else{

      let requestQuoteApiUrl = project_settings.request_quote_api_url+'?user_id='+user_id+"&website_id="+website_settings['projectID']
      if( admin_role_flag == 1 ){
          requestQuoteApiUrl = project_settings.request_quote_api_url+"?website_id="+website_settings['projectID']
      }

      axios({
        method: 'GET',
        url : requestQuoteApiUrl,
      })
      .then(async response_data => {
          if($(activeTab).find(".my-inquiry-data:gt(0)").length > 0 ) $(activeTab).find(".my-inquiry-data:gt(0)").remove();// To reset list of request quote
          let inquiryHtml = $(activeTab).find(".my-inquiry-data:first").closest('tbody').html();
          let replaceHtml = ''
          //console.log("response_data",response_data);
          if(response_data.data.total > 0){
                for(let [key,dataVal] of response_data.data.data.entries()){
                    let inquiryHtml1 = inquiryHtml.replace(/#data.index#/g,key+1)
                    inquiryHtml1 = inquiryHtml1.replace(/#data.itemName#/g, dataVal.product_description.product_name);
                    inquiryHtml1 = inquiryHtml1.replace(/#data.date#/g, formatDate(dataVal.created_at,project_settings.format_date));

                    let msgCount = await getAddedComments(dataVal.id)

                    inquiryHtml1 = inquiryHtml1.replace("#data.totalComments#", msgCount);

                    inquiryHtml1 = inquiryHtml1.replace(/#data.id#/g, dataVal.id);
                    if( admin_role_flag == 1 ){
                        let userInfo = await getUserDetailById(dataVal.user_id)
                        if(userInfo != null){
                            inquiryHtml1 = inquiryHtml1.replace(/#data.userName#/g, userInfo.fullname);
                            inquiryHtml1 = inquiryHtml1.replace(/#data.userEmail#/g, userInfo.email);
                        }
                    }
                    replaceHtml += inquiryHtml1
                }
                $(activeTab).find(".my-inquiry-data:first").closest('tbody').append(replaceHtml)
                $(activeTab).find(".my-inquiry-data:first").nextAll().removeClass("hide")
                if( admin_role_flag == 1 ){
                  $(activeTab).find(".js_is_admin").removeClass("hide")
                }
          }else{
            replaceHtml = '<tr class="my-inquiry-data"><td colspan="5">There are no Record(s)</td></tr>';
            $(activeTab).find(".my-inquiry-data:first").closest('tbody').append(replaceHtml)
          }
          hidePageAjaxLoading();
      })
      .catch(function (error) {
          console.log("error",error);
          hidePageAjaxLoading();
      });

    }
})

$(document).on("click", '.js-open-modal-req-info-detail', function(e){
    let activeTab = $(this).closest(".tab-pane").attr("id");
    if(activeTab == "request-info"){
        detailRequestInfo($(this))
    }else{
        detailRequestQuote($(this))
    }

});

function detailRequestQuote(thisObj){
    showPageAjaxLoading();
    let infoId = thisObj.data("id")
    $('#modal-table').addClass('model-popup-black');
    $('#modal-table').addClass('request-info-popup-modal');
    $("#modal-table").find(".modal-title").html('<i class="fa fa-question-circle"></i>View & Comment Request Quote')
    $("#modal-table").find(".modal-dialog").addClass("modal-lg")

    axios({
        method: 'GET',
        url : project_settings.request_quote_api_url+"/"+infoId,
    })
    .then(async response_data => {
        let requestQuoteData = response_data.data
        // console.log("requestQuoteData",requestQuoteData);
        let productData = requestQuoteData.product_description;
        let requestQuoteHtml = $(".js_request_quote_modal").html()
        let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+requestQuoteData.product_id;

        let userInfo = await getUserDetailById(requestQuoteData.user_id)

        let userInfoHtml = ""
        userInfoHtml += "<h4>"+userInfo.fullname+"</h4>"

        // pending to fetch data from user after edit account
        //userInfoHtml += "<p></p>"

        let userContactInfoHtml = ""
        if(userInfo.phone != undefined && userInfo.phone != "") userContactInfoHtml += "<li><i class='fa fa-phone'></i>"+userInfo.phone+"</li>";
        if(userInfo.email != undefined && userInfo.email != "") userContactInfoHtml += "<li><i class='fa fa-envelope'></i>"+userInfo.email+"</li>";

        let pricingHtml = ''

        if(productData.pricing != undefined){
              $.each(productData.pricing, function(index,element){
                    if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                        $.each(element.price_range,function(index,element2){
                              if(element2.qty.lte != undefined){
                                    pricingHtml += '<div><div class="table-heading">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                              }else
                              {
                                    pricingHtml += '<div><div class="table-heading">'+ element2.qty.gte + '+' + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                              }
                        })
                    }
              })
        }

        requestQuoteHtml = requestQuoteHtml.replace(/#data.createAt#/g,formatDate(requestQuoteData.created_at,project_settings.format_date))

        requestQuoteHtml = requestQuoteHtml.replace(/#data.infoId#/g,requestQuoteData.id)
        requestQuoteHtml = requestQuoteHtml.replace("#data.module#","request-quote")

        requestQuoteHtml = requestQuoteHtml.replace(/#data.id#/g,requestQuoteData.id)
        let productImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
        if(productData.images != undefined){
            productImage = productData.images[0].images[0].secure_url
        }
        requestQuoteHtml = requestQuoteHtml.replace("#data.productImage#",productImage)
        requestQuoteHtml = requestQuoteHtml.replace("#data.productName#",productData.product_name)
        requestQuoteHtml = requestQuoteHtml.replace("#data.sku#",productData.sku)
        requestQuoteHtml = requestQuoteHtml.replace("#data.product_link#",detailLink)
        requestQuoteHtml = requestQuoteHtml.replace("#data.pricing#",pricingHtml)

        requestQuoteHtml = requestQuoteHtml.replace("#data.userInfo#",userInfoHtml)
        requestQuoteHtml = requestQuoteHtml.replace("#data.userContactInfo#",userContactInfoHtml)
        requestQuoteHtml = requestQuoteHtml.replace("#data.instruction#",requestQuoteData.special_instruction);
        $(".js_add_html").html(requestQuoteHtml)

        // Shipping Section

        let shippingHtmlReplace = '';

        let shippingHtml = $('#modal-table').find(".js-shipping-info").html()
        if(typeof requestQuoteData.shipping_method != "undefined")
        {
            for (let [key,shipping_info] of requestQuoteData.shipping_method.shipping_detail.entries())
            {
              //console.log("shipping_info",shipping_info);
              let shipping_address = shipping_info.shipping_address

              let replaceAddressHtml = '';
      	      replaceAddressHtml += shipping_address.name+"<br>";
      	      if(shipping_address.street2 != undefined && shipping_address.street2 !=''){
      	        replaceAddressHtml += shipping_address.street1;
      	        replaceAddressHtml += ","+shipping_address.street2+",<br>";
      	      }
      	      else{
      	        replaceAddressHtml += shipping_address.street1+",<br>";
      	      }
      	      replaceAddressHtml += shipping_address.city+",";
      	      replaceAddressHtml += shipping_address.state+"<br>";
      	      replaceAddressHtml += shipping_address.country;
      	      if(shipping_address.postalcode != undefined ){
      	        replaceAddressHtml += " - "+shipping_address.postalcode+"<br>";
      	      }
      	      replaceAddressHtml += "Email: "+shipping_address.email+"<br>";
      	      if(shipping_address.phone != undefined ){
      	        replaceAddressHtml += "T: "+shipping_address.phone;
      	      }
      	      if(shipping_address.mobile != undefined && shipping_address.mobile !=''){
      	        replaceAddressHtml += ",<br>M: "+shipping_address.mobile+"<br>";
      	      }

              shippingHtml1 = shippingHtml.replace("#data.address_book#",replaceAddressHtml)
              shippingHtml1 = shippingHtml1.replace(/#data.qty#/g,key+1)
              shippingHtml1 = shippingHtml1.replace(/#data.shippingCarrier#/g,shipping_info.shipping_detail.shipping_carrier)
              shippingHtml1 = shippingHtml1.replace("#data.shippingMethod#",shipping_info.shipping_detail.shipping_method)
              shippingHtml1 = shippingHtml1.replace("#data.onHandDate#",shipping_info.shipping_detail.on_hand_date)
              shippingHtml1 = shippingHtml1.replace(/#data.shippingCharge#/g,shipping_info.shipping_detail.shipping_charge);
              shippingHtmlReplace += shippingHtml1;

            }

        }
        //console.log("shippingHtmlReplace",shippingHtmlReplace);
        $('#modal-table').find(".js-shipping-info").html(shippingHtmlReplace)
        if(typeof requestQuoteData.shipping_method != "undefined")
        {
            for (let [key,shipping_info] of requestQuoteData.shipping_method.shipping_detail.entries())
            {
                //console.log("shipping_info",shipping_info.color_quantity);
                let key1 = key + 1
                let colorRawHtml = '';
                let colorSectionHtml = $('#modal-table').find(".js-color-info-"+key1).html()
                let colorArr = $.map( shipping_info.color_quantity, function( obj, i ) { return i; } );
                let colorsHexVal = await replaceColorSwatchWithHexaCodes(colorArr,"color");
                for (let color_quantity in shipping_info.color_quantity) {
                  colorSectionHtml1 = colorSectionHtml.replace(/#data.color#/g,color_quantity)
                  colorSectionHtml1 = colorSectionHtml1.replace("#data.totalQty#",shipping_info.color_quantity[color_quantity])
                  let element_color_style = "background-color:"+color_quantity+";"
                  if(colorsHexVal != null && colorsHexVal[color_quantity] != undefined){
                      if(typeof colorsHexVal[color_quantity].hexcode != 'undefined'){
                          element_color_style = "background-color:"+colorsHexVal[color_quantity].hexcode+";"
                      }
                      else if (typeof colorsHexVal[color_quantity].file != 'undefined') {
                          element_color_style = "background-image:url("+colorsHexVal[color_quantity].file.url+");"
                      }
                  }
                  colorSectionHtml1 = colorSectionHtml1.replace(/#data.colorSwatch#/g,element_color_style);
                  colorRawHtml += colorSectionHtml1;
                }
                $('#modal-table').find(".js-color-info-"+key1).html(colorRawHtml)

            }
        }

        let imprintHtml = $("#modal-table").find('.js-imprint-information').html()
        let imprintSectionHtml = ''
        if(typeof requestQuoteData.imprint != "undefined")
        {
          for (let [i,imprint_info] of requestQuoteData.imprint.entries())
          {
              imprintHtml1 = imprintHtml.replace("#data.imprintPostion#",imprint_info.imprint_position_name)
              imprintHtml1 = imprintHtml1.replace("#data.imprintMethod#",imprint_info.imprint_method_name)
              if(typeof imprint_info.no_of_color != 'undefined'){
                  imprintHtml1 = imprintHtml1.replace("#data.howmanyColors#",imprint_info.no_of_color)
              }else{
                  imprintHtml1 = imprintHtml1.replace("#data.howmanyColors#",'-')
              }
              let colorHtml = ''
              if(typeof imprint_info.selected_colors != "undefined")
              {
                //let imprintColorsHexVal = replaceColorSwatchWithHexaCodes(imprint_info.selected_colors,"imprintcolor");
                for(let selected_color in imprint_info.selected_colors)
                {
                  let colorCount = parseInt(selected_color)+1;
                  let imprintColorHexKey = imprint_info.selected_colors[selected_color]
                  // if(imprintColorsHexVal != null && imprintColorsHexVal[imprintColorHexKey] != undefined ){
                  //     if(typeof imprintColorsHexVal[imprintColorHexKey].hexcode != 'undefined'){
                  //         imprintColorHexKey = imprintColorsHexVal[imprintColorHexKey].hexcode
                  //     }
                  // }
                  // colorHtml += "<div>Color"+colorCount+": "+"<span style='background-color:"+imprintColorHexKey+";'>"+imprint_info.selected_colors[selected_color]+"</span></div>";
                  colorHtml += "<div>Color"+colorCount+": "+"<span>"+imprint_info.selected_colors[selected_color]+"</span></div>";
                }
              }
              imprintHtml1 = imprintHtml1.replace("#data.imprintColors#",colorHtml)

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
                    imprintHtml1 = imprintHtml1.replace("#data.sendmail#",checkSendEmail)

                    let thumbImg = '';
                    if(typeof imprint_info.artwork.artwork_thumb != "undefined"){
                        for (let [i,artwork_thumb] of imprint_info.artwork.artwork_thumb.entries()){
                            let j = i+1;
                            thumbImg += 'Uploaded Artwork '+j+': <img class="lazyLoad" alt="artwork" title="artwork" src="'+artwork_thumb+'" style="max-width:50px;max-height:50px;"><br><br>';
                        }
                    }

                    imprintHtml1 = imprintHtml1.replace("#data.artwork#",thumbImg)

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
                    imprintHtml1 = imprintHtml1.replace("#data.artwork_text#",artText)
                }else{
                  imprintHtml1 = imprintHtml1.replace("#data.sendmail#",'')
                  imprintHtml1 = imprintHtml1.replace("#data.artwork#",'')
                  imprintHtml1 = imprintHtml1.replace("#data.artwork_text#",'')
                }

              imprintSectionHtml += imprintHtml1;
          }

        }

        $("#modal-table").find('.js-imprint-information').html(imprintSectionHtml)
        await getAddedComments(infoId)
        timeAgo()
        hidePageAjaxLoading();
        $('#modal-table').modal('show');

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
    })
    .catch(function(error){
      hidePageAjaxLoading();
        console.log("error",error);
    })
}
function detailRequestInfo(thisObj){
  showPageAjaxLoading();
  let infoId = thisObj.data("id")
  $('#modal-table').addClass('model-popup-black');
  $('#modal-table').addClass('request-info-popup-modal');
  $("#modal-table").find(".modal-title").html('<i class="fa fa-question-circle"></i>View & Comment Request Info')
  $("#modal-table").find(".modal-dialog").addClass("modal-lg")

  axios({
      method: 'GET',
      url : project_settings.request_info_api_url+"/"+infoId,
  }).then(async response_data => {
      let requestInfoData = response_data.data
      let productInfo = requestInfoData.productInfo[0]
      let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+requestInfoData.productId;
      //console.log("requestInfoData",requestInfoData);
      let userInfo = await getUserDetailById(requestInfoData.userId)
      let userInfoHtml = ""
      userInfoHtml += "<h4>"+userInfo.fullname+"</h4>"

      // pending to fetch data from user after edit account
      //userInfoHtml += "<p></p>"

      let userContactInfoHtml = ""
      if(userInfo.phone != undefined && userInfo.phone != "") userContactInfoHtml += "<li><i class='fa fa-phone'></i>"+userInfo.phone+"</li>";
      if(userInfo.email != undefined && userInfo.email != "") userContactInfoHtml += "<li><i class='fa fa-envelope'></i>"+userInfo.email+"</li>";

      let colorsHexVal = await replaceColorSwatchWithHexaCodes(productInfo.attributes.colors,"color");
      let colorsHtml = ""
      if(productInfo.attributes.colors != undefined && productInfo.attributes.colors.length > 0) {
          for([key,val] of productInfo.attributes.colors.entries()){
            let element_color_style = "background-color:"+val+";"
            if(colorsHexVal != null && colorsHexVal[val] != undefined){
                if(typeof colorsHexVal[val].hexcode != 'undefined'){
                    element_color_style = "background-color:"+colorsHexVal[val].hexcode+";"
                }
                else if (typeof colorsHexVal[val].file != 'undefined') {
                    element_color_style = "background-image:url("+colorsHexVal[val].file.url+");"
                }
            }
            colorsHtml += "<li class='color2' title='"+val+"' data-original-title='"+val+"' style='"+element_color_style+"' data-placement='top' data-toggle='tooltip'></li>"
          }
      }

      let pricingHtml = ''

      if(productInfo.pricing != undefined){
            $.each(productInfo.pricing, function(index,element){
                  if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                      $.each(element.price_range,function(index,element2){
                            if(element2.qty.lte != undefined){
                                  pricingHtml += '<div><div class="table-heading">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                            }else
                            {
                                  pricingHtml += '<div><div class="table-heading">'+ element2.qty.gte + '+' + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                            }
                      })
                  }
            })
      }

      let requestInfoHtml = $(".js_request_info_modal").html();
      requestInfoHtml = requestInfoHtml.replace(/#data.createAt#/g,formatDate(requestInfoData.createAt,project_settings.format_date))
      requestInfoHtml = requestInfoHtml.replace(/#data.infoId#/g,requestInfoData.id)
      requestInfoHtml = requestInfoHtml.replace(/#data.module#/g,"request-info")
      let productImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
      if(productInfo.images != undefined){
          productImage = productInfo.images[0].images[0].secure_url
      }
      requestInfoHtml = requestInfoHtml.replace("#data.productImage#",productImage)
      requestInfoHtml = requestInfoHtml.replace("#data.productName#",productInfo.product_name)
      requestInfoHtml = requestInfoHtml.replace("#data.productDescription#",productInfo.description)
      requestInfoHtml = requestInfoHtml.replace("#data.sku#",productInfo.sku)
      requestInfoHtml = requestInfoHtml.replace("#data.product_link#",detailLink)

      requestInfoHtml = requestInfoHtml.replace("#data.colors#",colorsHtml)
      requestInfoHtml = requestInfoHtml.replace("#data.pricing#",pricingHtml)
      if(requestInfoData.instruction != undefined && requestInfoData.instruction != "") requestInfoHtml = requestInfoHtml.replace("#data.specialIntruction#",requestInfoData.instruction)


      requestInfoHtml = requestInfoHtml.replace("#data.userInfo#",userInfoHtml)
      requestInfoHtml = requestInfoHtml.replace("#data.userContactInfo#",userContactInfoHtml)

      $(".js_add_html").html(requestInfoHtml)
      await getAddedComments(infoId)
      timeAgo()
      hidePageAjaxLoading();

      $('#modal-table').modal('show');

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

  }).catch(function(error){
    hidePageAjaxLoading();
      console.log("error",error.response);
  })
}

async function getAddedComments(requestId)
{
    var msgCount = 0;
    await axios({
        method: 'GET',
        url : project_settings.comment_request_url+"?RequestId="+requestId,
        'headers': {"Authorization": userToken},
    }).then(response_data => {
        let getCommentHtml = $(".js_add_html").find(".js-request-comment-box li:first");
        getCommentHtml.addClass('hide')
        // $('.js-hide-div').removeClass("js-hide-div");
        $(".js_add_html").find(".js-request-comment-box li").slice(1).remove()
        if(response_data.data.total>0)
        {
            if($(".js_add_html").html() != "")
            {
                let replaceCommentHtml = '';
                for(let [key,comment_data] of response_data.data.data[0].message.entries()) {
                    let commentHtml = getCommentHtml.html();
                    commentHtml = commentHtml.replace("#data.createdBy#",comment_data.created_by);
                    // commentHtml = commentHtml.replace("#data.createdAt#",formatDate(comment_data.created_at,project_settings.format_date));

                    commentHtml = commentHtml.replace("#data.createdAt#",'<time class="timeago" datetime="'+comment_data.created_at+'">'+comment_data.created_at+'</time>');

                    commentHtml = commentHtml.replace("#data.message#",comment_data.message);
                    replaceCommentHtml += "<li>"+commentHtml+"</li>";
                }
                $(".js_add_html").find(".js-request-comment-box li:first").after(replaceCommentHtml)
                $(".js_add_html").find("#js-comment_requestinfo").val('')
                msgCount = response_data.data.data[0].message.length;
                return msgCount
            }
            else{
                msgCount = response_data.data.data[0].message.length;
                return msgCount
            }
        }
    })
    .catch(function (error){

    })
    return msgCount
}
