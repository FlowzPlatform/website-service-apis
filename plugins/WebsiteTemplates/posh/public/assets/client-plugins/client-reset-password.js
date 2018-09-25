var items = document.querySelectorAll('#c18422');
for (var i = 0, len = items.length; i < len; i++) {
    (function() {
        let BaseUrl = '';
        let resetPasswordUrl = "";
        let adminEmail = "";

        $(document).ready(function() {
            if ($.cookie("user_id") != null && $.cookie("user_auth_token") != null) {
                window.location = "index.html"
            } 
            else {
                resetPasswordUrl = project_settings.reset_password_api;
                BaseUrl = website_settings.BaseURL;
                adminEmail = project_settings.admin_email;
            }
        });

        $(".input-fields").keyup(function(e) {
            var code = e.which;
            if (code == 13) e.preventDefault();
            if (code == 32 || code == 13 || code == 188 || code == 186) {
                authenticateUser()
            }
        });

        $(".reset-submit").click(function() {
            authenticateUser()
        });

        function authenticateUser() {
            if ($(".user_pass").val() != "") {
				showPageAjaxLoading();
                axios.post(resetPasswordUrl, {
					new_password: $(".user_pass").val().trim(),
					token : decodeURI(getParameterByName('forget_token'))
                }).then(function(response) {
                    hidePageAjaxLoading();
                    showSuccessMessage('Your password updated successfully.');
					setTimeout(function() {
                        window.location = "login.html";
                    }, 3000)
                }).catch(function(error) {
                    console.log('error == ',error)
                    hidePageAjaxLoading();
                    $(".alert-box").addClass("show");
                    $("#error-message").text(error.response.data);
                    setTimeout(function() {
                        $(".alert-box").removeClass("show")
                    }, 5000)
                })
            } 
            else {
                showErrorMessage('Please enter new password');
            }
        }
    }.bind(items[i]))()
}