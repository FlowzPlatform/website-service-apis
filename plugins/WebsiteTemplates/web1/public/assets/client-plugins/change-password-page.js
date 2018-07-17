if(user_id == null) {
	window.location = "login.html";
}

if(websiteConfiguration.my_account.change_password.status == 0)
{
  let html = '<div class="col-sm-12 col-md-12 col-lg-12 col-xs-12"><div class="col-sm-6 col-md-6 col-lg-6 col-xs-12">Access Denied</div></div>';

  $(".ob-main-address-block").html(html);
  $('.js-hide-div').removeClass("js-hide-div");
}

$(".breadcrumb li:last-child").html('<strong>Change Password</strong>')
$(".breadcrumb li:last-child").removeClass("hide")

$("#change_pass_form").submit(function(event){
    event.preventDefault();
	//var form_data = $(this).serializeArray();

	var old_pass = $("#change_password_current").val();
	var new_pass = $("#change_password_first").val();
	var confirm_pass = $("#change_password_second").val();

	if(new_pass === confirm_pass) {
		var passDetails = {"oldpass":old_pass ,"newpass":new_pass};
		let userToken = getCookie('user_auth_token');

		$.ajax({
			type: 'POST',
			url: project_settings.change_password_api,
			async: true,
			data:  JSON.stringify(passDetails),
			dataType: 'json',
			headers: {
				"authorization": userToken,
				'Content-Type': 'application/json'
			},
			success: function (result) {
				showSuccessMessage(result.message,window.location.href);
			},
			error: function(err) {
				let errorMsg = err.responseText.replace('Error:','');
				showErrorMessage(errorMsg.trim());
			}
		});
	}
	else {
		showErrorMessage('The entered new and confirm password does not match!');
		return false;
	}
});
