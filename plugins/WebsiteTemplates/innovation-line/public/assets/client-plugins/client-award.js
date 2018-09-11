// if(user_id == null) {
// 	window.location = "login.html";
// }

$(document).on('click','.js-award_submit',function (e)
{
  $('form#idea').validate({
    rules: {
      "cname":"required",
	  	"name":"required",
      "phno":"required",
      "email":{
        required:true,
        email: true
      },
    },
    messages: {
		"cname":"Please enter company name.",
		"name":"Please enter contact name.",
		"phno":"Please enter phone number",
	  "email":{
				required:"Please enter email",
				email: "Please enter valid email."
    	}
    },
    errorElement: "li",
    errorPlacement: function(error, element) {
			if($(element).closest('div').find('ul').length <= 0){
					error.appendTo(element.closest("div"));
			}
      $(element).closest('div').find('ul').addClass('red')
    },
    errorLabelContainer: "#errors",
    wrapper: "ul",
    submitHandler: function(form) {
    let formObj = $(form);
		var productJsonData1 = {};
		var form_data = formObj.serializeArray();
		var orderSample = {};

		for (var input in form_data){
		  var name = form_data[input]['value'];
		  orderSample[form_data[input]['name']] = name;
		}

		orderSample['slug'] = 'acrylic-awards';

		productJsonData1['form_data'] = orderSample;
		productJsonData1['website_id'] = website_settings['projectID'];

		console.log('productJsonData1',productJsonData1);

		// return false;

		$.ajax({
		  type : 'POST',
		  url : project_settings.request_quote_api_url,
		  data : productJsonData1,
		  cache: false,
		  dataType : 'json',
		  success : function(response_data) {
			// console.log("response_data",response_data)
			if(response_data!= "") {
			//   $("#send_quick_quoteemail").find("input,textarea").val('');
				hidePageAjaxLoading()
				showSuccessMessage("Email Sent Successfully.");
				window.location = "awardSuccess.html";
				return false;
			}
			else if(response_data.status == 400) {
				hidePageAjaxLoading()
				// showErrorMessage(response_data.message);
				return false;
			}
		  }
		});
    },
  }).form()
});

//////////////////////////////
$(document).on('click', '.js-upload-art-image', function(e) {
	// let id = $(this).closest('.js-img-global').find('img').attr('id');
	// let save_id = $(this).closest('.js-img-global').find('input[type=hidden]').attr('id');
	// let pos = $(this).closest('.art-pos-value').attr('data-pos'); //summary
	// let index = $(this).attr('data-index'); //summary
	// let art_heading = $(this).closest(".art-pos-value").find('li.active a').text(); //summary
	// let art_heading_undescore = replaceWithUnderscore(art_heading); //summary
	//console.log('cloudinaryDetails',cloudinaryDetails)
	cloudinary.openUploadWidget({
			cloud_name: cloudinaryDetails.cloudName,
			api_key: cloudinaryDetails.apiKey,
			upload_preset: cloudinaryDetails.uploadPreset,
			sources: ['local', 'url'],
			// public_id: website_settings['projectID']+'/artwork/'+Date.now(),
			multiple: false
	},
	function(error, result) {
			console.log(error, result)
			if(typeof result != 'undefined') {
				$("#award_file_url").val(result[0].url);
					$("#award_file_img").attr('src',result[0].url);
					if($('#award_file_img').hasClass( "hide" )) {
						$('#award_file_img').removeClass('hide');
					}
				// 		$("#"+save_id).attr('value',result[0].url);

				// 		//summary for upload artwork
				// 		$(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_logo_"+index).removeClass('hide');
				// 		$(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_logo_"+index).find('img').attr('src',result[0].thumbnail_url);
			}
	});

	//readImgUrl(this,e,id); // do not remove this comment.
});

/////////////////////////
