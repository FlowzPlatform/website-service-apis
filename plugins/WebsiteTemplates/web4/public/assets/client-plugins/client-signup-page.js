if(user_id != null) {
	window.location = "index.html";
}

$('.user-signup').on('click',function() {
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

$('.socialMedCls').on('click',function(){
	var action_url = $(this).attr('title');
	$('#form-social-icons').attr('action', project_settings.social_auth_api+action_url);
	$( "#form-social-icons" ).submit();
});
