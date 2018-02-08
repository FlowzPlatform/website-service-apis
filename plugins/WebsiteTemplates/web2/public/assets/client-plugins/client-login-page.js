if(getCookie('loginTokenKey') != null) {
	window.location = "index.html";
}

$(document).ready(function() {
	$("#success_url").val(project_settings.base_url+"public/socialDashboard.html");
});

$('.login-submit').on('click',function(){
	var user_email = $('.user_email').val();
	var user_pass  = $('.user_pass').val();

	var userDetails = {"password":user_pass ,"email":user_email};
	$.ajax({
		type: 'POST',
		url: project_settings.login_api,
		async: true,
		data:  JSON.stringify(userDetails),
		dataType: 'json',
		headers: { 'Content-Type': 'application/json' },
		success: function (result) {
			if(!$( ".error-message" ).hasClass( "hide" )) {
				$('.error-message').addClass('hide');
			}
			if(!$( ".login-show" ).hasClass( "hide" )) {
				$(".login-show").addClass('hide');
			}
			$(".logout-show").removeClass('hide');
			$('.username-text').text('welcome');

			document.cookie = "loginTokenKey=" + result.logintoken;
			window.location = "index.html";
		},
		error: function(err) {
			$('.error-message').removeClass('hide');
		}
	});
});

$('.socialMedCls').on('click',function(){
	var action_url = $(this).attr('title');
	$('#form-social-icons').attr('action', project_settings.social_auth_api+action_url);
	$( "#form-social-icons" ).submit();
});
