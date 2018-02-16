var pid = getParameterByName('pid');


if(pid != null) {
  var get_product_details = function () {
      var tmp = null;
      $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+"?_id="+pid,
          async: false,
          dataType: 'json',
           headers: {
                'vid' : project_settings.vid
            },
          success: function (data) {
              if(data.hits.hits.length > 0)
              {
                  productData = data;
                  tmp = productData.hits.hits[0]._source;
              }
          }
      });
      return tmp;
    }();
}
showPageAjaxLoading()
$(document).ready(function(){
let value_split = [];
var productData = {};

var colors = '';
var Quantity = '';
var imprint_method_select;
let listHtmlPrintPosMethod = '';
listHtmlPrintPosMethod = $('#js_imprint_request_quote').html();

let listHtmlPrintPosColor = '';
listHtmlPrintPosColor = $('.imprint-color-select').html();

if(pid != null) {
        $.ajax({
			  type: 'GET',
			  url: project_settings.product_api_url+"?_id="+pid,
			  async: false,
			  dataType: 'json',
			   headers: {
				    'vid' : project_settings.vid
				},
			  success: function (data) {
          hidePageAjaxLoading();
			    // product name , sku, default images
          if(data.hits.hits.length > 0){
                  productData = data;
                  var productDetails = productData.hits.hits[0]._source;
                  // console.log("productDetails==>>",productDetails);
                	ProductName = removeSpecialCharacters(productDetails.product_name);
                	ProductImage = productDetails.default_image;
                  ProductSku = productDetails.sku;

                  // $('#product_name').html(ProductName)
                  let listHtml = $('#title .row').html();
                  let titleAndSkuHtml = listHtml.replace('#data.product_name#',ProductName);
                  titleAndSkuHtml = titleAndSkuHtml.replace('#data.sku#',ProductSku);
                  let breadcrumbHtml = $(".breadcrumb").html();
                  breadcrumbHtml = breadcrumbHtml.replace("#data.title#",ProductName)
                  $(".breadcrumb").html(breadcrumbHtml);
                  // console.log(titleAndSkuHtml);
                  // productHtml += listHtml1;
                  $('#title .row').html(titleAndSkuHtml);
                  let productImageUrl = project_settings.product_api_image_url+ProductImage;
                  $('#product_img').attr("src",productImageUrl)
                  $('#product_img').data("zoom-image",productImageUrl)
                  $('#product_img').data("orig-img",productImageUrl)
			            // $('#product_sku').html(ProductSku);

                  // Add Variation Images
                  let imageGallaryHtml = '';
                  imageGallaryHtml += '<div class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_default_link" data-zoom-image="'+productImageUrl+'">';
                  imageGallaryHtml += '<img data-orig-img-default="'+productImageUrl+'" src="'+productImageUrl+'" class="clr_default" alt="product-image"/></a><input type="hidden" id="var_img_clr_id" value="clr_default"/></div>';
                  // console.log("imageGallaryHtml",imageGallaryHtml);
    		          if(productDetails.images != undefined){
    		            $.each(productDetails.images[0].images, function(index, element) {
    		              var imageUrl = project_settings.product_api_image_url+productDetails.supplier_id+'/'+element.web_image;
    		              var color = element.color;
    		               color = color.toLowerCase().replace(/\s/g, '-');
    		               imageGallaryHtml += '<div class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_'+color+'_link" data-zoom-image="'+imageUrl+'">';
    		               imageGallaryHtml += '<img data-orig-img-'+color+'="'+imageUrl+'" src="'+imageUrl+'" class="clr_'+color+'" alt="product-image"/></a><input type="hidden" id="var_img_clr_id" value="clr_'+element.color+'"/></div>';
    		            });
    		          }
                  $(".js-image-gallery").html(imageGallaryHtml);

                     if(productDetails.pricing != undefined){
                     let priceRang = '';
    		             $.each(productDetails.pricing, function(index,element){
                             if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                                  $.each(element.price_range,function(index,element2){
                                    // console.log("in each condition");
                                    if(element2.qty.lte != undefined){
                                       priceRang += '<div class="item"><div class="table-heading">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content">' + '$ ' + element2.price + '</div></div>';
                                     }
                                     else
                                     {
                                     	priceRang += '<div class="item"><div class="table-heading">'+ element2.qty.gte + '+' + '</div><div class="table-content">' + '$ ' + element2.price + '</div></div>';
                                     }
                                  	});
                                  $("#js-qty").html(priceRang);
                             }
    		             });
                         $('#js-qty').addClass('quantity-table-col');
    		        }


                if(typeof productDetails.attributes.colors != undefined && productDetails.attributes.colors != '' && productDetails.attributes.colors != null){
                	
                  var listHtmlColor1 = '';
                  var productHtmlColor = '';
                  let listHtmlColor = $('.js-color-owl').html();
                  $('#js_request_quote_qty_box').html('');
                  $.each(productDetails.attributes.colors, function(index_color,element_color){
                     let colorVal = element_color.toLowerCase();
                     colorVal = colorVal.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'').toLowerCase();
                     listHtmlColor1 = listHtmlColor.replace('#data.colorList#',element_color);
                     listHtmlColor1 = listHtmlColor1.replace(/#data.colorID#/g,colorVal);
                     listHtmlColor1 = listHtmlColor1.replace(/#data.colorVal#/g,element_color);
                     productHtmlColor +=listHtmlColor1;
                     $(".js-color-owl").html(productHtmlColor);
                  });
                  $(".js-color-owl").addClass('color-slider');
                  $(".color-slider").owlCarousel({
                        stopOnHover : true,
                        mouseDrag:false,
                        navigation:true,
                        items :20,
                        itemsDesktop: [1199, 20],
                        itemsDesktopSmall: [979,22],
                        itemsTablet: [700, 15],
                        itemsMobile: [479, 12]
                    });
                }
                else
                {
                	// Removing Porduct Color Selection Section as Product Data Doesnt Have Any Color Details
                	$('.js-product-color-container').remove();
                	console.log('Removing \'Porduct Color Selection\' Section as Product Data Doesnt Have Any Color Details');
                }

                // product print position
                var value_split_method = [];
                 if(typeof productDetails.imprint_data == undefined){
                   document.getElementById('decoration-Decoration-Print-position').style="display: none";
                 }

                  if(typeof productDetails.imprint_data != undefined && productDetails.imprint_data != '' && productDetails.imprint_data != null){
                	 
                    var imprint_pos = '';
                    $.each(productDetails.imprint_data, function(index_imprint,element_imprint){
                      imprint_method_select = productDetails.imprint_data;
                      let imprint_values = element_imprint.imprint_position;
                      let value_split1 = imprint_values.split("|");
                      for(var i=0 ; i<value_split1.length;i++){
                        if($.inArray(value_split1[i],value_split) == -1){
                          value_split.push(value_split1[i]);
                        }
                      }
                      
                      // Imprint Method Section Started                      
                      /*if(typeof element_imprint.imprint_method != undefined)
                      {
                    	  let imprintMethodHtml = '<li><div class="radio-box"><input name="#data.imprintMethodInputName#" id="#data.imprintMethodId#" value="None" type="radio" /><label for="#data.imprintMethodId#">#data.imprintMethodName#</label></div></li>';
                    	  imprintMethodHtml = imprintMethodHtml.replace(/#data.imprintMethodInputName#/g,'imprint-method-'+index_imprint)
                    	  imprintMethodHtml = imprintMethodHtml.replace(/#data.imprintMethodId#/g,element_imprint.imprint_method.replace(/ /g,'-').toLowerCase())
                    	  imprintMethodHtml = imprintMethodHtml.replace(/#data.imprintMethodName#/g,element_imprint.imprint_method)
                    	  $('.js-imprint-methods').append(imprintMethodHtml)
                      }*/
                      // Imprint Method Section Ended
                    });

                    let listHtmlPrintPos1 = '';
                    let productHtmlPrintPos = '';
                    listHtmlPrintPos = $('.print-checkbox').html();
                    $('.print-checkbox').html('')
                    $('#js_imprint_request_quote').html('');
                    $.each(value_split,function(index_split,element_split){
                      printVal = replaceWithUnderscore(element_split);
                      listHtmlPrintPos1 = listHtmlPrintPos.replace('#data.printPosition#',element_split);
                      listHtmlPrintPos1 = listHtmlPrintPos1.replace('#data.printPositionId#',printVal);
                      listHtmlPrintPos1 = listHtmlPrintPos1.replace('#data.printPositionVal#',element_split);
                      listHtmlPrintPos1 = listHtmlPrintPos1.replace('#data.printPositionIdFor#',printVal);
                      productHtmlPrintPos +=listHtmlPrintPos1;
                    //  imprint_pos +=  '<div> <input class="css-checkbox js_add_imprint_location_request_quote" name="imprint_area" id="'+ printVal +'" type="checkbox" value="'+element_split+'" data-product-id="8679" onchange="print_pos(this,imprint_method_select,printPosInnerHtml)"/> <label class="css-label font-style-normal" for="'+printVal+'">'+element_split+'</label></div>'
                    });
                    $(".print-checkbox").html('<li>Imprint Position:</li>'+productHtmlPrintPos);
                }
              else
        	  {
            	  // Removing Imprint Method Section as Product Data Doesnt Have Any Imprint Method Details
            	  $('.js-imprint-method-container').remove()
              	  console.log('Removing \'Imprint Method\' Section as Product Data Doesnt Have Any Imprint Method Details');
        	  }
                // Request info section

                if($("#js_tab_list").find("li.active").find('a').attr("href") == "#js-request-info"){
                    let formId = $(".request-tab-content").find(".tab-pane.active").find("form").attr("id");
                    $("#"+formId+"_product_id").val(pid);
                    $("#"+formId+"_api_url").val(project_settings.product_api_url);
                    // $("#"+formId+"_api_token").val(project_settings.product_api_token);
                    $(".request-tab-content").find("#js-place-order").addClass("hide");
                }
                
                
                //Shipping Section
                let shippigCounter = parseInt($(".js_request_quote_shipping_counter").val());
                if(shippigCounter <= 0 ){
                    $(".shipping-method #js_shipping_method").addClass("hide");
                }

                $(".js_select_shipping_type").on("click",function(){
                    if (user_id == null ) {
                      //window.location = 'login.html';
                      $(".header-login-text a.dropdown-toggle").trigger('click')
                      return false;
                    }
                    // let colors_qty = [];
                    //
                    // $('.js_color_checkbox:checked').each(function() {
                    //     let color_name = $(this).attr('id');
                    //     let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
                    //     if(qty == 0){
                    //       showErrorMessage("Please enter quantity.")
                    //       return false;
                    //     }
                    //     colors_qty[color_name] = qty;
                    //     colors_qty.push({color_name:qty})
                    // });
                    let colors_qty = {};
                    $('.js_color_checkbox:checked').each(function() {
                        let colorName = $(this).val();
                        let color_name = $(this).attr('id');
                        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
                        if(qty == 0){
                              showErrorMessage("Please enter quantity.")
                              return false;
                        }
                        colors_qty[colorName] = qty;
                    });

                    if(colors_qty.length == 0){
                      showErrorMessage("Please select color.")
                      return false;
                    }

                    shippigCounter = 0
                    shippigCounter = shippigCounter+1;

                    $(".js_request_quote_shipping_counter").val(shippigCounter);
                    let colorQtyHtml = $(".js_shipping_qty_box_main").html();
                    let replaceQtyHtml = '';
                    $.each(colors_qty,function(key,value){
                      colorQtyHtml1 = colorQtyHtml.replace(/#data.color#/g,key)
                      colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,value)
                      replaceQtyHtml += colorQtyHtml1
                    })
                    $(".js_shipping_qty_box_main").html(replaceQtyHtml);
                    let shippingAddressHml = $(".shipping-method #js_shipping_method").html();
                    shippingAddressHml = shippingAddressHml.replace(/#data.counter#/g,shippigCounter);
                    $(".shipping-method #js_shipping_method").html(shippingAddressHml)
                    let addressBookHtml = $("#js_shipping_addresses_"+shippigCounter+" p").html();

                    $(".shipping-method #js_shipping_method").removeClass("hide");

                    if ($(".auto_complete_shipping_email").length > 0)
                  	{
                  		var ShipAddUrl = project_settings.address_book_api_url+'?address_type=shipping&user_id='+user_id+'&deleted_at=false&is_address=1';
                  		$(".auto_complete_shipping_email").typeahead({
                  			name : 'sear',
                  			display:'value',
                  			minLength: 2,
                  			limit: 10,
                  			remote: {
                  			url : ShipAddUrl+'&email=%QUERY',
                  				filter: function (data) {
                  					if(user_id == null){
                              window.location = "login.html";
                              return false;
                  					}
                  					return $.map(data.data, function (data) {
                  						return {
                  							id: data.id,
                  							value: data.name+' ( '+data.email+' ) '
                  							};
                  					});
                  				}
                  			}
                  		}).on('typeahead:selected', function (obj, datum) {
                    			let counter = $(obj.currentTarget).data('counter');
                    			let addressBookId = datum.id;
                          axios({
                              method: 'GET',
                              url: project_settings.address_book_api_url+'/'+addressBookId,
                              headers: {'Authorization': project_settings.product_api_token},
                            })
                          .then(response => {
                              if(response.data != undefined ){
                                  let returnData = response.data;
                                  let replaceAddressHtml = '';
                                  replaceAddressHtml += returnData.name+"<br>";
                                  replaceAddressHtml += returnData.email+"<br>";
                                  replaceAddressHtml += returnData.street1+"<br>,";
                                  if(returnData.street2 != undefined){
                                    replaceAddressHtml += returnData.street2+"<br>";
                                  }
                                  replaceAddressHtml += returnData.city+",";
                                  replaceAddressHtml += returnData.state+",";
                                  if(returnData.postalcode != undefined ){
                                    replaceAddressHtml += returnData.postalcode+",";
                                  }
                                  replaceAddressHtml += returnData.country+"<br>";
                                  if(returnData.phone != undefined ){
                                    replaceAddressHtml += "T: "+returnData.phone+",<br>";
                                  }
                                  if(returnData.mobile != undefined ){
                                    replaceAddressHtml += "M: "+returnData.mobile+"<br>";
                                  }
                                  replaceAddressHtml += '<input name="shippingAddressId_'+shippigCounter+'" id="shippingAddressId_'+shippigCounter+'" value="'+returnData.id+'" type="hidden">';
                                  if(addressBookHtml.indexOf("#data.address#")!= -1){
                                      addressBookHtml = addressBookHtml.replace(/#data.address#/g,replaceAddressHtml);
                                      $("#js_shipping_addresses_"+shippigCounter+" p").html(addressBookHtml);
                                  }else{
                                      $("#js_shipping_addresses_"+shippigCounter+" p").html(replaceAddressHtml)
                                  }
                                  $("#js_shipping_addresses_"+shippigCounter).removeClass("hide");
                              }
                          })
                          .catch(error => {
                            // console.log('Error fetching and parsing data', error);
                          });
                  		});
                  	}
                });

                // Auto sugession for search of addressbook


                //product detail page bottom section
                // alert(productDetails.description);
				        if(typeof productDetails.description !== "undefined") {
                    $('.product_description_label').removeClass('hide');
                    $('.product_description_text').html(productDetails.description);
                }


                if(productDetails.imprint_data instanceof Array) {
                    $('.imprint-info-label').removeClass('hide');
                    imprint_method = productDetails.imprint_data[0].imprint_method;
                    imprint_position = productDetails.imprint_data[0].imprint_position;
                    ltm_charge = productDetails.imprint_data[0].ltm_charge;
                    pms_charge = productDetails.imprint_data[0].pms_charge;
                    if(typeof imprint_method !== "undefined") {
                        $('.imprint-info-text').append("<tr><td class='title'>Imprint Method : </td><td>"+imprint_method+"</td></tr>");
                    }
                    if(productDetails.attributes['imprint color'] instanceof Array) {
                        imprint_color = productDetails.attributes['imprint color'];
                        if(typeof imprint_color !== "undefined") {
                            $('.imprint-info-text').append("<tr><td class='title'>Imprint Color : </td><td>"+imprint_color.join(", ")+"</td></tr>");
                        }
                    }
                    if(typeof imprint_position !== "undefined") {
                        $('.imprint-info-text').append("<tr><td class='title'>Imprint Position : </td><td>"+imprint_position+"</td></tr>");
                    }
                    if(typeof ltm_charge !== "undefined") {
                        $('.imprint-info-text').append("<tr><td class='title'>LTM Charge : </td><td>"+ltm_charge+"</td></tr>");
                    }
                    if(typeof pms_charge !== "undefined") {
                        $('.imprint-info-text').append("<tr><td class='title'>PMS Charge : </td><td>"+pms_charge+"</td></tr>");
                    }

                }


                if(productDetails.imprint_data instanceof Array || productDetails.shipping instanceof Array) {
                    $('.product-shipping-label').removeClass('hide');
                    if(productData.hits.hits[0]._source.imprint_data instanceof Array) {
                        production_days = productDetails.imprint_data[0].production_days+" "+productDetails.imprint_data[0].production_unit;
                        setup_charge = productDetails.imprint_data[0].setup_charge;
                        if(typeof production_days !== "undefined") {
                            $('.product-shipping-text').append("<tr><td class='title'>Production Days : </td><td>"+production_days+"</td></tr>");
                        }
                        if(typeof setup_charge !== "undefined") {
                            $('.product-shipping-text').append("<tr><td class='title'>Setup Charge : </td><td>"+setup_charge+"</td></tr>");
                        }
                    }
                    if(productDetails.shipping instanceof Array) {
                        if(productDetails.shipping[0].free_on_board != undefined){
                            fob = productDetails.shipping[0].free_on_board;
                            $('.product-shipping-text').append("<tr><td class='title'>FOB : </td><td>"+fob+"</td></tr>");
                        }
                        if(productDetails.shipping[0].carton_length != undefined ){
                            carton_length = productDetails.shipping[0].carton_length+" "+productDetails.shipping[0].carton_size_unit;
                            $('.product-shipping-text').append("<tr><td class='title'>Carton Length : </td><td>"+carton_length+"</td></tr>");
                        }
                        if(productDetails.shipping[0].carton_weight != undefined){
                            carton_weight = productDetails.shipping[0].carton_weight+" "+productDetails.shipping[0].carton_weight_unit;
                            $('.product-shipping-text').append("<tr><td class='title'>Carton Weight : </td><td>"+carton_weight+"</td></tr>");
                        }
                        if(productDetails.shipping[0].shipping_qty_per_carton !=undefined){
                            shipping_qty_per_carton = productDetails.shipping[0].shipping_qty_per_carton;
                            $('.product-shipping-text').append("<tr><td class='title'>Qty Per Carton : </td><td>"+shipping_qty_per_carton+"</td></tr>");
                        }
                    }
                }


                if(productDetails.categories instanceof Array || productDetails.attributes['colors'] instanceof Array) {
                    $('.product-detail-label').removeClass('hide');
                    if(productDetails.categories instanceof Array) {
                        categories = productDetails.categories;
                        if(typeof categories !== "undefined") {
                            $('.product-detail-text').append("<tr><td class='title'>Categories : </td><td>"+categories.join(", ")+"</td></tr>");
                        }
                    }
                    if(productDetails.attributes['colors'] instanceof Array) {
                        colors = productDetails.attributes['colors'];
                        if(typeof colors !== "undefined") {
                            $('.product-detail-text').append("<tr><td class='title'>Colors : </td><td>"+colors.join(", ")+"</td></tr>");
                        }
                    }
                }

                let sectionCount = 0;
                $( "#place_order_form .js-section-number" ).each(function( index ) {
                  if($(this).closest('.panel-group').css('display') != 'none'){
                    sectionCount = sectionCount + 1;
                    $(this).prepend("<i>"+sectionCount+"</i>&nbsp;");
                  }
                });
            }
            else{
              hidePageAjaxLoading()
                // console.log("Authentication is failed to fetch product information.");
                window.location = "error404.html";
                return false;
            }
			  },
        error: function(err){
          hidePageAjaxLoading()
            // console.log("this type of url not present");
        }
    });
  }
  hidePageAjaxLoading()
  $('.ob-product-gallery .product-big-image-thumbnails').bxSlider({
        mode: 'vertical',
        slideWidth:100,
        minSlides: 2,
        pager:false,
        slideMargin:7
  });

  $('.product-gallery').zoom({ on:'click' });
  $(".product-thumb-img-anchar").on('click', function () {
        $('.product-gallery').trigger('zoom.destroy');
        var img_src = $(this).find("img").attr("src");
        $(".product-big-image").find("img").attr("src", img_src);
        $('.product-gallery').zoom({ on:'click' });
  });

    // QUANTITY PRICE TABLE START
    $(".quantity-table-col").owlCarousel({
        stopOnHover : true,
        navigation:true,
        items : 4,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 4],
        itemsTablet: [767, 2],
        itemsMobile: [479, 2]
    });
    // END QUANTITY PRICE TABLE END

    //requestInfoconsole.log("=====",user_details);

    $(document).on('click','.js_submit_info', function (e) {
            let formObj = $(this).closest('form');
            if(formObj.find("textarea[name='note']").val() == ''){
              if($(".special-instruction-textarea").find('ul').length <= 0){
                $("#js-request-info").find("textarea[name='note']").after('<ul class="red"><li>Please enter special instructions.</li></ul>');
              }
              return false;
            }
            else if(user_details == null){
              window.location = "login.html";
              return false;
            }
            showPageAjaxLoading()
            $.ajax({
                  type: 'POST',
                  url: project_settings.request_info_api_url,
                  data: {product_api_url:project_settings.product_api_url,'user_detail':user_details,'form_data':formObj.serializeFormJSON(),'culture':project_settings.default_culture,'guest_user_detail':null},
                  cache: false,
                  dataType: 'json',
                  headers: {"Authorization": project_settings.product_api_token},
                  success: function(response){
                    hidePageAjaxLoading()
                      if(response.length > 0 && response[0].id != '' ){
                          showSuccessMessage("Your request info is submitted successfully.");
                          window.location = "thankYou.html";
                          return false;
                      }else{
                        //console.log(response);
                        return false;
                      }
                  }
            });
    });

    $(document).on('click','.js-quantity-selector',function(e){
      var $button = $(this);
      var oldValue = $button.closest('.selector-quantity').find("input.selector-input").val();
      if ($button.text() == "+") {
          var newVal = parseFloat(oldValue) + 1;
      } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
              var newVal = parseFloat(oldValue) - 1;
          } else {
              newVal = 0;
          }
      }
      $button.closest('.selector-quantity').find("input.selector-input").val(newVal);
    });



    $(document).on("change",".js_color_checkbox",function(){
          let id = $(this).attr("id");

          if($('#'+id).is(":checked")) {
           Quantity = '<div class="quntity-count js_color_wise_qty" id="js_request_quote_qty_box_'+id+'"><div style="background:'+id+';" class="color-input" title="'+$(this).val()+'"></div><div class="color-name">'+id+'</div><div class="selector-quantity js-quantity-section in"><div class="selector-btn"><div class="sp-minus"><a data-multi="-1" href="javascript:void(0)" class="js-quantity-selector">-</a></div>'+
                      '<div class="selector-input"> <input type="text" value="0" class="selector-input js_request_quote_qty js_request_quote_nosize_qty" ></div><div class="sp-plus"><a data-multi="1" href="javascript:void(0)" class="js-quantity-selector">+</a></div></div><div class="clearfix"></div></div><a href="javascript:void(0)" data-toggle="tooltip" class="ui-icon-delete js_request_quote_qty_remove remove-qty" data-id="'+id+'">'+'<i class="fa fa-trash-o"></i></a></div>';
           
            $('#'+id).attr('checked',true);
            if($("#js_request_quote_qty_box").html() !=""){
              $("#js_request_quote_qty_box").append(Quantity);
            }else{
                $("#js_request_quote_qty_box").html(Quantity);
            }
            
            /* Genumark Custom Coding Started */
            
            /*let GenumarkQuantityTable = '<table width="100%" cellspacing="0" cellpadding="0" class="genumark-quantity-table"><tbody><tr><td><b>Color</b></td><td><b>Quantity</b></td><td><b>Remove</b></td></tr></tbody></table>';
            let GenumarkQuantityTableRow = '<tr id="quantity-row-#data-id#"><td><span style="background:url(images/color/1.jpg);background-color:#data-color#"></span>#data-color#</td><td class="input-col"><input value="" placeholder="Enter quantity here" type="text"></td><td class="action-button"><a href="javascript:void(0);" data-id="#data-id#" data-hover="tooltip" data-placement="right" title="" data-original-title="Delete" class="delete-icon js_request_quote_qty_remove"></a></td></tr>';
            
            	// If swatch is selected and there is no table for quantity, then place a quantity table
            	// $('.genumark-quantity-table-container')
            	if($('.genumark-quantity-table').html() == undefined)
        		{
            		$('.genumark-quantity-table-container').html(GenumarkQuantityTable)
        		}
            	
            	GenumarkQuantityTableRow = GenumarkQuantityTableRow.replace(/#data-id#/g,id)
            	GenumarkQuantityTableRow = GenumarkQuantityTableRow.replace(/#data-color#/g,id)
            	$('.genumark-quantity-table').append(GenumarkQuantityTableRow)*/
            
            /* Genumark Custom Coding Ended */
            
          }
          else{

            if($("#js_request_quote_qty_box_"+id).length > 0){
                $("#js_request_quote_qty_box_"+id).remove();
                $('#'+id).attr('checked',false);
            }
            
            /* Genumark Custom Coding Started */
            
            /*if($("#quantity-row-"+id).length > 0){
                $("#quantity-row-"+id).remove();
                $('#'+id).attr('checked',false);
                
                if($('.js_color_checkbox:checked').length <= 0)
            	{
                	// If no swatch is checked then, remove the table and table row things
                	$('.genumark-quantity-table').remove()
            	}
            }*/
            
            /* Genumark Custom Coding Ended */
          }
    });

    $(document).on("click",".js_request_quote_qty_remove",function(){
        let colorCbId = $(this).closest('a').attr("data-id");
        $("#"+colorCbId).prop("checked",false).trigger("change");
    });


    let print_pos_id;

    $(document).on("change",".js_add_imprint_location_request_quote",function(){

          print_pos_id = $(this).attr("id");
         let printPos = $(this).attr("value");
         let listHtmlPrintPosMethod1 = '';
         let productHtmlPrintPosMethod = '';
         let select_imprint_method ='<li><a>Select method</a></li>';

       if($('#'+print_pos_id).is(":checked")){
         listHtmlPrintPosMethod1 = listHtmlPrintPosMethod.replace('#data.printPositionName#',printPos);
         listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace('#printPosMethod#',print_pos_id);
         listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace('#printPosMethodId#',print_pos_id);
         productHtmlPrintPosMethod += listHtmlPrintPosMethod1;

        $.each(imprint_method_select, function(index_imprint_method,element_imprint_method){
            if(element_imprint_method.imprint_position.includes(printPos) == true){
              let dropVal;
              let printposMini;
              printposMini = replaceWithUnderscore(printPos);

              dropVal = replaceWithUnderscore(element_imprint_method.imprint_method);

              select_imprint_method += '<li id="select_method_'+dropVal+'" data-dropval="'+dropVal+'" data-printpos="'+printposMini+'" data-full-color="'+element_imprint_method.full_color+'" data-max-imprint-color="'+element_imprint_method.max_imprint_color_allowed+'" data-method="'+element_imprint_method.imprint_method+'"><a>'+ element_imprint_method.imprint_method +'</a></li>'
            }
          });

          if($("#js_imprint_request_quote").html() !=""){
                $("#js_imprint_request_quote").append(productHtmlPrintPosMethod);
                $("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
          }else{
              $("#js_imprint_request_quote").html(productHtmlPrintPosMethod);
              $("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
          }
          $("#js_imprint_request_quote_box_"+print_pos_id).find('.imprint-color-select').hide()
       }
       else{
          $("#js_imprint_request_quote_box_"+print_pos_id).remove();
       }
     });

     $(document).on("click",".js_set_selected_value li",function(){
        let thisObj = $(this);
        if ( thisObj.parent().parent().find('button').hasClass('dropdown-toggle') ){ // set button text only if it is available
         var buttonObj = thisObj.parent().parent().find('button');
         var selectedVal = thisObj.find('a').text();
         buttonObj.html(selectedVal+'<span class="caret"></span>');
         var dataAttributes = thisObj.data();
         $.each(dataAttributes,function(dataKey,dataValue){
           buttonObj.attr('data-'+dataKey,dataValue);
         });
         thisObj.parent().parent().parent().find('.dropdown_size').removeClass('open');
       }
     });

     $(document).on("click",".js_set_selected_value_col li",function(){
        let thisObj = $(this);
        let dataAttributes = thisObj.data();
        let colorHtml = "<div class='row choose-variation js_select_color_boxes'><div class='col-lg-6 col-md-6 col-sm-6 col-xs-12'><div class='print-title js_color_title pull-left' data-type='standard'>Standard</div></div></div><input type='hidden' id='js_selected_color_id_#data.printPositionName#_#data.imprintId#_#data-printColor#' value='#data.color#' data-type='standard' /><div class='relative-col'><div class='row color-selection-block selection-common-box'><div class='col-lg-6 col-md-6 col-sm-6 col-xs-12'><div class='print-title hidden-lg hidden-md hidden-sm'>Standard</div><div class='selection-color-box'><div class='dropdown dropdown_size color-select-box'><button class='btn dropdown-toggle' aria-expanded='true' data-toggle='dropdown' type='button'>Select Color <span class='caret'></span></button><ul class='dropdown-menu js_select_color_from_list js_set_selected_value' role='menu' aria-labelledby='dropdownMenu_1' data-imprint-id='#data.imprintId#' data-color-no='#data.printColor#' data-type='standard'><li data-value='#data.imprintColor#'>#data.imprintColor#</li></ul></div></div></div></div></div>";
        let replaceColorHtml = '';
        let dropDownColorHtml = '';
        let imprintData = $("#js_imprint_request_quote_box_"+dataAttributes.position).find(".js_select_method").parent('div').find("button").data();
        let imprintMethod = imprintData.dropval
        let printPosition = imprintData.printpos;
        let imprint_color_val = [];
        if(get_product_details.attributes != undefined ){
          $.each(get_product_details.attributes,function(key,val){
              key = key.replace(/ /g,"_");
              imprint_color_val[key] = val;
          })
        }

          for(let i=1;i<=dataAttributes.value;i++){
            colorHtml1 = colorHtml.replace(/#data.printPositionName#/g,printPosition)
            colorHtml1 = colorHtml1.replace(/#data.imprintId#/g,imprintMethod)
            colorHtml1 = colorHtml1.replace(/#data.printColor#/g,i)
            replaceColorHtml += colorHtml1;
          }
          $("#js_imprint_request_quote_box_"+dataAttributes.position).find(".js-color-div-append").html(replaceColorHtml)

          $.each(imprint_color_val.imprint_color,function(key,imprintColor){
            dropDownColorHtml += "<li data-value='"+imprintColor+"'><a href='javascript:void(0);'>"+imprintColor+"</a></li>"
          })
          $("#js_imprint_request_quote_box_"+dataAttributes.position).find(".js_select_color_from_list").html(dropDownColorHtml)
          $("#js_imprint_request_quote_box_"+dataAttributes.position).find('.js-color-div-append').removeClass('hide');
    });

    $(document).on("click",".js_select_color_from_list li",function(){
        let color_name = $(this).before('button').data('value');
        let color_no = $(this).parent('ul').data('color-no');
        let method_name = $(this).closest('.js-printposition-section').find('.imprint-method-select button').data('dropval');
        let position_name = $(this).closest('.js-printposition-section').find('.imprint-method-select button').data('printpos');
        $('#js_selected_color_id_'+position_name+'_'+method_name+'_'+color_no).val(color_name);
    });

     let select_how_colr = '';
     $(document).on("click",".js_select_method li",function(){
       let thisObj = $(this);
       let id = thisObj.attr("id");
       var dataAttributes = thisObj.data();
       let listHtmlPrintPosColor1 = '';
       let productHtmlPrintPosColor = '';
       let imprintColor = '';

       listHtmlPrintPosColor1 = listHtmlPrintPosColor.replace(/#data.printPosition#/g,dataAttributes.printpos);
       listHtmlPrintPosColor1 = listHtmlPrintPosColor1.replace(/#data.printMethod#/g,dataAttributes.dropval);
       listHtmlPrintPosColor1 = listHtmlPrintPosColor1.replace(/#data.maxImprintColor#/g,dataAttributes.maxImprintColor);
       productHtmlPrintPosColor += listHtmlPrintPosColor1;
        if(dataAttributes.maxImprintColor > 0){
          for(let i=1;i<=dataAttributes.maxImprintColor;i++){
             imprintColor +=  '<li data-value="'+i+'" data-position="'+dataAttributes.printpos+'"><a href="javascript:void(0)">'+i+'Colour</a></li>'
          }
          $("#js_imprint_request_quote_box_"+dataAttributes.printpos).find(".imprint-color-select").html(productHtmlPrintPosColor);
          $("#js_imprint_request_quote_box_"+dataAttributes.printpos).find(".js_set_selected_value_col").html(imprintColor);
          $("#js_imprint_request_quote_box_"+dataAttributes.printpos).find('.imprint-color-select').show();
        }else{
          $("#js_imprint_request_quote_box_"+dataAttributes.printpos).find(".imprint-color-select").html(productHtmlPrintPosColor);
        }
     });


     $('.place-order-submit').on('click',function(){
        let order_type = $('.request-tab-content li.active a').text().toLowerCase();
        if(order_type == '')
        {
        	order_type = 'Decorative';
        }

        var colors_qty = {};
        var total_qty = 0;
        $('.js_color_checkbox:checked').each(function() {
            let color_name = $(this).attr('id');
            let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
            total_qty = total_qty + qty;
            colors_qty[color_name] = qty;
        });

        var imprint_position = [];
        $('.js_add_imprint_location_request_quote:checked').each(function(i) {
            let position_name = replaceWithUnderscore($(this).val());
            let imprint_method_name = $("#js_imprint_request_quote_box_"+position_name+" .imprint-method-select button").data('dropval');
            let no_of_color = $("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").data('value');

            var selected_colors = {};
            for(var k=1;k<=no_of_color;k++) {
                selected_colors[k-1] = $('#js_selected_color_id_'+position_name+'_'+imprint_method_name+'_'+k).val();
            }

            var imprint_position_data = { 'imprint_position_name': position_name,'imprint_method_name': imprint_method_name,'no_of_color' : no_of_color,'selected_colors' : selected_colors };
            imprint_position.push(imprint_position_data);
        });

        // charges
        let total_setup_charge = calculate_setup_charge(imprint_position)
        let charges = {};
        if(total_setup_charge > 0)
        {
            charges['setup_charge'] = total_setup_charge;
        }
        // END - charges

        let special_instruction = $('#js_request_quote_instruction').val();

        var unit_price = 0;
        $('.quantity-table-disc li').each(function(i) {
            let each_qty = $(this).find(".table-heading").text();

            if(each_qty.indexOf("-") != -1) {
                let two_qty = each_qty.split("-");
                if(total_qty>=two_qty[0] && total_qty<=two_qty[1]) {
                    unit_price = parseFloat($(this).find(".table-content").text().replace(/ /g,'').replace(/\$/g,''));
                }
            }
            else if(each_qty.indexOf("+") != -1) {
                let one_qty = parseFloat(each_qty.replace(/ /g,'').replace(/\+/g,''));
                if(total_qty>one_qty) {
                    unit_price = parseFloat($(this).find(".table-content").text().replace(/ /g,'').replace(/\$/g,''));
                }
            }
        });

        let shipping_type = $('input[name=request_quote_shipping_type]:checked').val();
        let shipping_details = [];
        let shipping_counter = parseInt($(".js_request_quote_shipping_counter").val());
        for(let i = 1 ;i<=shipping_counter;i++){
          let selected_address_id = $("#js_shipping_addresses_"+i+" #shippingAddressId_"+i).val();
          let shipping_detail = {"on_hand_date":'','ship_date':'',"ship_transittime": "","shipping_carrier": "","shipping_charge": "","shipping_method": ""};
          shipping_details.push({'color_quantity':colors_qty,'shipping_from':'shipping_book','selected_address_id':selected_address_id,'shipping_detail':shipping_detail});
        }
        let shipping_method = {'shipping_detail':shipping_details,"shipping_type":shipping_type};


        if(order_type != '' && total_qty != 0 && unit_price != 0 && user_id!=null && typeof shipping_type!='undefined') {
            var data = {};

            data['type'] = 2;
            data['product_id'] = pid;
            data['user_id'] = user_id;
            data['order_type'] = order_type;
            data['color'] = colors_qty;
            data['imprint'] = imprint_position;
            data['charges'] = charges;
            data['special_instruction'] = special_instruction;
            data['total_qty'] = total_qty;
            data['unit_price'] = unit_price;
            data['shipping_method'] = shipping_method;
            // data['product_description'] = get_product_details;

            $.ajax({
            type : 'POST',
            url : project_settings.shopping_api_url,
            data : data,
            dataType : 'json',
                success : function(response_data) {
                    if(response_data.status == 200) {
                            showSuccessMessage("Product added to cart","cartPage.html");
                            return false;
                        }
                        else if(response_data.status == 400) {
                            showSuccessMessage(response_data.message);
                            return false;
                        }
                }
            });
        }
        else {
            if(user_id==null) {
                showErrorMessage('Login required.');
                return false;
            }
            else if(unit_price==0) {
                showErrorMessage('Select valid color and quantity.');
                return false;
            }
            else if(typeof shipping_type == 'undefined') {
                showErrorMessage('Select shipping method.');
                return false;
            }
            else {
                showErrorMessage('Insert required data.');
                return false;
            }
        }
    });
      /* Virtual tool */
    //   let virtualButtonHtml = $("#ob_virtual_list").html();
    //   virtualButtonHtml1 = virtualButtonHtml.replace("#data.sku#",get_product_details.sku)
    //   virtualButtonHtml1 = virtualButtonHtml1.replace("#data.spplierId#",get_product_details.supplier_id)
    //   virtualButtonHtml1 = virtualButtonHtml1.replace("#data.culture#",project_settings.default_culture)
    //   $("#ob_virtual_list").html(virtualButtonHtml1)
    //   $(".bottom-footer").after('<script type="text/javascript" src="http://virtualmarketingcart.com/js/virtualintegration.js"></script>')

});

function calculate_setup_charge(imprint_position)
{
    let setup_charge = 0;
    if(jQuery.inArray("setup_charge", project_settings.charges) !== -1)
    {
        for(imprint_position_val in imprint_position)
        {
            let imprint_data = get_product_details.imprint_data;
            for(let item in imprint_data)
            {
                let data_imprint_method = replaceWithUnderscore(imprint_data[item].imprint_method)
                let selected_imprint_method = imprint_position[imprint_position_val].imprint_method_name
                if(data_imprint_method == selected_imprint_method)
                {
					if(typeof imprint_data[item].setup_charge !== "undefined")
					{
						let replace_setup_charge = imprint_data[item].setup_charge
		                stripped = replace_setup_charge.replace(/[^0-9\.]/g, '');
		                setup_charge = setup_charge + parseFloat(stripped);
					}
                }
            }
            // console.log('imprint_position1',imprint_position[imprint_position_val].imprint_method_name);
        }
        // console.log('imprint_position',imprint_position);
    }
    return setup_charge;
}

function replaceWithUnderscore(value){
  let returnVal = value.toLowerCase();
  returnVal = returnVal.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'').toLowerCase();
  return returnVal;
}
function removeSpecialCharacters(str)
{
 str = str.replace(/[^a-zA-Z0-9\s,"-'`:&]/g, "");
 return str;
}
