if(getCookie('loginTokenKey') != null) {
	window.location = "index.html";
}

$('.email-submit').on('click',function(){
	//var ob_id = $_GET('ob_id');
	var ob_id = getParameterByName('ob_id');

	var social_email = $("#social_email").val();

	var socialDetails = {"email":social_email,"id":ob_id};
	$.ajax({
		type: 'POST',
		url: project_settings.social_process_api,
		async: false,
		data:  JSON.stringify(socialDetails),
		dataType: 'json',
		headers: { 'Content-Type': 'application/json' },
		success: function (result) {
			if(!$( ".login-show" ).hasClass( "hide" )) {
				$(".login-show").addClass('hide');
			}
			$(".logout-show").removeClass('hide');
			$('.username-text').text('Welcome');

			//alert(result.message);
			document.cookie = "loginTokenKey=" + result.logintoken;
			window.location = "index.html";
		},
		error: function(err) {
			console.log("social login error = ", err);
		}
	});
});
