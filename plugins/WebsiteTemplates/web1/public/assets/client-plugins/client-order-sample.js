if(user_id == null) {
	window.location = "login.html";
}
var pid = getParameterByName('pid');
getCountryData();
showCaptcha();
$(document).on('click','.js-order_sample',function (e)
{
  $('form#form1').validate({
    rules: {
      "prod":"required",
	  "prod_name":"required",
      "asi_num":"required",
      "fedex":"required",
      "company_name":"required",
      "contact_name":"required",
      "address":"required",
      "country":"required",
      "state":"required",
      "city":"required",
      "zip":"required",
      "phone":"required",
      "CaptchaInput":"required",
      "email":{
        required:true,
        email: true
      },
    },
    messages: {
		"prod":"Please enter product id.",
		"prod_name":"Please enter product name.",
		"asi_num":"Please enter ASI number.",
		"fedex":"Please enter fedex/ups account number.",
		"company_name":"Please enter company name.",
		"contact_name":"Please enter contact name.",
		"address":"Please enter address.",
		"country":"Please select country.",
		"state":"Please select state.",
		"city":"Please select city.",
		"zip":"Please enter zip code",
		"phone":"Please enter phone number",
		"CaptchaInput":"Please enter verification code.",
	  	"email":{
			required:"Please enter email",
			email: "Please enter valid email."
      	}
    },
    errorElement: "li",
    errorPlacement: function(error, element) {
			if($(element).closest('div').find('ul').length <=0 ){
				error.appendTo(element.closest("div"));
			}
      $(element).closest('div').find('ul').addClass('red')
    },
    errorLabelContainer: "#errors",
    wrapper: "ul",
    submitHandler: function(form) {
        let formObj = $(form);
		var productJsonData1 = {};
		var form_data = formObj.serializeArray();
		var orderSample = {};

		var why = "";
                        
		if($('#CaptchaInput').val() == ""){
			why += "- Please Enter CAPTCHA Code.\n";
		}
		if($('#CaptchaInput').val() != ""){
			if(ValidCaptcha($('#CaptchaInput').val()) == false){
				why += "The CAPTCHA Code Does Not Match.\n";
			}
		}

		if(why != ""){
			// alert(why);
			$("input[name='CaptchaInput']").closest("div").append('<ul class="red" style=""><li id="CaptchaInput-error" class="error" style="">'+why+'</li></ul>')
			return false;
		}

		let countryVal = $("#addresstbook_country").val();
		let countryName = $("#addresstbook_country option[value='"+countryVal+"']").text();

		let stateVal = $("#addresstbook_state").val();
		let stateName = $("#addresstbook_state option[value='"+stateVal+"']").text();

		let cityVal = $("#addresstbook_city").val();
		let cityName = $("#addresstbook_city option[value='"+cityVal+"']").text();

		for (var input in form_data){
		  var name = form_data[input]['value'];
		  orderSample[form_data[input]['name']] = name;
		}
		
		orderSample['countryName'] = countryName;
		orderSample['stateName'] = stateName;
		orderSample['cityName'] = cityName;
		
		orderSample['slug'] = 'order-sample';

		productJsonData1['form_data'] = orderSample;
		productJsonData1['website_id'] = website_settings['projectID'];

		// console.log('productJsonData1',productJsonData1);
		
		$.ajax({
		  type : 'POST',
		  url : project_settings.request_quote_api_url,
		  data : productJsonData1,
		  cache: false,
		  dataType : 'json',
		  success : function(response_data) {
			// console.log("response_data",response_data)
			if(response_data!= "") {
			//   $("#send_quick_quoteemail").find("input,textarea").val('');
				hidePageAjaxLoading()
				showSuccessMessage("Email Sent Successfully.");
				window.location = "orderSampleSuccess.html";
				return false;
			}
			else if(response_data.status == 400) {
				hidePageAjaxLoading()
				// showErrorMessage(response_data.message);
				return false;
			}
		  }
		});
    },
  }).form()
});

let setProductDetail = async function(){
	let product_data = await getProductDetailById(pid);
	//console.log('product_data',product_data);
	$("#prod").val(pid);
	$("#prod_name").val(product_data.product_name);
}();

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

function showCaptcha(){
	// Captcha Script
	
	var a = Math.ceil(Math.random() * 9)+ '';
	var b = Math.ceil(Math.random() * 9)+ '';
	var c = Math.ceil(Math.random() * 9)+ '';
	var d = Math.ceil(Math.random() * 9)+ '';
	var e = Math.ceil(Math.random() * 9)+ '';
	
	var code = a + b + c + d + e;
	document.getElementById("txtCaptcha").value = code;
	document.getElementById("CaptchaDiv").innerHTML = code;
}
// Validate input against the generated number
function ValidCaptcha(){
	var str1 = removeSpaces(document.getElementById('txtCaptcha').value);
	var str2 = removeSpaces(document.getElementById('CaptchaInput').value);
	if (str1 == str2){
	return true;
	}else{
	return false;
	}
	}
	
	// Remove the spaces from the entered and generated code
	function removeSpaces(string){
	return string.split(' ').join('');
	}

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
