let flyerUrl = project_settings.flyers_api_url+"?website="+website_settings['projectID'];
if(getParameterByName('fcid')) {
    flyerUrl += "&fcid="+getParameterByName('fcid');
}

flyers = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': flyerUrl,
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

flyer_categories = function () {
    let tmp = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'dataType': 'json',
        'url': project_settings.flyer_category_api_url+"?website="+website_settings['projectID'],
        'success': function (res) {
            tmp = res.data;
        }
    });
    return tmp;
}();

flyer_data(flyers);
async function flyer_data(flyers) {
    if(flyers.length > 0)
    {
        showPageAjaxLoading();
        await sleep(100);

        let listHtml = $('#myFlyers .js-list').html();
        $.each( flyers, function( key, flyerArray ) {
            let listHtml1 = "";

            listHtml1 = listHtml.replace('#flyer-image#',flyerArray.flyer_image);

            listHtml1 = listHtml1.replace(/#flyer-id#/g,flyerArray.id);

            listHtml1 = listHtml1.replace(/#flyer-title#/g,flyerArray.flyer_name);

            listHtml1 = listHtml1.replace(/#flyer-image-link#/g,flyerArray.flyer_image);

            listHtml1 = listHtml1.replace(/#flyer-pdf-link#/g,flyerArray.flyer_pdf);
            if(typeof flyerArray.client_friendly_pdf != "undefined")
            {
                listHtml1 = listHtml1.replace(/#flyer-client_friendly-link#/g,flyerArray.client_friendly_pdf);
            }
            $('#myFlyers .listing').append(listHtml1);
            if(typeof flyerArray.client_friendly_pdf == "undefined")
            {
                $('#myFlyers .listing').find('.product-'+flyerArray.id+' .js_client_friendly_pdf').remove();
            }
        });


        hidePageAjaxLoading();
    }
    else {
        $('#myFlyers .listing').html('No records found.');
    }
}

$(document).on("click", '.js-open-modal-flyer', function(e){
    $('#modal-table').addClass('model-popup-black');
    $('#modal-table').addClass('banner-copy-block add-flyer-modal');
    $("#modal-table").find(".modal-title").html('<i class="fa fa-eye"></i> View Flyer');
    $("#modal-table").find(".modal-dialog").addClass("modal-lg");
    let flyerHtml = $(".js_display_flyer").html();
    flyerHtml = flyerHtml.replace("#flyer-image-link#",$(this).attr("data-image"));
    $(".js_add_html").html(flyerHtml);
    $('#modal-table').modal('show');
});

let flyerImageLink;
$(document).on("click", '.js-open-flyer-mail', function(e){
    flyerImageLink = $(this).attr("data-image")
});

$(document).on('click', '.email-product-modal-submit', function(e) {
    $('form#email-flyer-form').validate({
      rules: {
        "senderName": "required",
        "email": {
          required: true,
          email: true
        },
        "to_email": {
          required: true,
          email: true
        },
        "message": "required"
      },
      messages: {
        "senderName": "Enter Valid Name!",
        "email": {
          required : "Enter Email!",
          email : "Enter Valid Email!"
        },
        "to_email": {
          required : "Enter Email!",
          email : "Enter Valid Email!"
        },
        "message": "Enter Valid Message!"
      },
      errorElement: "li",
      errorPlacement: function(error, element) {
        error.appendTo(element.closest("div"));
        $(element).closest('div').find('ul').addClass('red')
      },
      errorLabelContainer: "#errors",
      wrapper: "ul",
      submitHandler: function(form) {
        showPageAjaxLoading();
        let formData = $(form).serializeArray();
        let flyerJson = {};
        let mailFlyerJson = {};
        for (let input of formData) {
            flyerJson[input.name] = input.value;
        }
        flyerJson['slug'] = 'flyer';
        flyerJson['flyer_image'] = flyerImageLink
        mailFlyerJson['form_data'] = flyerJson;
        mailFlyerJson['website_id'] = website_settings['projectID'];
        console.log('mailFlyerJson',mailFlyerJson)

        $.ajax({
    		  type : 'POST',
    		  url : project_settings.request_quote_api_url,
    		  data : mailFlyerJson,
    		  cache: false,
    		  dataType : 'json',
    		  success : function(response_data) {
    			console.log("response_data",response_data)
    			if(response_data!= "") {
    			//   $("#send_quick_quoteemail").find("input,textarea").val('');
    				hidePageAjaxLoading()
    				showSuccessMessage("Email Sent Successfully.");
    				// window.location = "flyers.html";
    				return false;
    			}
    			else if(response_data.status == 400) {
    				hidePageAjaxLoading()
    				showErrorMessage(response_data.message);
    				return false;
    			}
    		  }
    		});
      }
    })
})
