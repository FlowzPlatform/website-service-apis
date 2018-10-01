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
    }
});
window.onload = function() {
  showComparePopup();
}
function showComparePopup(recetAdded=false) {
  var compareHtml = $('#ComparePopup #listing')
  var compareValuesCount = 0;
  var productHtml = '';
  var itemTitleHtml1 = $('#ComparePopup .dropdown-grid').html();
  if(websiteConfiguration.transaction.compare_product.status == 0 && websiteConfiguration.transaction.compare_product.parent_status == 0)
  {
    // let html = '<div class="innerpage row"><div class="col-sm-12 col-md-4 col-lg-4 col-xs-12"><h1 class="main-title"><i class="fa fa-retweet"></i>PRODUCT COMPARE</h1></div><div class="col-sm-12 col-md-8 col-lg-8 col-xs-12"></div><div class="col-sm-8 col-md-9 col-lg-12 col-xs-12">Access Denied</div></div>'
    // $('#myCompareList').find('.innerpage').html(html);
    return false;
  }
  else
  {
    if(user_details != null){
      if(localStorage.getItem("savedComparedRegister") != null && localStorage.getItem("savedComparedRegister").length > 0)
      {
        var compare_values = JSON.parse(localStorage.getItem("savedComparedRegister"));
      }
      else{
        var compare_values = '';
      }
     }
     else {
        let decideLocalStorageKey = decide_localStorage_key(3);
        var compare_values = JSON.parse(localStorage.getItem(decideLocalStorageKey));
     }
     console.log('compare_values',compare_values)

     // var productHtml=itemSkuHtml=activeSummaryHtml=itemFeaturesHtml=itemPricingHtml='';
     if (typeof(compareHtml.html()) !== "undefined" && compare_values != null && compare_values.length > 0) {
        productHtml = ''
       for (item in compare_values){
         var prodId = compare_values[item]['product_id'];
         $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+"?_id="+prodId+"&source=default_image,product_id,sku,product_name,currency,min_price,description,features,images,pricing",
          async: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
          },
          dataType: 'json',
          success: async function (data) {
            rawData = data.hits.hits;
            productData = rawData;
            if(productData.length >0){
              var itemTitleHtml = itemTitleHtml1;
              itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,compare_values[item].id);
              let product_image = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
              if( productData[0]._source.images != undefined ){
                if(productData[0]._source.images[0].images[0].secure_url != undefined && productData[0]._source.images[0].images[0].secure_url != '') {
                  product_image = productData[0]._source.images[0].images[0].secure_url;
                  product_image = addOptimizeImgUrl(product_image,'w_203,h_200');
                }
              }
              itemTitleHtml = itemTitleHtml.replace('#data.image#',product_image);
              let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+prodId;
              itemTitleHtml = itemTitleHtml.replace('#data.product_link#',detailLink);
              itemTitleHtml = itemTitleHtml.replace(/#data.title#/g,productData[0]._source.product_name);
              itemTitleHtml = itemTitleHtml.replace('#data.sku#',productData[0]._source.sku);
              if(user_details == null && websiteConfiguration.site_management.price_and_qunatity_for_guest_user.status == 0){
                itemTitleHtml = itemTitleHtml.replace('#data.pricing#',"");
                itemTitleHtml = itemTitleHtml.replace(/#data.min_qty#/g,"");
              }
              else
              {
                itemTitleHtml = itemTitleHtml.replace('#data.pricing#',"$ "+parseFloat(productData[0]._source.min_price).toFixed(project_settings.price_decimal));
                itemTitleHtml = itemTitleHtml.replace(/#data.min_qty#/g,productData[0]._source.pricing[0].price_range[0].qty.gte);
              }
              productHtml += itemTitleHtml;
              //price
              // var item_price_rowHtml = $('#item_pricing').html();
              // var item_price_rowHtml = item_price_rowHtml.replace(/#data.id#/g,compare_values[item].id);
              // var item_price_rowHtml = item_price_rowHtml.replace("#data-product-id#",compare_values[item].product_id);

              //end - price
            }
          }
       })
      }
      // console.log('productHtml',productHtml)
      $('#ComparePopup .popupList').html(productHtml)
      $('#ComparePopup .dropdown-btn').css({"display": "block"})
    }
    else {
      let emptyListHTML = '<div class="empty-list-dropdown"><h2><i class="fa fa-retweet fa-fw"></i><br>Your Compare List Is Empty</h2></div>'
      $('#ComparePopup .popupList').html(emptyListHTML)
      $('#ComparePopup .dropdown-btn').css({"display": "none"})
    }
  }
}


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
      // showPageAjaxLoading();
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
          // hidePageAjaxLoading();
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
