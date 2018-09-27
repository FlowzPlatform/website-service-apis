projectID = "";
loginUrl = "";
userDetailsUrl = "";
socialLoginUrl = "";
baseURL = "";
BaseUrl = '';
adminEmail = '';
forgetPasswordUrl = "";
$(document).ready(function() {
    if ($.cookie("user_id") != null && $.cookie("user_auth_token") != null) {
        // window.location = "index.html"
        return false;
    } else {
        $.getJSON("./assets/project-details.json", function(data) {
            projectID = data[0].projectID;
            loginUrl = data[0].login_api;
            userDetailsUrl = data[0].user_details_api;
            socialLoginUrl = data[0].social_login_api;
            BaseUrl = data[0].BaseURL;
            baseURL = data[0].builder_service_api;
            adminEmail = data[0].projectOwner;
            forgetPasswordUrl = project_settings.forgot_password_api;
            $(".success_url").val(data[0].BaseURL);
            $(".failure_url").val(data[0].BaseURL + 'error404.html')
        })
        console.log('projectID',projectID)
        console.log(',loginUrl',loginUrl)
        console.log('userDetailsUrl',userDetailsUrl)
        console.log('socialLoginUrl',socialLoginUrl)
        console.log('BaseUrl',BaseUrl)
        console.log('baseURL',baseURL)
    }
});

$(".input-fields").keyup(function(e) {
    var code = e.which;
    if (code == 13) e.preventDefault();
    if (code == 32 || code == 13 || code == 188 || code == 186) {
        authenticateUser()
    }
});
$(".login-submit").click(function(e) {
    e.preventDefault();
    authenticateUser()
    return false;
});

function authenticateUser() {
  let loginFlag = true;
    if ($(".user_email").val() != "" && $(".user_pass").val() != "") {
        axios.post(loginUrl, {
            email: $(".user_email").val(),
            password: $(".user_pass").val()
        }).then(function(response) {
            axios.get(userDetailsUrl, {
                headers: {
                    "Authorization": response.data.logintoken
                }
            }).then(async(resp) => {
                await axios.get(baseURL + "/website-users?websiteId=" + projectID + "&userEmail=" + $(".user_email").val(), {})
                .then(async(res) => {
                    if (res.data.data.length > 0) {
                        if (res.data.data[0].isActive == true && res.data.data[0].isDeleted == false) {
                          loginFlag = true;
                        }
                        else {
                          loginFlag = false;
                          $(".alert-box").addClass("show");
                          $("#error-message").text('You are no longer active for this website');
                          setTimeout(function() {
                              $(".alert-box").removeClass("show")
                          }, 5000)
                        }
                    } else {
                        let userRole;
                        let name;
                        if (adminEmail == resp.data.data.email) {
                          userRole = 'admin';
                        }
                        else {
                          userRole = 'registered'
                        }
                        if (resp.data.data.fullname && resp.data.data.fullname != '') {
                          name = resp.data.data.fullname
                        }
                        else {
                          name = resp.data.data.username
                        }
                        await axios.post(baseURL + "/website-users", {
                            userEmail: resp.data.data.email,
                            userRole: userRole,
                            websiteId: projectID,
                            isActive: true,
                            isDeleted: false,
                            userName: name
                        }).then((respo) => {
                            loginFlag = true
                        }).catch((e) => {
                            loginFlag = false;
                        })
                    }
                }).catch((e) => {
                    console.log(e)
                });
                if (loginFlag) {
                  $.cookie("user_auth_token", response.data.logintoken, {
                      path: window.location.hostname
                  });
                  $.cookie("user_id", resp.data.data._id, {
                      path: window.location.hostname
                  });
                  if (document.referrer.trim() != "") {
                      if (document.referrer.indexOf(BaseUrl) >= 0) {
                          window.location = document.referrer
                      } else {
                          window.location = "index.html"
                      }
                  } else {
                      window.location = "index.html"
                  }
                }

            }).catch((e) => {
                console.log(e)
            })
        }).catch(function(error) {
            $(".alert-box").addClass("show");
            $("#error-message").text(error.response.data);
            setTimeout(function() {
                $(".alert-box").removeClass("show")
            }, 5000)
        })
        $(".user_email").val('')
        $(".user_pass").val('')
    } else if ($(".user_email").val() == "" && $(".user_pass").val() != "") {
        $(".alert-box").addClass("show");
        $("#error-message").text("Please Enter Email");
        setTimeout(function() {
            $(".alert-box").removeClass("show")
        }, 5000)
    } else if ($(".user_email").val() != "" && $(".user_pass").val() == "") {
        $(".alert-box").addClass("show");
        $("#error-message").text("Please Enter Password");
        setTimeout(function() {
            $(".alert-box").removeClass("show")
        }, 5000)
    } else {
        $(".alert-box").addClass("show");
        $("#error-message").text("Please enter login credentials");
        setTimeout(function() {
            $(".alert-box").removeClass("show")
        }, 5000)
    }
}

$(".forget-submit").click(function() {
    forgetPassword()
});

function forgetPassword() {
    if ($(".forget_email").val() != "") {
      showPageAjaxLoading();
      axios.post(forgetPasswordUrl, {
        email: $(".forget_email").val(),
        url : BaseUrl+'resetPassword.html'
      }).then(function(response) {
        hidePageAjaxLoading();
        showSuccessMessage('Your Request For Forgot Password Sent To Your Email');
        $(".forget_email").val('')
        // setTimeout(function() {
        //   window.location = "index.html";
        // }, 3000)
      }).catch(function(error) {
          hidePageAjaxLoading();
          $(".alert-box").addClass("show");
          $("#error-message").text(error.response.data);
          $(".forget_email").val('')
          setTimeout(function() {
              $(".alert-box").removeClass("show")
          }, 5000)
      })
    }
    else {
        showErrorMessage('Please Enter Your Email');
    }
}
