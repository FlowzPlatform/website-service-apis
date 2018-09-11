if(user_id == null) {
    window.location = "index.html";
}
$(document).ready(function() {
	$("#success_url").val(website_settings.BaseURL+"socialDashboard.html");
});

$('.login-submit').on('click',function(){
	showPageAjaxLoading();
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
			hidePageAjaxLoading()
			if(!$( ".error-message" ).hasClass( "hide" )) {
				$('.error-message').addClass('hide');
			}
			if(!$( ".login-show" ).hasClass( "hide" )) {
				$(".login-show").addClass('hide');
			}
			$(".logout-show").removeClass('hide');
			$('.username-text').text('welcome');

			document.cookie = "user_auth_token=" + result.logintoken;

			var user_details = function () {
				var tmp = null;
				$.ajax({
					'async': false,
					'type': "GET",
					'url': project_settings.user_detail_api,
					'headers': {"Authorization": result.logintoken},
					'success': function (res) {
						tmp = res.data;
						user_id = tmp._id;
					}
				});
				return tmp;
			}();

			//redirect to previous page.
			if(document.referrer.trim() != '') {
				if (document.referrer.indexOf(website_settings.BaseURL) >= 0)
				{
					window.location = document.referrer;
				}
				else{
					window.location = "index.html";
				}
			}
			else {
				window.location = "index.html";
			}
		},
		error: function(err) {
			hidePageAjaxLoading()
			$('.error-message').removeClass('hide');
		}
	});
});

$('.socialMedCls').on('click',function(){
	var action_url = $(this).attr('title');
	$('#form-social-icons').attr('action', project_settings.social_auth_api+action_url);
	$( "#form-social-icons" ).submit();
});
