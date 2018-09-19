if (user_id == null ) {
  window.location = 'login.html';
}


let user_unique_id = 0;
/* for listing User data */

$.ajax({
    type: 'GET',
    async: false,
    url: project_settings.user_account_api_url+"?websiteId="+website_settings['projectID']+"&userEmail="+user_details.email,
    success: function(response){
        if( response.data.length > 0){
            let userDetail = response.data[0];
            user_unique_id = userDetail.id;
            let formObj = $('form#myAccountEdit');

            $.each(userDetail,function(element,value){
                $(formObj.find('input[type="text"][name*="'+element+'"]')).val(value);
            });

            getCountryData(userDetail.country)
            if(userDetail.country,userDetail.state != '' && userDetail.country,userDetail.state != undefined){
              getStateAndCityData(formObj,userDetail.country,userDetail.state,"",'country_code','js-state')
              getStateAndCityData(formObj,userDetail.country,userDetail.state,userDetail.city,'state_code','js-city')
            }
        }
        else {
            getCountryData();
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
    }
});

$(function() {
    // Add User data
    let projectID;
    let baseURL;
    setTimeout(() => {
      $.getJSON("./assets/project-details.json", function(data) {
            projectID = data[0].projectID;
            baseURL = data[0].builder_service_api;
        })
    },1000)
    $('form#myAccountEdit').validate({
      rules: {
      "userEmail": "required",
      "password": "required",
      "confirmPassword": "required",
      "securityQuestion": "required",
      "securityAnswer": "required",
          "firstName":"required",
          "lastName": "required",
          "address1": "required",
          "country": "required",
          "state": "required",
          "city": "required",
          "zipCode": "required",
          "phone": {
            required: true
          },
          "email": "required",
      },
      messages: {
      "userEmail": "Enter Valid Email ID!",
      "password": "Enter Valid Password!",
      "confirmPassword": "Enter Valid Confirm Password!",
      "securityQuestion": "Enter Valid Question!",
      "securityAnswer": "Enter Valid Security Answer!",
        "firstName": "Enter Valid First Name!",
        "lastName": "Enter Valid Last Name!",
        "address1": "Enter Valid Address 1!",
        "country": "Enter Valid Country!",
        "state": "Enter Valid State/Province!",
        "city": "Enter Valid City!",
        "zipCode": "Enter Valid Zip Code!",
        "phone": {
          required: "Enter phone number!"
        },
      "email": "Enter Valid Email ID!",
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
          let formData = $(form).serializeArray();
          let editAccJSON = {};
          for (let input of formData) {
            if (input.name != 'confirmPassword') {
              editAccJSON[input.name] = input.value;
            }
          }
          // signUpJSON['isActive'] = true;
          // signUpJSON['isDeleted'] = false;
          // signUpJSON['websiteId'] = projectID;
          // signUpJSON['userRole'] = 'registered';

          // return false;
          // let fullname = $('.firstName').val().trim() + ' ' + $('.lastName').val().trim();
          // let email = $('.userEmail').val().trim();
          // let password = $('.password').val().trim();
          // var userDetails = {"password":password ,"email":email ,"fullname":fullname};
          // console.log('setup url', project_settings.api_url+"setup")
          // console.log('JSON.stringify(userDetails)',JSON.stringify(userDetails));
          // console.log("baseURL + '/website-users'", baseURL + '/website-users');
          // console.log('signUp data',signUpJSON);
          axios({
            method: 'patch',
            url: baseURL + '/website-users/'+user_unique_id,
            data: editAccJSON
          })
          .then(function(res) {
            hidePageAjaxLoading();
             // window.location = "myaccount.html";
            // console.log('sucessfully entered in website user')
          })
          .catch(function(err) {
            hidePageAjaxLoading();
          })
        },
    });

    /* End Add User data */


  	// $(".custom-select").each(function () {
  	//     $(this).wrap("<span class='checkout-select-wrapper'></span>");
    //     $(this).after("<span class='checkout-holder'></span>");
  	// });

  	$(document).on('change','.custom-select', function() {
  		var selectedOption = $(this).find(":selected").text();
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
  	});
    $('.custom-select').trigger('change');

  	$(document).on('click','.custom-select option', function() {
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
  	});




    /*  On change Country get state and city data from database */
    if( $('.js-country') &&  $('.js-state')){
      $(".js-country").on("change",async function(){
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

      $(".js-state").on("change",async function(){
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
      //console.log("countryList",countryList);
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
    // form.find('.'+className).before('<div class="loadinggif"></div>');
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
      // form.find('.'+className).prev('.loadinggif').remove();
    }else if (dataFrom == "state_code") {
      $.each(response.data,function(key,city){
         options.append(new Option(city.city_name,city.id));
      })
      doSelection('city',cityVal)
      // form.find('.'+className).prev('.loadinggif').remove();
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
