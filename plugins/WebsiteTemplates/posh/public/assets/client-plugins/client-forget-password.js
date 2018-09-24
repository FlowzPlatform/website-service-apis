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
                $.getJSON("./assets/project-details.json", function(data) {
                    forgetPasswordUrl = data[0].forget_password_api;
                    BaseUrl = data[0].BaseURL;
                    adminEmail = data[0].projectOwner;
                    $(".success_url").val(data[0].BaseURL);
                    $(".failure_url").val(data[0].BaseURL + 'error404.html')
                })
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
					setTimeout(function() {
						showSuccessMessage('Your request for forgetpassword sent to your email');
					}, 5000)
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