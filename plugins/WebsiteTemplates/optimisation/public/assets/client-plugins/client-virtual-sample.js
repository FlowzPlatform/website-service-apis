showCaptcha();
$(document).on('click','.js-virtual_sample',function (e)
{
  $('form#virtual_sample').validate({
    rules: {
      "po_number":"required",
	  	"item_num_1":"required",
      "item_color_1":"required",
      "imprint_color_1":"required",
      "phone":"required",
      "CaptchaInput":"required",
      "email":{
        required:true,
        email: true
      },
    },
    messages: {
			"po_number":"Please enter PO number.",
			"item_num_1":"Please enter item number",
			"item_color_1":"Please enter item color",
			"imprint_color_1":"Please enter imprint color ",
			"phone":"Please enter phone number",
			"CaptchaInput":"Please enter verification code.",
			"email":
				{
					required:"Please enter email",
					email: "Please enter valid email."
				}
    },
    errorElement: "li",
    errorPlacement: function(error, element) {
      if($(element).closest('div').find('ul').length <=0 ){
				error.appendTo(element.closest("div"));
			}
      $(element).closest('div').find('ul').addClass('red')
    },
    errorLabelContainer: "#errors",
    wrapper: "ul",
    submitHandler: function(form) {

      /*let checkBlanckItemNum = checking('item_num');
      if(checkBlanckItemNum == 3){
          $("#item_num_1").parent('div.form-group').append('<ul class="red"><li class="error">Please enter at-least one item number.</li></ul>')
      }

      let checkBlanckItemColor = checking('item_color');
      if(checkBlanckItemColor == 3){
          $("#item_color_1").parent('div.form-group').append('<ul class="red"><li class="error">Please enter at-least one item color.</li></ul>')
      }

      let checkBlanckImprintColor = checking('imprint_color');
      if(checkBlanckImprintColor == 3){
          $("#imprint_color_1").parent('div.form-group').append('<ul class="red"><li class="error">Please enter at-least one imprint color.</li></ul>')
      }*/

  		let firstAttachemnt = $('.js-clone_div:first').find('#award_file_url').val()

  		if(firstAttachemnt == ""){
  			// $('.js-clone_div:first').find('.col-sm-8').append('<ul class="red"><li id="po_number-error" class="error" style="">Please attach artwork.</li></ul>');
        $(".fileinput-new").append('<ul class="red"><li id="po_number-error" class="error" style="">Please attach artwork.</li></ul>');
        return false;
  		}

      // if(checkBlanckItemNum == 3 || checkBlanckItemColor == 3 || checkBlanckImprintColor == 3 || firstAttachemnt == ""){
      //     return false;
      // }

  		let formObj = $(form);
  		var productJsonData1 = {};
  		var form_data = formObj.serializeArray();
  		var virtualSample = {};

  		var why = "";

  		if($('#CaptchaInput').val() == ""){
  			why += "Please Enter CAPTCHA Code.\n";
  		}
  		if($('#CaptchaInput').val() != ""){
  			if(ValidCaptcha($('#CaptchaInput').val()) == false){
  				why += "The CAPTCHA Code Does Not Match.\n";
  			}
  		}

		if(why != ""){
			$("input[name='CaptchaInput']").closest("div").append('<ul class="red" style=""><li id="CaptchaInput-error" class="error" style="">'+why+'</li></ul>')
			return false;
		}

		for (var input in form_data){
		  var name = form_data[input]['value'];
		  virtualSample[form_data[input]['name']] = name;
		}

		virtualSample['slug'] = 'virtual-sample-order';

		productJsonData1['form_data'] = virtualSample;
		productJsonData1['website_id'] = website_settings['projectID'];

		let responseItemArray = [];

		let responseObj = {};
		let get_form_data = productJsonData1['form_data'];

		responseObj['item_number'] = get_form_data['item_num_1'];
		responseObj['item_color'] = get_form_data['item_color_1'];
		responseObj['imprint_color'] = get_form_data['imprint_color_1'];
		responseItemArray.push(responseObj);

		if(get_form_data['item_num_2'] != "" && get_form_data['item_color_2'] && get_form_data['imprint_color_2'])
		{
			responseObj = {};
			responseObj['item_number'] = get_form_data['item_num_2'];
			responseObj['item_color'] = get_form_data['item_color_2'];
			responseObj['imprint_color'] = get_form_data['imprint_color_2'];
			responseItemArray.push(responseObj);
		}

		if(get_form_data['item_num_3'] != "" && get_form_data['item_color_3'] && get_form_data['imprint_color_3'])
		{
			responseObj = {};
			responseObj['item_number'] = get_form_data['item_num_3'];
			responseObj['item_color'] = get_form_data['item_color_3'];
			responseObj['imprint_color'] = get_form_data['imprint_color_3'];
			responseItemArray.push(responseObj);
		}

		productJsonData1['items'] = responseItemArray;

		let sampleOrderAttachments = [];

		$( ".fileinput-filename" ).each(function( index ) {
			let attachedUrl = $( this ).find('#award_file_url').val();
			if(attachedUrl != "")
			{
				sampleOrderAttachments.push($( this ).find('#award_file_url').val() );
			}
		});

		productJsonData1['attachements'] = sampleOrderAttachments;

		// console.log('productJsonData1',productJsonData1);
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
				window.location = "thankYou.html";
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

//add more files
function addFileInput()
{
	$(".js-clone_div:last").clone().insertAfter("div.js-clone_div:last").find('#award_file_url').val("");
	$("div.js-clone_div:last").find("#award_file_img").attr("src","")
	$("div.js-clone_div:last").find(".js_file_name").html("")
	$("div.js-clone_div:last").find("ul.red").remove()
	$("div.js-clone_div:last").find("#award_file_img").addClass("hide")
}
//end
function showCaptcha(){
	// Captcha Script

	var a = Math.ceil(Math.random() * 9)+ '';
	var b = Math.ceil(Math.random() * 9)+ '';
	var c = Math.ceil(Math.random() * 9)+ '';
	var d = Math.ceil(Math.random() * 9)+ '';
	var e = Math.ceil(Math.random() * 9)+ '';

	var code = a + b + c + d + e;
	document.getElementById("txtCaptcha").value = code;
	document.getElementById("CaptchaDiv").innerHTML = code;
}
// Validate input against the generated number
function ValidCaptcha(){
	var str1 = removeSpaces(document.getElementById('txtCaptcha').value);
	var str2 = removeSpaces(document.getElementById('CaptchaInput').value);
	if (str1 == str2){
	return true;
	}else{
	return false;
	}
	}

	// Remove the spaces from the entered and generated code
	function removeSpaces(string){
	return string.split(' ').join('');
	}

	//////////////////////////////
$(document).on('click', '.js-upload-art-image', function(e) {
	let getParentHtml = $(this).parent();
	// let id = $(this).closest('.js-img-global').find('img').attr('id');
	// let save_id = $(this).closest('.js-img-global').find('input[type=hidden]').attr('id');
	// let pos = $(this).closest('.art-pos-value').attr('data-pos'); //summary
	// let index = $(this).attr('data-index'); //summary
	// let art_heading = $(this).closest(".art-pos-value").find('li.active a').text(); //summary
	// let art_heading_undescore = replaceWithUnderscore(art_heading); //summary
	cloudinary.openUploadWidget({
			cloud_name: cloudinaryDetails.cloudName,
			api_key: cloudinaryDetails.apiKey,
			upload_preset: cloudinaryDetails.uploadPreset,
			sources: ['local', 'url'],
			// public_id: website_settings['projectID']+'/artwork/'+Date.now(),
			multiple: false
	},
	function(error, result) {
			if(typeof result != 'undefined') {
				// console.log('result',result)
				// AI, EPS, PDF, PSD, TIF, JPG
				if($.inArray( result[0].format, [ "ai", "eps", "pdf", "psd", "tif","jpg"] ) !== -1)
				{
					if(result[0].format == "jpg")
					{
						getParentHtml.find("#award_file_img").attr('src',result[0].url);
						if(getParentHtml.find('#award_file_img').hasClass( "hide" )) {
							getParentHtml.find('#award_file_img').removeClass('hide');
						}
						getParentHtml.find("#award_file_url").val(result[0].url);
						getParentHtml.find(".js_file_name").html(result[0].original_filename+'.'+result[0].format);
						getParentHtml.find("ul.red").remove();
					}
					else{
						getParentHtml.find("#award_file_url").val(result[0].url);
						getParentHtml.find(".js_file_name").html(result[0].original_filename+'.'+result[0].format);
						getParentHtml.find("ul.red").remove();
						getParentHtml.find("#award_file_img").attr("src","")
						getParentHtml.find("#award_file_img").addClass("hide")
					}
				}
				else{
          if(getParentHtml.find('.error').length > 0){
              getParentHtml.find('.error').html('Artwork must be in one of the following formats: AI, EPS, PDF, PSD, TIF, JPG.');
          }else{
              getParentHtml.append('<ul class="red"><li class="error" style="">Artwork must be in one of the following formats: AI, EPS, PDF, PSD, TIF, JPG.</li></ul>');
          }

					getParentHtml.find("#award_file_img").attr("src","")
					getParentHtml.find(".js_file_name").html("")
					getParentHtml.find("#award_file_img").addClass("hide")
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
function checking(inputClass) {
    let empty = 0;
    $('input.'+inputClass+'[type=text]').each(function(){
       if ($.trim(this.value) == "") {
           empty++;
       }
    })
    return empty;
}
