if(getCookie('loginTokenKey') == null) {
	window.location = "login.html";
}

$("#change_pass_form").submit(function(event){
    event.preventDefault();
	//var form_data = $(this).serializeArray();

	var old_pass = $("#change_password_current").val();
	var new_pass = $("#change_password_first").val();
	var confirm_pass = $("#change_password_second").val();

	if(new_pass === confirm_pass) {
		var passDetails = {"oldpass":old_pass ,"newpass":new_pass};
		let userToken = getCookie('loginTokenKey');

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
				console.log("change pass == ",result);
				showSuccessMessage(result.message,project_settings.base_url+"public/index.html");
			},
			error: function(err) {
				showErrorMessage('internal server error');
			}
		});
	}
	else {
		showErrorMessage('The entered new and confirm password does not match!');
		return false;
	}
});
