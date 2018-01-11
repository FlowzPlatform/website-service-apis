if (user_id == null ) {
  window.location = 'login.html';
}
$(function() {
    let addressBookId = getParameterByName("id");
    // Add Contact Book
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
            if(addressBookId != null){
              methodType = "PATCH"
              url = project_settings.address_book_api_url+"/"+addressBookId;
            }else{
              methodType = "POST"
              url = project_settings.address_book_api_url;
            }

            $.ajax({
                  type: methodType,
                  url: url,
                  data: formObj.serialize()+'&user_id='+user_id+'&culture='+project_settings.default_culture+'&is_address=1',
                  cache: false,
                  dataType: 'json',
                  headers: {"Authorization": project_settings.product_api_token},
                  success: function(response){
                      if(response.id != undefined && response.id != '' ){
                        if(addressBookId != null){
                          showSuccessMessage("Your address book is updated successfully..","addressBookList.html");
                        }else{
                          showSuccessMessage("Your address book is saved successfully..","addressBookList.html");
                        }
                          return false;
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                  }
            });

        },
    });

    /* End Add Address Book */

    /* Edit Address Book Start */
    if(addressBookId != null){
      axios({
          method: 'GET',
          url: project_settings.address_book_api_url+'/'+addressBookId,
          headers: {'Authorization': project_settings.product_api_token},
        })
      .then(response => {
          if(response.data != undefined ){
              let addressBookDetail = response.data;
              console.log("addressBookDetail",addressBookDetail);
              let formObj = $('form#address_book');
              $.each(addressBookDetail,function(element,value){
                  $(formObj.find('input[type="text"][name*="'+element+'"]')).val(value);
                  $('option:selected', 'select[name="'+element+'"]').removeAttr('selected');
                  $('select[name="'+element+'"]').find('option[value="'+value+'"]').attr("selected",true);
                  $(formObj.find('[name*="'+element+'"]')).parent('span').find(".checkout-holder").text(value)
                  $('input:radio[name="'+element+'"]').prop('checked', true);
                  if($(formObj.find('[name*="'+element+'"]')).parent('span').find(".checkout-holder").text() == "shipping"){
                    $(".js-isoffice").show()
                  }
              });
          }
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
    }

    /*  Edit Address Book End */

    /* for Address type start */
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

    /* for Address type end */


    /* for Listing Address Book */

    if($(".js_address_book_list").find('.account-address-block').length > 0)
    {
        let addressBookHtml = $(".js_address_book_list").html();
        let replaceAdddressBookHtml = '';

        axios({
            method: 'GET',
            url: project_settings.address_book_api_url,
            headers: {'Authorization': project_settings.product_api_token},
            params: {
              "user_id":user_id,
              "is_address":'1',
              "deleted_at": false
             }
          })
        .then(response => {
          // console.log("+++",response.data);
            if(response.data != undefined  && response.data.total > 0){
                $.each(response.data.data,function(key,data){
                    let addressBookHtml1 = "";
                    let address = data.street1;
                    if(data.street2 != undefined && data.street2 != ''){
                        address += ",<br>"+data.street2;
                    }
                    address += ",<br>"+data.city;
                    address += ","+data.state;
                    address += ","+data.postalcode;
                    address += "<br>"+data.country;
                    addressBookHtml1 = addressBookHtml.replace("#data.name#",data.name)
                    addressBookHtml1 = addressBookHtml1.replace("#data.phone#",data.phone)
                    addressBookHtml1 = addressBookHtml1.replace("#data.email#",data.email)
                    addressBookHtml1 = addressBookHtml1.replace("#data.addressType#",data.address_type)
                    if(data.is_default == '1'){
                      addressBookHtml1 = addressBookHtml1.replace("#activeDefaultClass#","address-active")
                    }else{
                      addressBookHtml1 = addressBookHtml1.replace("#activeDefaultClass#","is-default")
                    }
                    addressBookHtml1 = addressBookHtml1.replace("#data.addressType#",data.address_type)
                    addressBookHtml1 = addressBookHtml1.replace(/#data.id#/g,data.id)
                    replaceAdddressBookHtml += addressBookHtml1.replace("#data.address#",address)
                })
                $(".js_address_book_list").html(replaceAdddressBookHtml)
            }else{
                $(".js_address_book_list").html('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h1 class="main-title">Not found</h1></div>')
            }

        })
        .catch(error => {
          console.log('Error fetching and parsing data', error);
        });

        // set default address in address book
        $(document).on("click",".js_address_type a",function(){
            let addressBookId = $(this).data('id');
            if($(this).attr('class') == "address-active"){
              showErrorMessage("This is already default address.");
              return false;
            }
            axios({
              method: 'PATCH',
              url: project_settings.address_book_api_url+'/'+addressBookId,
              headers: {'Authorization': project_settings.product_api_token},
              data: {"is_default": '1'}
            }).then(function(response) {
                if(response.data != undefined){
                   showSuccessMessage("Default Address Book is Updated Successfully","addressBookList.html");
                   return false
                }
            });

        });

        // Start addressBook Soft Delete
        $(document).on("click",".js_delete_address",function(){
            let addressBookId = $(this).data('id');
            axios({
              method: 'PATCH',
              url: project_settings.address_book_api_url+'/'+addressBookId,
              headers: {'Authorization': project_settings.product_api_token},
              data: {"deleted_at": true}
            }).then(function(response) {
                if(response.data != undefined){
                   showSuccessMessage("Address Book is deleted successfully.","addressBookList.html");
                   return false
                }
            });
        })

    }
    /* for Address Book list end */

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

});
// });
