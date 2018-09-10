// let data = [];
// let questions = {};

// questions['name'] = 'neel';
// data.push(questions);

// questions = {};
// questions['name'] = '123';
// data.push(questions)

// localStorage.setItem('questions',JSON.stringify(data));

/*
questions = JSON.parse(localStorage.getItem('questions'));
questions.splice(index, 1);
localStorage.setItem('questions',JSON.stringify(questions));
*/


$(document).on('click','.js_submit_address',function (e) 
{
  $("#modal-table").find('form#address_book').validate({
    rules: {
      "name":"required",
      "email":{
        required:true,
        email: true
      },
      "street1":"required",
      "country":"required",
      "state":"required",
      "city":"required",
      "postalcode":"required",
      "phone":{
          required:true
      }
    },
    messages: {
      "name":"Please enter name.",
      "email":{
        required:"Please enter email",
        email: "Please enter valid email."
      },
      "street1":"Please enter address 1",
      "country":"Please select country",
      "state":"Please select state",
      "city":"Please select city",
      "postalcode":"Please enter postal code",
      "phone":{
        required:"Please enter phone"
      }
    },
    errorElement: "li",
    errorPlacement: function(error, element) {
      error.appendTo(element.closest("div"));
      $(element).closest('div').find('ul').addClass('red')
    },
    errorLabelContainer: "#errors",
    wrapper: "ul",
    submitHandler: function(form) {
        showPageAjaxLoading();
        let formObj = $(form);
        let form_data = formObj.serializeArray();
        // console.log('formData',form_data);

        var emailToFriendData = [];
        var emailToFriend = {};

        for (var input in form_data){
          var name = form_data[input]['value'];
          emailToFriend[form_data[input]['name']] = name;
        }
        
        if(localStorage.getItem("requestQuoteAddress") == null || localStorage.getItem("requestQuoteAddress") == "")
        {
          emailToFriendData.push(emailToFriend);
          localStorage.setItem("requestQuoteAddress" , JSON.stringify(emailToFriendData));

          let addressAdded = JSON.parse(localStorage.getItem("requestQuoteAddress"))
          setGuestAddress(emailToFriend, shippigCounter);
        }
        else{
          emailToFriendData.push(emailToFriend);
          // localStorage.setItem("requestQuoteAddress" , emailToFriendData);
          // alert(shippigCounter);

          let addedAddressCount = JSON.parse(localStorage.getItem('requestQuoteAddress'));
          let currentAddressCounter1 = localStorage.getItem('guestAddressCurrnetCounter');

          if(currentAddressCounter1 != 1)
          {
            $(activetab + ' #js_shipping_method_detail_'+currentAddressCounter1).find(".js-add_address_guest").remove();
          }
          
          
          if(currentAddressCounter1 == 1)
          {
            // alert('shippigCounter',shippigCounter)
            questions = JSON.parse(localStorage.getItem('requestQuoteAddress'));
            questions.splice(0, 1,emailToFriend);
            localStorage.setItem('requestQuoteAddress',JSON.stringify(questions));
            setGuestAddress(emailToFriend, 1);
          }
          else{
            // alert('shippigCounter1',shippigCounter);
            questions = JSON.parse(localStorage.getItem('requestQuoteAddress'));
            questions.splice(parseInt(shippigCounter)-1, 0,emailToFriend);
            localStorage.setItem('requestQuoteAddress',JSON.stringify(questions));
            setGuestAddress(emailToFriend, shippigCounter);
          }

          // let addressAdded = JSON.parse(localStorage.getItem("requestQuoteAddress"))
          

        }
        // emailToFriendData.push(JSON.stringify(emailToFriend));

        // localStorage.setItem("requestQuoteAddress" , JSON.stringify(emailToFriend))

        // let addressAdded = JSON.parse(localStorage.getItem("requestQuoteAddress"))
        // setGuestAddress(addressAdded, shippigCounter);

        // let htmll = '<div class="row"><div class=""><div class="shipping-col act"><div class=""><div class="account-address-block"><div class="address-inner-block"><div class="address-title-block"><h4>'+addressAdded.name+'</h4></div><div class="address-info-block"><div class="scrollbar" id="style-1"><p>'+addressAdded.street1+',<br>'+addressAdded.street2+',<br>'+addressAdded.city+','+addressAdded.state+','+addressAdded.postalcode+'<br>'+addressAdded.country+'</p></div></div><div class="address-contact-info-block"><ul><li><i class="fa fa-phone"></i>'+addressAdded.phone+'</li><li><a href="#"><i class="fa fa-envelope"></i>'+addressAdded.email+'</a></li><li><i class="fa fa-print"></i>'+addressAdded.mobile+'</li></ul></div></div></div></div></div></div></div>';

        // $(".js_shipping_addresses").html(htmll);
        // $(".js_shipping_addresses").removeClass('hide');
        hidePageAjaxLoading();
        return false;
        // formObj.serialize() - addd in localstorage
    },
  });
});

// need [shippigCounter, get_product_details, activetab ]
async function setGuestAddress(returnData,shippigCounter,carrierData = null)
{ 
            // console.log('returnData',returnData)
            let city = await getCountryStateCityById(returnData.city,3);
            let state = await getCountryStateCityById(returnData.state,2);
            let country = await getCountryStateCityById(returnData.country,1);
            let shipping_details='';
            if (typeof get_product_details.shipping == 'undefined') {
              console.log('No Shipping FOUND')
            }
            else{
              shipping_details = get_product_details.shipping[0];
              if(shipping_details.fob_city == '' || shipping_details.fob_state_code == '' || shipping_details.fob_zip_code == '' || shipping_details.fob_country_code == ''){
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_option").html('')
              }

              // let getLocation = await getStreetLocation(shipping_details.fob_zip_code)
              // let getStreet = await getStreetData(getLocation)
              // var addressFrom  = {
              //     "name": shipping_details.fob_city,
              //     "street1": getStreet,
              //     "city": shipping_details.fob_city,
              //     "state": shipping_details.fob_state_code,
              //     "zip": shipping_details.fob_zip_code,
              //     "country": shipping_details.fob_country_code,
              // };

              // var addressTo  = {
              //     "name": returnData.name,
              //     "street1": returnData.street1,
              //     "city": city,
              //     "state": state,
              //     "zip": returnData.postalcode,
              //     "country": country,
              // };
              // console.log('addressFrom ::', addressFrom);
              // let sCode = await getStateCode(returnData.state, 2)
              // if (sCode != null) {
              //   let verify_address_to = await verifyAddress(addressTo, sCode)
              //   let verify_address_from = await verifyAddress(addressFrom, sCode)
              //   console.log('verify_address ::', verify_address_to, verify_address_from)
              //   if(!verify_address_to){
              //       hidePageAjaxLoading()
              //       showErrorMessage("Please add correct shipping address.")
              //       return false;
              //   }
              //   // showSuccessMessage()
                
              // } else {
              //   console.log('STATE CODE NOT FOUND')
              // }
            }

            let replaceAddressHtml = '';
            replaceAddressHtml += returnData.name+"<br>";
            replaceAddressHtml += returnData.email+"<br>";
            replaceAddressHtml += returnData.street1+"<br>,";
            if(returnData.street2 != undefined){
              replaceAddressHtml += returnData.street2+"<br>";
            }
            
            replaceAddressHtml += city+",";
            replaceAddressHtml += state+",";
            changeShippingDetails(shippigCounter);               
            replaceAddressHtml += country;

            if(typeof returnData.postalcode != "undefined" && returnData.postalcode != ''){
              replaceAddressHtml += "-"+returnData.postalcode+"<br>";
            }
            if(typeof returnData.phone != "undefined" && returnData.phone != ''){
              replaceAddressHtml += "T: "+returnData.phone+",<br>";
            }
            if(typeof returnData.mobile != "undefined" && returnData.mobile!= ''){
              replaceAddressHtml += "M: "+returnData.mobile+"<br>";
            }
            replaceAddressHtml += '<input class="shippingAddressId" name="shippingAddressId" value="'+returnData.id+'" type="hidden">';
            addressBookHtml = addressBookHtmlTemplate;

            if(addressBookHtml.indexOf("#data.address#")!= -1){
                addressBookHtml = addressBookHtml.replace(/#data.address#/g,replaceAddressHtml);
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(addressBookHtml);
            }else{
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(replaceAddressHtml);
            }
            
            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses").removeClass("hide");

            let shipping_type = $(activetab).find('input[name=request_quote_shipping_type]:checked').val();
            if(shipping_type == 'standard') {
                $('.js_shipp_address_details').find('counter').html('');
            }
            
            $('#Quantity-quote, .js_shipp_address_data').removeClass('hide');

              $(document).off('click', '#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li').on('click','#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li', function (e) {
                  // if(e.handled !== true)
                  {
                      showPageAjaxLoading()
                      var thisObj = $(this);

                      let attr = $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-value');

                      if (typeof attr !== typeof undefined && attr !== false) {
                          $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-value','')
                          $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-service','')
                      }

                      //summary for shipping carrier
                      let address_carrier = $(this).find('a').text();
                      $('.js_address_carrier_'+shippigCounter).find('span').html(address_carrier);
                      $('#Quantity-quote, .js_address_carrier_'+shippigCounter).removeClass('hide');

                      getShippingRate('#js_shipping_method_detail_'+shippigCounter,thisObj,addressFrom,addressTo,shipping_details,shippigCounter);
                  }
              });
              $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_option").removeClass("hide");
          // END -Change

            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses").removeClass("hide");
            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").datepicker({
                changeMonth: true,
                changeYear: true,
                format: 'mm/dd/yyyy',
                minDate: new Date(),
                onSelect: function(dateText, inst) {
                    let date = $(this).val();
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").val(date);
                    
                    //summary for address inhand date
                    $('.js_inhand_date_'+shippigCounter).find('span').html(date);
                    $('#Quantity-quote, .js_inhand_date_'+shippigCounter).removeClass('hide');
                }
            });
            $('#modal-table').modal('toggle');
        hidePageAjaxLoading();
}

$(document).on("click",activetab+" .js-add_address_guest",function(){
  let currentAddressCounter1 = $(this).closest('.js_shipping_method_detail').attr('data-shipping-counter');
  localStorage.setItem('guestAddressCurrnetCounter',currentAddressCounter1);
  $('#modal-table').attr('class','modal fade model-popup-black');
  $("#modal-table").find(".modal-title").html('Add Address');
  $("#modal-table").find(".modal-dialog").addClass("play-video"); 
  let guestUserHtml = $(".js-guest_user_address_block").html();
  // let replaceHtml = guestUserHtml.replace("#data.video_url#",productDetails.video_url);
  // console.log('replaceHtml',guestUserHtml)

  $(".js_add_html").html(guestUserHtml)
  $('#modal-table').modal('show');
})

$(function() {
  	$(".custom-select").each(function () {
  	    $(this).wrap("<span class='checkout-select-wrapper'></span>");
        $(this).after("<span class='checkout-holder'></span>");
  	});

  	$(document).on('change','.custom-select', function() {
  		var selectedOption = $(this).find(":selected").text();
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
  	});
  	$('.custom-select').trigger('change');
  	$(document).on('click','.custom-select option', function() {
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
  	});

    /* for Address type end */

    getCountryData()

    /*  On change Country get state and city data from database */
    if( $('.js-country') &&  $('.js-state')){
      $(document).on('change', '.js-country', async function(e) {
      // $(".js-country").on("change",async function(){
          let form = $(this).closest('form');
          let countryVal = form.find('.js-country').val();
          form.find('.js-state').val('');

          form.find('.js-state').before('<div class="loadinggif"></div>');

          let response = await getStateAndCityVal(countryVal,"","country_code")
          first = form.find('.js-state option:first');
          form.find('.js-state').html("");
          let options = form.find('.js-state');
          options.append(first);

          $.each(response.data,function(key,state){
             options.append(new Option(state.state_name,state.id));
          })
          form.find('.js-state').change();
          form.find('.js-state').find("option").first().click();
          form.find('.js-state').prev('.loadinggif').remove();

      })

      $(document).on('change', '.js-state', async function(e) {
      // $(".js-state").on("change",async function(){
          let form = $(this).closest('form');
          let countryVal = form.find('.js-country').val();
          let stateVal = form.find('.js-state').val();
          form.find('.js-city').val('');

          form.find('.js-city').before('<div class="loadinggif"></div>');

          let response = await getStateAndCityVal(countryVal,stateVal,"state_code")

          first = form.find('.js-city option:first');
          form.find('.js-city').html("");
          let options = form.find('.js-city');
          options.append(first);
          $.each(response.data,function(key,city){
             options.append(new Option(city.city_name,city.id));
          })
          form.find('.js-city').find("option").first().click();
          form.find('.js-city').prev('.loadinggif').remove();
      })
    }
});

/*  Get country Data from project_settings */
function getCountryData(countryId=0){
  if( $(".js-country").length > 0 ){
      let countryHtml = $(".js-country").html();
      let countryList = [];
      //short_name
      $.each(project_settings.country_data,function(key,country){
        countryList.push(country.short_name);
      })
      axios({
          method: 'GET',
          url: project_settings.city_country_state_api,
          params: {
              'country_data':countryList,
              'data_from' : 'country_code',
              'type' : 1
          }
        })
      .then(response => {
          if(response.data.length > 0){
            $.each(response.data,function(key,country){
              countryHtml += '<option value="'+country.id+'">'+country.country_name+'</option>'
            })
            $('.js-country').html(countryHtml)
            doSelection('country',countryId);
          }
      })
      .catch(error => {
        // console.log('Error fetching and parsing data', error);
      });
  }

}

/* Edit State and city auto generate dropdown */
async function getStateAndCityData(form,countryVal,stateVal,cityVal,dataFrom,className){
    form.find('.'+className).before('<div class="loadinggif"></div>');
    let response = await getStateAndCityVal(countryVal,stateVal,dataFrom)
    first = form.find('.'+className+' option:first');
    form.find('.'+className).html("");
    let options = form.find('.'+className);
    options.append(first);

    if(dataFrom == "country_code"){
      $.each(response.data,function(key,state){
         options.append(new Option(state.state_name,state.id));
      })
      doSelection('state',stateVal)
      form.find('.'+className).prev('.loadinggif').remove();
    }else if (dataFrom == "state_code") {
      $.each(response.data,function(key,city){
         options.append(new Option(city.city_name,city.id));
      })
      doSelection('city',cityVal)
      form.find('.'+className).prev('.loadinggif').remove();
    }
}

function doSelection(element,value)
{
  if(value > 0)
  {
    $('option:selected', 'select[name="'+element,+'"]').removeAttr('selected');
    $('select[name="'+element+'"]').find('option[value="'+value+'"]').attr("selected",true);
    let selectedtext = $('select[name="'+element+'"] option:selected').text()
    $('select[name*="'+element+'"]').parent('span').find(".checkout-holder").text(selectedtext)
  }
}

$(document).on('click','.js-submit-personalinfo',function (e) 
// $('.js-submit-personalinfo').on('click',function() 
{
  $("#modal-table").find('form#js_add_huest_personal_info').validate({
    rules: {
      "personalinfo_fullname":"required",
      "personalinfo_email":{
        required:true,
        email: true
      },
      "personalinfo_phone":"required",
      "personalinfo_company_name":"required",
      "personalinfo_zipcode":"required"
    },
    messages: {
      "personalinfo_fullname":"Please enter name.",
      "personalinfo_email":{
        required:"Please enter email",
        email: "Please enter valid email."
      },
      "personalinfo_phone":"Please enter phone number.",
      "personalinfo_company_name":"Please enter company name.",
      "personalinfo_zipcode":"Please enter Postal code.",
    },
    errorElement: "li",
    errorPlacement: function(error, element) {
      error.appendTo(element.closest("div"));
      $(element).closest('div').find('ul').addClass('red')
    },
    errorLabelContainer: "#errors",
    wrapper: "ul",
    submitHandler: function(form) {
        let formObj = $(form);
        let form_data = formObj.serializeArray();
        // console.log('formData',form_data);

        let personalInfo = {};

        for (let input in form_data){
          let name = form_data[input]['value'];
          personalInfo[form_data[input]['name']] = name;
        }
        
        localStorage.setItem("guestPersonalInfo" , JSON.stringify(personalInfo));
        $('.request-quote-submit').click();
        return false;
    },
  });
});
