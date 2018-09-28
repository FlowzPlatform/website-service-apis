if(user_id != null) {
	window.location = "index.html";
}

$(function() {
	getCountryData()
});

$('.signupPosh-click').on('click',function() {
	let projectID;
	let baseURL;
	let websiteURL;
	setTimeout(() => {
		$.getJSON("./assets/project-details.json", function(data) {
	        projectID = data[0].projectID;
	        baseURL = data[0].builder_service_api;
					websiteURL = data[0].BaseURL;
	    })
	},1000)
	$('form#signUp').validate({
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
  				required: "Enter Phone Number!"
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
        	let signUpJSON = {};
        	for (let input of formData) {
        		if (input.name != 'confirmPassword') {
	        		signUpJSON[input.name] = input.value;
        		}
        	}
        	signUpJSON['isActive'] = true;
        	signUpJSON['isDeleted'] = false;
        	signUpJSON['websiteId'] = projectID;
        	signUpJSON['userRole'] = 'registered';

					// return false;
        	let fullname = $('.firstName').val().trim() + ' ' + $('.lastName').val().trim();
        	let email = $('.userEmail').val().trim();
        	let password = $('.password').val().trim();
			let redirectUrl = websiteURL + 'index.html'
        	var userDetails = {"password":password ,"email":email ,"fullname":fullname,"redirect_url": redirectUrl};
        	// console.log('setup url', project_settings.api_url+"setup")
        	// console.log('JSON.stringify(userDetails)',JSON.stringify(userDetails));
        	// console.log("baseURL + '/website-users'", baseURL + '/website-users');
        	// console.log('signUp data',signUpJSON);

        	$.ajax({
				type: 'POST',
				url: project_settings.api_url+"setup",
				async: true,
				data:  JSON.stringify(userDetails),
				dataType: 'json',
				headers: { 'Content-Type': 'application/json' },
				success: function (result) {
					showSuccessMessage("Thank you for the registration. Please check e-mail for verification!");
					$.ajax({
						'async': false,
						'type': "GET",
						'url': baseURL + '/website-users?websiteId='+projectID+'&userEmail='+email,
						'success': function (res) {
							if (res.data.length > 0) {
			                    //   console.log("User already exist")
			                } else {
			                    //   console.log("New User");
		                      	axios({
									method: 'post',
									url: baseURL + '/website-users',
									data: signUpJSON
								})
								.then(function(res) {
									hidePageAjaxLoading();
									// console.log('sucessfully entered in website user')
								})
	            			}
						}
					});
					// window.location = "login.html";
				},
				error: function(err) {
					hidePageAjaxLoading();
					showErrorMessage(err.responseText)
				}
			});
        },
    });
})

// $('.signUp-cancel').on('click',function() {
// 	$('form#signUp')[0].reset();
// })

$('.socialMedCls').on('click',function(){
	var action_url = $(this).attr('title');
	$('#form-social-icons').attr('action', project_settings.social_auth_api+action_url);
	$( "#form-social-icons" ).submit();
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

if( $('.js-country') &&  $('.js-state')){
	$(".js-country").on("change",async function(){
		let form = $(this).closest('form');
		let countryVal = form.find('.js-country').val();
		if (countryVal != '') {
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
		}

	})

	$(".js-state").on("change",async function(){
		let form = $(this).closest('form');
		let countryVal = form.find('.js-country').val();
		let stateVal = form.find('.js-state').val();
		if (countryVal != '') {
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
		}
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
