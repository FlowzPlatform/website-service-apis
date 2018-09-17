if(user_id != null) {
	window.location = "index.html";
}

$('.user-signup').on('click',function() {
	let projectID;
	let baseURL;
	setTimeout(() => {
		$.getJSON("./assets/project-details.json", function(data) {
	        projectID = data[0].projectID;
	        baseURL = data[0].builder_service_api;
	    })
	},1000)

	var fullname = $('.fullname').val().trim();
	var useremail = $('.useremail').val().trim();
	var userpass  = $('.userpass').val().trim();
	var userpass2  = $('.userpass2').val().trim();

	if(fullname=='') {
		$('.error-message').removeClass('hide');
		$('.error-message .red').text('Please enter Full Name');
	}
	else if(!validateEmail(useremail)) {
		$('.error-message').removeClass('hide');
		$('.error-message .red').text('Please enter valid Email');
	}
	else if((userpass != userpass2) || userpass=='') {
		$('.error-message').removeClass('hide');
		$('.error-message .red').text('Password and Confirm Password does not match');
	}
	else {
		if(!$( ".error-message" ).hasClass( "hide" )) {
			$('.error-message').addClass('hide');
		}
		let signUpJSON = {};
		signUpJSON['isActive'] = true;
  	signUpJSON['isDeleted'] = false;
  	signUpJSON['websiteId'] = projectID;
  	signUpJSON['userRole'] = 'registered';
		signUpJSON['userEmail'] = useremail;
		signUpJSON['userName'] = fullname;

		var userDetails = {"password":userpass ,"email":useremail ,"fullname":fullname};
		$.ajax({
			type: 'POST',
			url: project_settings.api_url+"setup",
			async: true,
			data:  JSON.stringify(userDetails),
			dataType: 'json',
			headers: { 'Content-Type': 'application/json' },
			success: function (result) {
				showSuccessMessage(result.message);
				$.ajax({
						'async': false,
						'type': "GET",
						'url': baseURL + '/website-users?websiteId='+projectID+'&userEmail='+useremail,
						'success': function (res) {
								if (res.data.length == 0) {
		                axios({
										  method: 'post',
										  url: baseURL + '/website-users',
										  data: signUpJSON
										})
										.then(function(res) {
											console.log('created new entry')
										})
								}
						}
				});
				window.location = "login.html";
			},
			error: function(err) {
				if(err.responseText != '') {
					$('.error-message').find('.red').html(err.responseText);
				}
				$('.error-message').removeClass('hide');
			}
		});
	}
});

$('.signupPosh-click').on('click',function() {
	let projectID;
	let baseURL;
	setTimeout(() => {
		$.getJSON("./assets/project-details.json", function(data) {
	        projectID = data[0].projectID;
	        baseURL = data[0].builder_service_api;
	    })
	},1000)
	$('form#signUp').validate({
  		rules: {
				"userEmail": "required",
				"password": "required",
				"confirmPassword": "required",
				// "securityQuestion": "required",
				"securityAnswer": "required",
      	"firstName":"required",
      	"lastName": "required",
      	"email": "required",
      	"address1": "required",
      	"address2": "required",
      	"city": "required",
      	"state": "required",
      	"country": "required",
  		},
  		messages: {
				"userEmail": "Enter Valid Email ID!",
				"password": "Enter Valid Password!",
				"confirmPassword": "Enter Valid Confirm Password!",
				// "securityQuestion": "Enter Valid Question!",
				"securityAnswer": "Enter Valid Security Answer!",
  			"firstName": "Enter Valid First Name!",
  			"lastName": "Enter Valid Last Name!",
				"email": "Enter Valid Email ID!",
  			"address1": "Enter Valid Address 1!",
  			"address2": "Enter Valid Address 2!",
  			"city": "Enter Valid City!",
  			"state": "Enter Valid State/Province!",
  			"country": "Enter Valid Country!"
  		},
        errorElement: "li",
        errorPlacement: function(error, element) {
          error.appendTo(element.closest("div"));
          $(element).closest('div').find('ul').addClass('red')
        },
        errorLabelContainer: "#errors",
        wrapper: "ul",
        submitHandler: function(form) {
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
        	var userDetails = {"password":password ,"email":email ,"fullname":fullname};
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
							showSuccessMessage(result.message);
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
												// console.log('sucessfully entered in website user')
											})
		              }
								}
							});
							// window.location = "login.html";
						},
						error: function(err) {
							showErrorMessage(err.responseText)
						}
					});
        },
    });
})

$('.socialMedCls').on('click',function(){
	var action_url = $(this).attr('title');
	$('#form-social-icons').attr('action', project_settings.social_auth_api+action_url);
	$( "#form-social-icons" ).submit();
});
