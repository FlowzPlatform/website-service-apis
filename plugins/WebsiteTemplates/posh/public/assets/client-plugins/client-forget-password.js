var items = document.querySelectorAll('#c18422');
for (var i = 0, len = items.length; i < len; i++) {
    (function() {
        let BaseUrl = '';
        let forgetPasswordUrl = "";
        let adminEmail = "";

        $(document).ready(function() {
            if ($.cookie("user_id") != null && $.cookie("user_auth_token") != null) {
                window.location = "index.html"
            } else {
                forgetPasswordUrl = project_settings.forgot_password_api;
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

        $(".forget-submit").click(function() {
            authenticateUser()
        });

        function authenticateUser() {
            if ($(".user_email").val() != "") {
				showPageAjaxLoading();
                axios.post(forgetPasswordUrl, {
					email: $(".user_email").val(),
					url : BaseUrl+'resetPassword.html'
                }).then(function(response) {
                    hidePageAjaxLoading();
                    showSuccessMessage('Your request for forgetpassword sent to your email');
					setTimeout(function() {
						window.location = "index.html";
					}, 3000)
                }).catch(function(error) {
                    hidePageAjaxLoading();
                    $(".alert-box").addClass("show");
                    $("#error-message").text(error.response.data);
                    setTimeout(function() {
                        $(".alert-box").removeClass("show")
                    }, 5000)
                })
            } 
            else {
                showErrorMessage('Please enter your email');
            }
        }
    }.bind(items[i]))()
}