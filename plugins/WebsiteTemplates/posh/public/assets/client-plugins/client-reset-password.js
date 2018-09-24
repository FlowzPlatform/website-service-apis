var items = document.querySelectorAll('#c18422');
for (var i = 0, len = items.length; i < len; i++) {
    (function() {
        let BaseUrl = '';
        let resetPasswordUrl = "";
        let adminEmail = "";
        $(document).ready(function() {
            if ($.cookie("user_id") != null && $.cookie("user_auth_token") != null) {
                window.location = "index.html"
            } else {
                $.getJSON("./assets/project-details.json", function(data) {
                    resetPasswordUrl = data[0].reset_password_api;
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
        $(".reset-submit").click(function() {
            authenticateUser()
        });

        function authenticateUser() {
            if ($(".user_pass").val() != "") {
				showPageAjaxLoading();
                axios.post(resetPasswordUrl, {
					new_password: $(".user_pass").val(),
					token : getParameterByName('forget_token')
                }).then(function(response) {
                    console.log('response == ',response)
					hidePageAjaxLoading();
					setTimeout(function() {
						showSuccessMessage('Your password updated successfully.');
                    }, 5000)
                    
                    // window.location = "index.html"
                }).catch(function(error) {
                    console.log('error == ',error)
                    hidePageAjaxLoading();
                    //showErrorMessage(error.response.data);
                })
            } 
            else {
                showErrorMessage('Please enter new password');
            }
        }
    }.bind(items[i]))()
}