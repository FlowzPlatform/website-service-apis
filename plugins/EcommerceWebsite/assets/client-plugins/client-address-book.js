// $(document).ready(function(){
  // $(document).on("click","js_submit_address",function(e){
  // $("form#address_book").submit(function(event) {
    // let formObj = $(this);
if (user_id == null ) {
  window.location = 'login.html';
}
$(function() {
    $('form#address_book').validate({
  			rules: {
          "name":"required",
          "address_type": "required",
          "email":{
            required:true,
            email: true
          },
          "street1":"required",
          "country":"required",
          "state":"required",
          "city":"required",
          "postalcode":"required",
          "phone":{
              required:true
          }
  			},
  			messages: {
          "username":"Please enter name.",
          "address_type":"Please select address type.",
          "email":{
            required:"Please enter email",
            email: "Please enter valid email."
          },
          "street1":"Please enter address 1",
          "country":"Please enter country",
          "state":"Please enter state",
          "city":"Please enter city",
          "postalcode":"Please enter postal code",
          "phone":{
            required:"Please enter phone"
          }
  			},
        errorElement: "li",
        errorPlacement: function(error, element) {
          error.appendTo(element.closest("div"));
          $(element).closest('div').find('ul').addClass('red')
        },
        errorLabelContainer: "#errors",
        wrapper: "ul",
        submitHandler: function(form) {
            let formObj = $(form);
            // console.log("form",formObj.serialize());
            $.ajax({
                  type: 'POST',
                  url: project_settings.address_book_api_url,
                  data: formObj.serialize()+'&user_id='+user_id+'&culture='+project_settings.default_culture+'&is_address=1',
                  cache: false,
                  dataType: 'json',
                  headers: {"Authorization": project_settings.product_api_token},
                  success: function(response){
                      if(response.id != undefined && response.id != '' ){
                          showSuccessMessage("Your address book is saved successfully..","addressBookList.html");
                          return false;
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                  }
            });
        },
    });

    if( $('.js-phone')){
  		var cntkey=0;
  	    $(document).on('keypress', '.js-phone', function (event)
  	    {
  	        cntkey=$(this).val().length;
  	        phone_delemeter ='-'
  	        if(event.which!=0)
  	        {
  		        if(event.which==8)	return true;
  		        else if(((event.which>=48&&event.which<=57)||event.which==45)&&((phone_delemeter == '' && cntkey<10)||(phone_delemeter != '' && cntkey<12)))
  		        {
  		            if(event.which!=45&&(cntkey==3||cntkey==7))
  		            {
  		                $(this).val($(this).val()+phone_delemeter);
  		                return true;
  		            }
  		            else if(event.which==45&&(cntkey==3||cntkey==7))	return true;
  		            else if(event.which==45)	return false;
  		            else	return true;
  		        }
  		        else
  		        {
  			        return false;
  			      }
  	        }
  	    });
  	}

    /* for shhiping type start */
   	if($('.js-address-type').val() == 'shipping'){
   		$('.js-isoffice').show();
   	}

   	$(document).on('change', '.js-address-type', function(e) {
  		if($(this).val() == 'shipping'){
  			$('.js-isoffice').show();
  			if(!$('.js-isoffice input[type="radio"]').is(':checked')){
  				$('.js-isoffice input[type="radio"]:first').prop('checked', true);
  			}
  		}else{
  			$('.js-isoffice').hide();
  		}
  	});
   	/* for shhiping type end */

  	$(".custom-select").each(function () {
  	    $(this).wrap("<span class='checkout-select-wrapper'></span>");
        $(this).after("<span class='checkout-holder'></span>");
  	});
  	$(document).on('change','.custom-select', function() {
  		var selectedOption = $(this).find(":selected").text();
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").text(selectedOption);
  	});
  	$('.custom-select').trigger('change');
  	$(document).on('click','.custom-select option', function() {
  	    $(this).parents(".checkout-select-wrapper").find(".checkout-holder").html('<span>'+ this.innerHTML+ '</span>');
  	});
});
// });
