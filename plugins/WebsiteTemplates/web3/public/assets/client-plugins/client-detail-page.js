var pid = getParameterByName('pid');
var cid = getParameterByName('cid');

if(pid != null) {
  var get_product_details = function () {
      var tmp = null;
      $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+"?_id="+pid,
          async: false,
          dataType: 'json',
           headers: {
                'vid' : website_settings.Projectvid.vid
            },
          success: function (data) {
              if(data.hits.hits.length > 0)
              {
                  productData = data;
                  tmp = productData.hits.hits[0]._source;
              }
          },
          error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
          },
      });
      return tmp;
    }();
  // var get_product_details = getProductDetailById(pid)

}

showPageAjaxLoading()
let activetab = '';
let activeSubtab = '';
let listHtmlPrintPosMethod = '';
let imprint_method_select;
let hasImprintData;
let shippingAddressHtmlTemplate = '';
let shippingAddressColorQtyAreaHtmlTemplate = '';
let addressBookHtmlTemplate = '';
let selectedShippingType = '';

$(document).ready( async function(){
  if(pid == null) {
      hidePageAjaxLoading();
      window.location = "error404.html";
      return false;
  }

  $('#js-request-info .js-section-number').addClass('no-tag');

  let value_split = [];
  let productData = {};

  activetab = $('.js_product_detail_tabs').find('#js_tab_list > li.active > a').attr('href');
  activeSubtab = $(activetab).find('#js_sub_tab_list > li.active > a').attr('href');
  activetab = (activeSubtab!=undefined) ? activeSubtab : activetab;

  shippingAddressHtmlTemplate = $(activetab).find(".shipping-method #js_shipping_method").html();
  shippingAddressColorQtyAreaHtmlTemplate = $(activetab).find(".js_shipping_qty_box_main").html();
  addressBookHtmlTemplate = ''

  let colors = '';
  let Quantity = '';

  // let imprint_method_select;
  // let listHtmlPrintPosMethod = '';
  listHtmlPrintPosMethod = $('#js_imprint_request_quote').html();

  let setActivetab = activetab.replace(/\#/g, '');

        // $.ajax({
			  // type: 'GET',
			  // url: project_settings.product_api_url+"?_id="+pid,
			  // async: false,
			  // dataType: 'json',
			  //  headers: {
				//     'vid' : website_settings.Projectvid.vid
				// },
			  // success: function (data) {
          // hidePageAjaxLoading();
	         // product name , sku, default images
          // if(data.hits.hits.length > 0){
          // console.log("get_product_details",get_product_details);
                  if(get_product_details == null ){
                      hidePageAjaxLoading()
                      // console.log("Authentication is failed to fetch product information.");
                      window.location = "error404.html";
                      return false;
                  }
                  // productData = data;
                  var productDetails = get_product_details;
                  // console.log("productDetails==>>",productDetails);
                	ProductName = removeSpecialCharacters(productDetails.product_name);
                	ProductImage = productDetails.default_image;
                  ProductSku = productDetails.sku;
                  hasImprintData = productDetails.imprint_data;

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
    		          // if(productDetails.images != undefined){
    		          //   // $.each(productDetails.images[0].images, function(index, element) {
                  //      for (let element of productDetails.images[0].images) {
    		          //     // var imageUrl = project_settings.product_api_image_url+productDetails.supplier_id+'/'+element.web_image;
                  //         let imageUrl = project_settings.product_api_image_url+5+'/'+element.web_image;
    		          //         let color = element.color;
                  //         color = color.toLowerCase().replace(/\s/g, '-');
                  //         imageGallaryHtml += '<div class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_'+color+'_link" data-zoom-image="'+imageUrl+'">';
                  //         imageGallaryHtml += '<img data-orig-img-'+color+'="'+imageUrl+'" src="'+imageUrl+'" class="clr_'+color+'" alt="product-image"/></a><input type="hidden" id="var_img_clr_id" value="clr_'+element.color+'"/></div>';
    		          //   }
    		          // }

                $(".js-image-gallery").html(imageGallaryHtml);

                //set dynamic id in html of place order and request quote by active tab
                let activeTabHtml = $(activetab).find(".js_set_active_tab").html()
                activeTabHtml = activeTabHtml.replace(/#activetab#/g,setActivetab)
                $(activetab).find(".js_set_active_tab").html(activeTabHtml)

		            // Product Quantity Price
    		        if(productDetails.pricing != undefined){
                     let priceRang = '';
    		             $.each(productDetails.pricing, function(index,element){
                             if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                                  $.each(element.price_range,function(index,element2){
                                    // console.log("in each condition");
                                    if(element2.qty.lte != undefined){
                                       priceRang += '<div><div class="table-heading">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                                     }
                                     else
                                     {
                                     	priceRang += '<div><div class="table-heading">'+ element2.qty.gte + '+' + '</div><div class="table-content">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                                     }
                                  	});
                                  $(".quantity-table-col").html(priceRang);
                             }
    		             });
    		        }

                // product colors
                if(productDetails.attributes.colors != undefined && productDetails.attributes.colors.length > 0) {
                    var listHtmlColor1 = '';
                    var productHtmlColor = '';
                    let listHtmlColor = $('.checkbox_colors').html();
                    if(activetab!=undefined){
                        $(activetab).find('#js_request_quote_qty_box').html('');
                    }

                    let colorsHexVal = await replaceColorSwatchWithHexaCodes(productDetails.attributes.colors,"color");
                     //console.log("colorsHexVal",colorsHexVal);
                    $.each(productDetails.attributes.colors, function(index_color,element_color){
                        let colorVal = element_color.toLowerCase();
                        colorVal = colorVal.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'').toLowerCase();
                        listHtmlColor1 = listHtmlColor.replace(/#data.colorList#/g,element_color);
                        listHtmlColor1 = listHtmlColor1.replace(/#data.colorID#/g,colorVal);
                        listHtmlColor1 = listHtmlColor1.replace(/#data.colorVal#/g,element_color);
                        listHtmlColor1 = listHtmlColor1.replace(/#data.colorHexCode#/g,element_color);
                        let element_color_style = "background-color:"+element_color+";"
                        if(colorsHexVal != null && colorsHexVal[element_color] != undefined){
                            if(typeof colorsHexVal[element_color].hexcode != 'undefined'){
                                element_color_style = "background-color:"+colorsHexVal[element_color].hexcode+";"
                            }
                            else if (typeof colorsHexVal[element_color].file != 'undefined') {
                                element_color_style = "background-image:url("+colorsHexVal[element_color].file.url+");"
                            }
                        }
                        listHtmlColor1 = listHtmlColor1.replace(/#data.colorCodeStyle#/g,element_color_style);
                        productHtmlColor += listHtmlColor1;
                        $(".checkbox_colors").html(productHtmlColor);
                    });
                  }

                // product print position
                var value_split_method = [];
                 if(hasImprintData == undefined){
                   $('#'+setActivetab+'-Print-position').hide();
                 }

                  if(productDetails.imprint_data != undefined){
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
                    });

                    let listHtmlPrintPos1 = '';
                    let productHtmlPrintPos = '';
                    listHtmlPrintPos = $(activetab).find('.print-checkbox').html();
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
                    $(".print-checkbox").html(productHtmlPrintPos);
                }

                //Shipping Section
                let shippigCounter = parseInt($(activetab+" .js_request_quote_shipping_counter").val());
                if(shippigCounter <= 0 ){
                    $(".shipping-method #js_shipping_method").addClass("hide");
                }


                //product detail page bottom section
                if(typeof productDetails.description !== "undefined" && productDetails.description != '') {
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
                    if(typeof imprint_position !== "undefined" && imprint_position != '') {
                        $('.imprint-info-text').append("<tr><td class='title'>Imprint Position : </td><td>"+imprint_position+"</td></tr>");
                    }
                    if(typeof ltm_charge !== "undefined" && ltm_charge != '') {
                        $('.imprint-info-text').append("<tr><td class='title'>LTM Charge : </td><td>"+ltm_charge+"</td></tr>");
                    }
                    if(typeof pms_charge !== "undefined" && pms_charge != '') {
                        $('.imprint-info-text').append("<tr><td class='title'>PMS Charge : </td><td>"+pms_charge+"</td></tr>");
                    }

                }


                if(productDetails.imprint_data instanceof Array || productDetails.shipping instanceof Array) {
                    $('.product-shipping-label').removeClass('hide');
                    if(productDetails.imprint_data instanceof Array) {
                        production_days = productDetails.imprint_data[0].production_days+" "+productDetails.imprint_data[0].production_unit;
                        setup_charge = productDetails.imprint_data[0].setup_charge;
                        if(typeof production_days !== "undefined" && production_days != '') {
                            $('.product-shipping-text').append("<tr><td class='title'>Production Days : </td><td>"+production_days+"</td></tr>");
                        }
                        if(typeof setup_charge !== "undefined" && setup_charge != '') {
                            $('.product-shipping-text').append("<tr><td class='title'>Setup Charge : </td><td>"+setup_charge+"</td></tr>");
                        }
                    }
                    if(productDetails.shipping instanceof Array) {
                        if(productDetails.shipping[0].free_on_board != undefined && productDetails.shipping[0].free_on_board != ''){
                            fob = productDetails.shipping[0].free_on_board;
                            $('.product-shipping-text').append("<tr><td class='title'>FOB : </td><td>"+fob+"</td></tr>");
                        }
                        if(productDetails.shipping[0].carton_length != undefined && productDetails.shipping[0].carton_length != ''){
                            carton_length = productDetails.shipping[0].carton_length+" "+productDetails.shipping[0].carton_size_unit;
                            $('.product-shipping-text').append("<tr><td class='title'>Carton Length : </td><td>"+carton_length+"</td></tr>");
                        }
                        if(productDetails.shipping[0].carton_weight != undefined  && productDetails.shipping[0].carton_weight != ''){
                            carton_weight = productDetails.shipping[0].carton_weight+" "+productDetails.shipping[0].carton_weight_unit;
                            $('.product-shipping-text').append("<tr><td class='title'>Carton Weight : </td><td>"+carton_weight+"</td></tr>");
                        }
                        if(productDetails.shipping[0].shipping_qty_per_carton !=undefined  && productDetails.shipping[0].shipping_qty_per_carton != ''){
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

                // let sectionCount = 0;
                // $( "#place_order_form .js-section-number" ).each(function( index ) {
                //   if($(this).closest('.panel-group').css('display') != 'none'){
                //     sectionCount = sectionCount + 1;
                //     $(this).prepend("<i>"+sectionCount+"</i>&nbsp;");
                //   }
                // });

                // Edit Cart Product
                if(user_details != null && cid != null)
                {
                    $.ajax({
                    type : 'GET',
                    //   url : project_settings.shopping_api_url+'/68260c4f-3c2d-442b-8949-097dc324715a',
                    url : project_settings.shopping_api_url+'/'+cid,
                    dataType : 'json',
                    success : function(response_data)
                    {
                        if (response_data!= "")
                        {
                            var colorArray = $.map(response_data.color, function(value, index) {
                                return [index];
                            });

                            // console.log(colorArray);

                            $(activetab).find(".js_color_checkbox").each(function(){
                                if($.inArray( $(this).val(), colorArray) != -1)
                                {
                                    let hexCodeBgColor = $(this).parent().attr("style");
                                    let id = $(this).attr("id");
                                    Quantity = "<div class='quntity-count js_color_wise_qty' id='js_request_quote_qty_box_"+id+"'><div class='color-input' style='"+hexCodeBgColor+"' title='"+$(this).val()+"'><br></div><div class='selector-quantity js-quantity-section'><div class='selector-btn'><div class='sp-minus'><a data-multi='-1' href='javascript:void(0)' class='js-quantity-selector'>-</a></div>"+
                                    "<div class='selector-input'> <input type='text' value='"+response_data.color[$(this).val()]+"' class='selector-input js_request_quote_qty js_request_quote_nosize_qty' ></div><div class='sp-plus'><a data-multi='1' href='javascript:void(0)' class='js-quantity-selector'>+</a></div></div><div class='clearfix'></div></div><a href='javascript:void(0)' data-toggle='tooltip' class='js_request_quote_qty_remove remove-qty' data-id='"+id+"'>"+"<i class='fa fa-trash-o'></i></a></div>";

                                    $(this).prop("checked",true);
                                    $(".js_add_imprint_location_request_quote").prop("checked",true);

                                    if($(activetab).find("#js_request_quote_qty_box").html() !=""){
                                        $(activetab).find("#js_request_quote_qty_box").append(Quantity);
                                    }else{
                                        $(activetab).find("#js_request_quote_qty_box").html(Quantity);
                                    }

                                    if($(activetab+' .js-quantity-section.collapse').length > 0 ){
                                        $(activetab+' .js-quantity-section').addClass('in');
                                        $(activetab+' .js-quantity-section').css('height','');
                                        $(activetab+' .js-quantity-section').parent().find('.js-add-class').removeClass('collapsed');
                                    }
                                }
                            });

                            $(activetab+"-Print-position-block").addClass("in");

                            $(activetab).find(".js_add_imprint_location_request_quote").each(function(){
                                $(this).prop("checked",false);
                            });

                            if(typeof response_data.imprint != "undefined")
                            {
                            for (let [i,imprint_info] of response_data.imprint.entries())
                            {
                                    let no_of_color = imprint_info.no_of_color;
                                    let print_pos_id = replaceWithUnderscore(imprint_info.imprint_position_name)//"barrel";//$(this).attr("id");
                                    // console.log(print_pos_id);
                                    $("#"+print_pos_id).prop("checked",true);

                                    let printPos = imprint_info.imprint_position_name;//"BARREL";//$(this).attr("value");
                                    // console.log(printPos);

                                    let printPosLower = replaceWithUnderscore(imprint_info.imprint_position_name);//"BARREL";//$(this).attr("value");
                                    // console.log(printPosLower);

                                    let printMethod = replaceWithUnderscore(imprint_info.imprint_method_name);//"BARREL";//$(this).attr("value");
                                    // console.log(printMethod);

                                    let listHtmlPrintPosMethod1 = '';
                                    let productHtmlPrintPosMethod = '';
                                    let select_imprint_method ='<li id="" data-dropval="" data-printpos="" data-full-color="" data-max-imprint-color="" data-method=""><a>Select method</a></li>';

                                    // select_method_digital_full_color_process
                                    if($(activetab).find('#'+print_pos_id).is(":checked")){
                                        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod.replace('#data.printPositionName#',printPos);
                                        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace('#printPosMethod#',print_pos_id);
                                        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace(/#printPosMethodId#/g,print_pos_id);
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

                                        if($(activetab).find("#js_imprint_request_quote").length!=""){
                                            $(activetab).find("#js_imprint_request_quote").append(productHtmlPrintPosMethod);
                                            $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
                                        }else{
                                            $(activetab).find("#js_imprinjs_imprint_request_quotet_request_quote").html(productHtmlPrintPosMethod);
                                            $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
                                        }
                                        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find('.imprint-color-select').hide()
                                            // alert(printPosLower)
                                        $("#js_imprint_request_quote_box_"+printPosLower).find("#select_method_"+printMethod).click();

                                        $( ".js_imprint_method_selectbox_"+printPosLower+"_"+printMethod+" ul li[data-value='"+no_of_color+"']" ).click();
                                    }
                                    else{
                                        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).remove();
                                    }
                                }
                            }

                            $(activetab).find('input[name=request_quote_shipping_type][value="'+response_data.shipping_method.shipping_type+'"]').click();//.prop("checked",true);

                            // shippigCounter = parseInt($(activetab+" .js_request_quote_shipping_counter").val());
                            // attachAutoCompleteEvent("#js_shipping_method_detail_"+shippigCounter);

                            // $(activetab).find('.auto_complete_shipping_email').typeahead('setQuery','neelpatel@officebrain.com')


                            // Shiiping Section
                            var shipping_detail = response_data.shipping_method.shipping_detail;

                            let iCnt = 2;
                            for(let shippingKey in shipping_detail)
                            {
                                if(shippingKey>0)
                                {
                                    let appendId =  iCnt-1;
                                    $('#js_shipping_method_detail_1')
                                        .clone()
                                        .attr('id', 'js_shipping_method_detail_' + iCnt)
                                        .insertAfter("#js_shipping_method_detail_"+appendId);
                                        $('#js_shipping_method_detail_' + iCnt).attr('data-shipping-counter',iCnt)
                                        $('#js_shipping_method_detail_' + iCnt+' .option-head:first').html('<a href="javascript:void(0);">Shipping Address '+iCnt+'</a><span class="js-delete-address css-delete-address pull-right">Delete</span>')
                                        iCnt = iCnt + 1;
                                }
                            }
                            $(activetab).find(".js_request_quote_shipping_counter").val(shipping_detail.length);

                            for(let shippingKey in shipping_detail)
                            {
                                var i = parseInt(shippingKey)+1;
                                var shipping_info = shipping_detail[shippingKey];

                                var addressBookId = shipping_info.selected_address_id

                                var shipping_carrier = shipping_info.shipping_detail.shipping_carrier;
                                var shipping_method = shipping_info.shipping_detail.shipping_method;
                                var ship_transittime = shipping_info.shipping_detail.ship_transittime;

                                var shipping_charge = shipping_info.shipping_detail.shipping_charge;
                                var on_hand_date = shipping_info.shipping_detail.on_hand_date;

                                setSelectedAddress(addressBookId,i);
                                let setActivetab = activetab.replace(/\#/g, '');

                                for (let color_quantity in shipping_info.color_quantity) {
                                    let color_quantity_class = replaceWithUnderscore(color_quantity)

                                    $(activetab).find("#js_shipping_method_detail_"+i).find("."+setActivetab+"_"+color_quantity_class).find(".js_request_quote_shipping_qty_box").val(shipping_info.color_quantity[color_quantity]);

                                    $(activetab).find("#js_shipping_method_detail_"+i).find("."+setActivetab+"_"+color_quantity_class).find("total").html(shipping_info.color_quantity[color_quantity]);

                                    // alert(shipping_info.color_quantity[color_quantity]);
                                }

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_request_quote_shipping_qty_box").val();

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").attr('data-value',shipping_carrier);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").html('<span class="imprint-lbl-method">'+shipping_carrier.toUpperCase()+'</span> <span class="caret"></span>');

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-value',shipping_charge);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").html('<span class="imprint-lbl-method">'+shipping_method+' '+shipping_charge+'</span> <span class="caret"></span>');

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-service',shipping_method);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shipmethod_ul").html('<li data-service="'+shipping_method+'" data-value="'+shipping_charge+'" data-transit-time="'+ship_transittime+'"><a href="javascript:void(0)">'+shipping_method+' '+shipping_charge+'</a></li>');

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").attr("id",setActivetab+"_datetimepicker"+i);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").datepicker({
                                    changeMonth: true,
                                    changeYear: true,
                                    format: 'mm/dd/yyyy',
                                    minDate: new Date(),
                                    onSelect: function(dateText, inst) {
                                        let date = $(this).val();
                                        $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").val(date);
                                    }
                                });

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").datepicker('setDate', on_hand_date);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shipmethod_ul li:first").click();
                                attachShippingDetailChangeEvent()
                            }
                            // END - Shipping Section


                            $(activetab).find("#js_request_quote_instruction").val(response_data.special_instruction);
                        }
                    }
                    })
                }
                // END - Edit Cart Product

                $('.js-hide-div').removeClass("js-hide-div");
                setTimeout(loadBxSlider(),5000)
			  // },
        // error: function(err){
        //   hidePageAjaxLoading()
        //     // console.log("this type of url not present");
        // }
    // });
   hidePageAjaxLoading()

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

    $(document).on('click','.js_submit_info', async function (e) {
            let formObj = $(this).closest('form');
            let product_data = await getProductDetailById(pid)
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
                  // data: {product_api_url:project_settings.product_api_url,'user_detail':user_details,'form_data':formObj.serializeFormJSON(),'culture':project_settings.default_culture,'guest_user_detail':null,"website_id":"bb1e5568-f907-4583-9259-42019a2352cc"},
                  data: {'product_id':pid,'product_data':product_data,'user_detail':user_details,'form_data':formObj.serializeFormJSON(),'culture':project_settings.default_culture,'guest_user_detail':null,"website_id":website_settings['projectID'],"websiteName":website_settings['websiteName'],"owner_id":website_settings['UserID']},
                  cache: false,
                  dataType: 'json',
                  headers: {"vid": website_settings.Projectvid.vid},
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
      let newVal = '';
      let $button = $(this);
      let oldValue = $button.closest('.selector-quantity').find("input.selector-input").val();
      if ($button.text() == "+") {
          newVal = parseFloat(oldValue) + 1;
      } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
              newVal = parseFloat(oldValue) - 1;
          } else {
              newVal = 0;
          }
      }
      $button.closest('.selector-quantity').find("input.selector-input").val(newVal);
      $(activetab + ' .js-quantity-section .js_request_quote_nosize_qty').trigger('blur');
    });

     $(document).on("click",".js_set_selected_value li",function(){
        let thisObj = $(this);
        if ( thisObj.parent().parent().find('button').hasClass('dropdown-toggle') ){ // set button text only if it is available
         let buttonObj = thisObj.parent().parent().find('button');
         let selectedVal = thisObj.find('a').text();
         buttonObj.html('<span class="imprint-lbl-method">'+selectedVal+'</span><span class="caret"></span>');
         let dataAttributes = thisObj.data();
         $.each(dataAttributes,function(dataKey,dataValue){
           buttonObj.attr('data-'+dataKey,dataValue);
         });
         thisObj.parent().parent().parent().find('.dropdown_size').removeClass('open');
       }
     });

     $(document).on("click",".js_set_selected_value_col li",async function(){
        let thisObj = $(this);
        let dataAttributes = thisObj.data();
        let parentObj = thisObj.closest("#js_imprint_request_quote_box_"+dataAttributes.position)
        let colorHtml = "<div class='row choose-variation js_select_color_boxes'><div class='col-lg-6 col-md-6 col-sm-6 col-xs-12'><div class='print-title js_color_title pull-left' data-type='standard'>Standard</div></div></div><input type='hidden' id='js_selected_color_id_#data.printPositionName#_#data.imprintId#_#data-printColor#' data-type='standard' /><div class='relative-col'><div class='row color-selection-block'><div class='col-lg-6 col-md-6 col-sm-6 col-xs-12'><div class='print-title hidden-lg hidden-md hidden-sm'>Standard</div><div class='selection-color-box'><i class='select-color-icon'></i><div class='dropdown dropdown_size color-select-box'><button class='btn dropdown-toggle' aria-expanded='true' data-toggle='dropdown' type='button'>Select Color <span class='caret'></span></button><ul class='dropdown-menu js_select_color_from_list js_set_selected_value' role='menu' aria-labelledby='dropdownMenu_1' data-imprint-id='#data.imprintId#' data-color-no='#data.printColor#' data-type='standard'><li data-value='#data.imprintColor#'>#data.imprintColor#</li></ul></div></div></div></div></div>";
        let replaceColorHtml = '';
        let dropDownColorHtml = '';
        let imprintData = parentObj.find(".js_select_method").parent('div').find("button").data();
        let imprintMethod = imprintData.dropval
        let printPosition = imprintData.printpos;
        let imprint_color_val = [];
        if(get_product_details.attributes != undefined ){
          $.each(get_product_details.attributes,function(key,val){
              key = key.replace(/ /g,"_");
              imprint_color_val[key] = val;
          })
        }

          //imprint_color_val.imprint_color = ["Process Blue","Reflex Blue","Pantone Yellow","Pms 340","Pms 354","Pantone Orange","Pantone Purple"] // Static imprint color

          for(let i=1;i<=dataAttributes.value;i++){
            colorHtml1 = colorHtml.replace(/#data.printPositionName#/g,printPosition)
            colorHtml1 = colorHtml1.replace(/#data.imprintId#/g,imprintMethod)
            colorHtml1 = colorHtml1.replace(/#data.printColor#/g,i)
            replaceColorHtml += colorHtml1;
          }
          parentObj.find(".js-color-div-append").html(replaceColorHtml)

          let imprintColorsHexVal = await replaceColorSwatchWithHexaCodes(imprint_color_val.imprint_color,"imprintcolor");
          // console.log("imprintColorsHexVal",imprintColorsHexVal);
          $.each(imprint_color_val.imprint_color,function(key,imprintColor){
            let imprintColorHexKey = imprintColor
            if(imprintColorsHexVal != null && imprintColorsHexVal[imprintColor] != undefined ){
                if(typeof imprintColorsHexVal[imprintColor].hexcode != 'undefined'){
                    imprintColorHexKey = imprintColorsHexVal[imprintColor].hexcode
                }
            }
            dropDownColorHtml += "<li data-value='"+imprintColor+"' data-printpos='"+dataAttributes.position+"'><a href='javascript:void(0);'><span style='background-color:"+imprintColorHexKey+";'></span>"+imprintColor+"</a></li>"
          })
          parentObj.find(".js_select_color_from_list").html(dropDownColorHtml)
          parentObj.find('.js-color-div-append').removeClass('hide');
    });

    $(document).on("click",".js_select_color_from_list li",function(){
        let color_name = $(this).parent().parent().find('button').data('value');
        let color_no = $(this).parent('ul').data('color-no');
        let print_pos = $(this).data("printpos")
        let parentObj = $(this).closest('#js_imprint_request_quote_box_'+print_pos)
        let method_name = parentObj.find('.imprint-method-select button').data('dropval');
        let position_name = parentObj.find('.imprint-method-select button').data('printpos');
        parentObj.find('#js_selected_color_id_'+position_name+'_'+method_name+'_'+color_no).val(color_name);
    });

     let select_how_colr = '';
     $(document).on("click",".js_select_method li",function(){
       let thisObj = $(this);
       let id = thisObj.attr("id");
       let dataAttributes = thisObj.data();
       let parentObj = thisObj.closest("#js_imprint_request_quote_box_"+dataAttributes.printpos)
       let listHtmlPrintPosColor = parentObj.find('.imprint-color-select').html();
       let listHtmlPrintPosColor1 = '';
       let productHtmlPrintPosColor = '';
       let imprintColor = '';

       listHtmlPrintPosColor1 = listHtmlPrintPosColor.replace(/#data.printPosition#/g,dataAttributes.printpos);
       listHtmlPrintPosColor1 = listHtmlPrintPosColor1.replace(/#data.printMethod#/g,dataAttributes.dropval);
       listHtmlPrintPosColor1 = listHtmlPrintPosColor1.replace(/#data.maxImprintColor#/g,dataAttributes.maxImprintColor);
       productHtmlPrintPosColor += listHtmlPrintPosColor1;
        if(dataAttributes.maxImprintColor > 0) {
            for(let i=1;i<=dataAttributes.maxImprintColor;i++){
                imprintColor +=  '<li data-value="'+i+'" data-position="'+dataAttributes.printpos+'"><a href="javascript:void(0)">'+i+'Color</a></li>'
            }
            parentObj.find(".imprint-color-select").html(productHtmlPrintPosColor);
            parentObj.find(".js_set_selected_value_col").html(imprintColor);
            parentObj.find('.imprint-color-select').show();
        }
        else {
            parentObj.find(".imprint-color-select").html(productHtmlPrintPosColor);
        }
        parentObj.append("<input type='hidden' id='js_max_selection_color_"+dataAttributes.printpos+"' value='"+dataAttributes.maxImprintColor+"'>")
     });

      /* Virtual tool */
      let virtualButtonHtml = $("#ob_virtual_list").html();
      virtualButtonHtml1 = virtualButtonHtml.replace("#data.sku#",get_product_details.sku)
      // virtualButtonHtml1 = virtualButtonHtml1.replace("#data.spplierId#",get_product_details.supplier_id)
      virtualButtonHtml1 = virtualButtonHtml1.replace("#data.spplierId#",5)
      virtualButtonHtml1 = virtualButtonHtml1.replace("#data.culture#",project_settings.default_culture)
      $("#ob_virtual_list").html(virtualButtonHtml1)
      $(".bottom-footer").after('<script type="text/javascript" src="http://virtualmarketingcart.com/js/virtualintegration.js"></script>')

      $('.place-order-submit,.request-quote-submit').on('click', async function(event){
          showPageAjaxLoading()
          let ordertab = $(this).attr('data-attr');
          let colors_qty = {};
          let total_qty = 0;
          $(activetab+' .js_color_checkbox:checked').each(function() {
              let color_name = $(this).attr('id');
              let colorName = $(this).val();
              let qty = parseInt($(activetab).find("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
              total_qty = total_qty + qty;
              colors_qty[colorName] = qty;
          });
          //console.log("colors_qty+++++++++++",colors_qty);

          let imprint_position = [];
          $(activetab+' .js_add_imprint_location_request_quote:checked').each(function(i) {
              let positionName = $(this).val()
              let position_name = replaceWithUnderscore($(this).val());
              let imprint_method_name = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-method-select button").data('dropval');
              let imprintMethodName = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-method-select button").data('method');
              let no_of_color = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").data('value');

              var selected_colors = {};
              for(var k=1;k<=no_of_color;k++) {
                  let selectedColor = $(activetab).find('#js_selected_color_id_'+position_name+'_'+imprint_method_name+'_'+k).val()
                  if(selectedColor != "") selected_colors[k-1] = selectedColor
              }

              var imprint_position_data = { 'imprint_position_name': positionName,'imprint_method_name': imprintMethodName,'no_of_color' : no_of_color,'selected_colors' : selected_colors };
              imprint_position.push(imprint_position_data);
          });
          // console.log("imprint_position",imprint_position);

          // charges
          let total_setup_charge = calculate_setup_charge(imprint_position)
          let charges = {};
          if(total_setup_charge > 0)
          {
              charges['setup_charge'] = total_setup_charge;
          }
          // END - charges
          let special_instruction = $(activetab).find('#js_request_quote_instruction').val();
          let unit_price = 0;
          $(activetab).find('.quantity-table-disc li').each(function(i) {
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

          let shipping_type = $(activetab).find('input[name=request_quote_shipping_type]:checked').val();
          let shipping_details = [];
          let shipping_counter = parseInt($(activetab+" .js_request_quote_shipping_counter").val());
          for(let i = 1 ;i<=shipping_counter;i++){
              let selected_address_id = $(activetab).find("#js_shipping_method_detail_"+i+" .js_shipping_addresses .shippingAddressId ").val();
              let shipping_address = ''
              // if(selected_address_id == undefined)
              // {
              //     hidePageAjaxLoading()
              //     showErrorMessage("Please Select Shipping Address.")
              //     return false;
              // }else{

                  if(selected_address_id != undefined) shipping_address = await returnshippingData(selected_address_id);
              // }
              // alert($(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").length)
              let shipping_carrier = $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").attr('data-value');

              if (typeof shipping_carrier === typeof undefined ) {
                  shipping_carrier = "";
              }

              let get_shipping_charge = $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-value');

              if (typeof get_shipping_charge === typeof undefined ) {
                  get_shipping_charge = "";
              }

              let get_transittime = $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-transittime');

              if (typeof get_transittime === typeof undefined ) {
                get_transittime = "";
              }

              let get_shipping_method = $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-service');

              if (typeof get_shipping_method === typeof undefined ) {
                  get_shipping_method = "";
              }

              let shipping_colors_qty = {};
              $(activetab+" #js_shipping_method_detail_"+i+" .js_shipping_qty_box_main .js_rq_shipping_quantity ").each(function() {
            	  let colorName = $(this).data('color-id');
            	  let qty = $(this).find(".js_request_quote_shipping_qty_box").val();
            	  shipping_colors_qty[colorName] = qty;
	          });
              // js_shipping_qty_box_main

              let get_in_hand_date = $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").val();

              let user_shipping_address = (ordertab !== 'place-order' && shipping_address!=='') ? shipping_address : '';

              let shipping_detail = {"on_hand_date":get_in_hand_date,'ship_date':'',"ship_transittime": get_transittime,"shipping_carrier": shipping_carrier,"shipping_charge": get_shipping_charge,"shipping_method": get_shipping_method};
              shipping_details.push({'color_quantity':shipping_colors_qty,'shipping_from':'shipping_book','selected_address_id':selected_address_id,'shipping_detail':shipping_detail,'shipping_address':user_shipping_address});
          }
          let shipping_method = ''
          if(shipping_details.length > 0 || shipping_type != undefined ) shipping_method = {'shipping_detail':shipping_details,"shipping_type":shipping_type};

          let data = {};
          data['product_id'] = pid;
          data['user_id'] = user_id;
          data['color'] = colors_qty;
          data['imprint'] = imprint_position;
          data['charges'] = charges;
          data['special_instruction'] = special_instruction;
          data['total_qty'] = total_qty;
          data['unit_price'] = unit_price;
          data['shipping_method'] = shipping_method;
          data['website_id'] = website_settings['projectID'];

          let validateData = validateForm(data,activetab)
          // console.log("validateData",validateData);
          if(validateData.status == "error"){
              hidePageAjaxLoading()
              // console.log("validateData",validateData);
              $(activetab+' .js-section-errors').remove();
              $.each(validateData.error_data,function(section,flds){
            	  let jquery_section = ' .js-'+section+'-section';
            	  if(section.indexOf('shippingMethod-') >= 0)
            	  {
            		  let counter = section.replace('shippingMethod-','');
            		  jquery_section = ' #js_shipping_method_detail_'+counter+' .js-shippingMethod-section';
            	  }
            	  else if(section.indexOf('shippingMethod') >= 0)
            	  {
            		  jquery_section = ' .js-shippingMethod-section:first';
            	  }
                  if($(activetab+jquery_section)){
                    //console.log("flds",flds);
//                    console.log("section",section);
                      if( $(activetab+jquery_section).parents('.product-section-box').find('.collapse') ){
                          $(activetab+jquery_section).parents('.product-section-box').find('.collapse').addClass('in');
                      }
                      // console.log("section",section);
                      // console.log("flds",flds);
                      switch (section) {
                        case 'quantity':
                          if(typeof flds == 'object'){
                            $.each(flds, function( field, value) {
                              field = replaceWithUnderscore(field)
                              $(activetab+' .js-add-class').addClass('collapsed');
                              let setActivetab = activetab.replace(/\#/g, '');
                              $(activetab+' #js_request_quote_qty_box_'+setActivetab+'_'+field+jquery_section).append('<div class="red js-section-errors">'+value+'</div>');
                            });
                          }else{
                            $("#"+setActivetab+"-Quantity-block").append('<div class="red js-section-errors">'+flds+'</div>')
                          }

                          break;
                        default:
                          $.each(flds, function( field, value) {
                            $(activetab+jquery_section).append('<div class="red js-section-errors clearfix">'+value+'</div>');
                          });
                      }
                  }
              })

              $('html, body').animate({
                    scrollTop: ($('.js-section-errors:first').offset().top - 500)
              }, 2000);

          }else{
              if(ordertab == 'place-order'){
                  let order_type = $('#js_sub_tab_list li.active a').text().toLowerCase();
                  data['type'] = 2;
                  data['order_type'] = order_type;

                //   return false;
                if(user_details != null && cid != null)
                {
                    data['id'] = cid;
                    var ajaxType = 'PUT';
                    var ajaxURL = project_settings.shopping_api_url+'/'+cid;
                }
                else{
                    var ajaxType = 'POST';
                    var ajaxURL = project_settings.shopping_api_url;
                }

                $.ajax({
                    type : ajaxType,
                    url : ajaxURL,
                    data : data,
                    dataType : 'json',
                    success : function(response_data) {
                        if(response_data.status == 200) {
                            hidePageAjaxLoading()
                            //showSuccessMessage("Product is added to cart","cartPage.html");
                            window.location.href = "cartPage.html"
                            return false;
                        }
                        else if(response_data.status == 400) {
                            hidePageAjaxLoading()
                            showErrorMessage(response_data.message);
                            return false;
                        }
                    },
                    error : function(error) {
                        console.log('error',error)
                    }
                });
              }
              else{
                  let user_info = {};
                  user_info['id'] = user_details['_id'];
                  user_info['email'] = user_details['email'];
                  user_info['fullname'] = user_details['fullname'];
                  user_info['userEmail'] = (user_details['userEmail'])? user_details['firstname'] : '';
                  user_info['firstname'] = (user_details['firstname'])? user_details['firstname'] : '';
                  user_info['lastname'] = (user_details['lastname'])? user_details['lastname'] : '';
                  user_info['address1'] = (user_details['address1'])? user_details['address1'] : '';
                  user_info['address2'] = (user_details['address2'])? user_details['address2'] : '';
                  user_info['country'] = (user_details['country'])? await getCountryStateCityById(user_details['country'],1) : '';
                  user_info['state'] = (user_details['state'])? await getCountryStateCityById(user_details['state'],2) : '';
                  user_info['city'] = (user_details['city'])? await getCountryStateCityById(user_details['city'],3) : '';
                  user_info['postalcode'] = (user_details['postalcode'])? user_details['postalcode'] : '';
                  user_info['phone'] = (user_details['phone'])? user_details['phone'] : '';
                  user_info['mobile'] = (user_details['mobile'])? user_details['mobile'] : '';

                  data['user_info'] = user_info;
                  data['product_description'] = get_product_details;
                  data['website_id'] = website_settings['projectID'];
                  data['owner_id'] = website_settings['UserID'];
                  data['billing_info'] = await returnDefaultBillingInfo();

                  $.ajax({
                      type : 'POST',
                      url : project_settings.request_quote_api_url,
                      data : data,
                      headers: {"Authorization": userToken},
                      dataType : 'json',
                      success : function(response_data) {
                          if(response_data!= "") {
                              hidePageAjaxLoading()
                              showSuccessMessage("Request Quote Save Sucessfully","thankYou.html");
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
          }
          // console.log("data",data);
      })

      if(user_id == null){
        // if($("#js-place-order").length > 0){
        //   $("#js_tab_list li").find('a[href="#js-place-order"]').parent('li').remove()
        //   $("#js-place-order").remove()
        // }

        // if($("#js-request-quote").length > 0){
        //   $("#js_tab_list li").find('a[href="#js-request-quote"]').parent('li').remove()
        //   $("#js-request-quote").remove()
        // }

        // if($("#js-request-info").length > 0){
        //   $("#js_tab_list li").find('a[href="#js-request-info"]').parent("li").addClass("active")
        //   $("#js-request-info").addClass("in active")
        //   $("#js-request-info .no-tag").parent('div').remove();
        // }

        // $(".place-order-submit").remove();
        // $(".request-quote-submit").remove();
      }
      $('#js_tab_list li.active').trigger('click');
});

function getShippingRate(parentObj,thisObj,addressFrom,addressTo,shipping_details,shippigCounter)
{
    let qty = 0;
    let shippingaddId =0 ;
    let thisShipCounter = thisObj.closest('ul').data('shipping-counter');
    let thisRequestType = thisObj.closest('ul').data('request-type');

    let buttonObj = thisObj.parent().parent().find('button');
    let selectedVal = thisObj.find('a').text();
    let shippingMethod=thisObj.data('value');

    /*let total_qty = 0;
    $('.js_color_checkbox:checked').each(function() {
        let color_name = $(this).attr('id');
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        total_qty = total_qty + qty;
    });*/

    let total_qty = 0;
    $(activetab+" #js_shipping_method_detail_"+shippigCounter+" .js_shipping_qty_box_main .js_rq_shipping_quantity ").each(function() {
  	  total_qty = parseInt(total_qty) + parseInt($(this).find(".js_request_quote_shipping_qty_box").val());
    });

    if(total_qty >0)
    {
        userDetails = {'shipping_estimator_key':project_settings.shipping_estimator_key,'carrier_account':project_settings.carrier_account[shippingMethod],'carrier':shippingMethod,'addressFrom':addressFrom,'addressTo':addressTo,'total_qty':total_qty,'shipping_details':shipping_details};
        $.ajax({
            type: 'POST',
            url: project_settings.shipping_estimator_api_url,
            async: true,
            data:  JSON.stringify(userDetails),
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' },
            success: function (result) {
                let rateHtml = '';
                //$(parentObj).find(".js-shippingMethod-"+shippigCounter+"-section").find(".js-section-errors").remove()
                if(typeof result.data !== "undefined" && result.data != null && typeof result.data.rates !== "undefined" && result.data.rates.length>0)
                {
                    for(let ratekey in result.data.rates)
                    {
                        let rateDetails = result.data.rates[ratekey];

                        rateHtml +='<li data-service="'+rateDetails.servicelevel.name+'" data-value="'+rateDetails.amount+'" data-transit-time="'+rateDetails.estimated_days+'"><a href="javascript:void(0)">'+rateDetails.servicelevel.name+' '+rateDetails.currency+' '+rateDetails.amount+'</a></li>';
                    }
                    $(parentObj).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                }
                else{
                    rateHtml = '<li><a href="javascript:void(0)">Product shipping detail is missing</a></li>'

                    let quantity= total_qty;
                    let quantity_in_carton = shipping_details.shipping_qty_per_carton
                    if(quantity_in_carton != 0)
                    {
                        var noOfBox = Math.ceil(quantity/quantity_in_carton);
                    }

                    if(noOfBox > 50)
                    {
                        let max_qty = shipping_qty_per_carton*50;
                        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").append('<div class="red js-section-errors">Maximum '+max_qty+' quantities are allowed.</div>')
                    }
                    else{
                        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").append('<div class="red js-section-errors">Please try with less quantity.</div>')
                    }

                    /*if(result.data.address_to.validation_results.is_valid == false) {
                       $(parentObj).find(".js-shippingMethod-"+shippigCounter+"-section").append('<div class="red js-section-errors">'+result.data.address_to.validation_results.messages[0].text+'</div>')
                    }*/
                }
                $(parentObj+" .js_rq_ship_shipmethod_ul").html(rateHtml);

                // Change Shipping Details
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').trigger('click');
        		$('#js_shipping_method_detail_'+shippigCounter).find('.js_rq_ship_handdate').val('');

                hidePageAjaxLoading()
            },
            error: function(err) {
                $('.error-message').removeClass('hide');
                hidePageAjaxLoading()
            }
        });
        $(parentObj+" .js_rq_ship_shippingmethod").html('<span class="imprint-lbl-method">Select Method</span> <span class="caret"></span>');
    }
    else{
        $(parentObj+" .js_rq_ship_shipmethod_ul").html('');
        hidePageAjaxLoading()
    }
}
//END - change

function autoCounter() {
    let sectionCount = 0;
    $(activetab).find( ".js-section-number" ).each(function( index ) {
        if($(this).closest('.panel-group').css('display') != 'none'){
            sectionCount = sectionCount + 1;
            $(this).prepend("<i>"+sectionCount+"</i>&nbsp;");
        }
    });
}

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
					if(typeof imprint_data[item].setup_charge !== "undefined" && imprint_data[item].setup_charge != '')
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

// function replaceColorSwatchWithHexaCodes(attribute_value,attribute_name){
//   if(attribute_value != undefined && attribute_value.length > 0) {
//       var data = {'colorname':attribute_value};
//       //var data = {'colorname':all_colors,'skip':0,'limit':all_colors.length};
//       $.ajax({
//         type : 'GET',
//         url : project_settings.color_table_api_url+'?vid=a40c858d-42f4-4d1e-9905-42a4a81ceca5&websiteid=2cfbe41a-f320-429e-add0-f0aaa4e61cfe&attribute_name='+attribute_name,
//         data : data,
//         dataType : 'json',
//         success : function(response_data) {
//           console.log("response_data",response_data);
//           $( ".js_color_checkbox" ).each(function( index ) {
//             //var bgColor = $( this ).parent().css("background-color");
//             var bgColor = $( this ).data("hex-code");
//             var checkboxObj = $( this )
//             if(typeof response_data.data != 'undefined')
//             {
//               $.each(response_data.data, function( index, value ) {
//
//                 if(typeof value.colorname != 'undefined')
//                 {
//                   if(value.colorname.toLowerCase() == bgColor.toLowerCase())
//                   {
//                     if(typeof value.hexcode != 'undefined')
//                     {
//                         checkboxObj.attr("data-hex-code",value.hexcode)
//                         checkboxObj.parent().css('background-color',value.hexcode)
//                     }else if (typeof value.file != 'undefined') {
//                         checkboxObj.parent().css('background-color','')
//                         checkboxObj.parent().css("background-image",'url('+value.file.url+')')
//                     }
//                   }
//                 }
//               });
//             }
//           });
//         }
//       })
//     }
// }

let returnshippingData = async function(selected_address_id) {
    let shipping_address = {}
    let shipping_info_data = []
    let addressInfo = await returnAddressBookDetailById(selected_address_id)
    shipping_address['address_type'] = addressInfo.address_type
    shipping_address['name'] = addressInfo.name
    shipping_address['city'] = await getCountryStateCityById(addressInfo.city,3)
    shipping_address['country'] = await getCountryStateCityById(addressInfo.country,1)
    shipping_address['state'] = await getCountryStateCityById(addressInfo.state,2)
    shipping_address['culture'] = addressInfo.culture
    shipping_address['email'] = addressInfo.email
    if(addressInfo.mobile != "") {shipping_address['mobile'] = addressInfo.mobile}
    shipping_address['phone'] = addressInfo.phone
    shipping_address['postalcode'] = addressInfo.postalcode
    shipping_address['street1'] = addressInfo.street1
    if(addressInfo.street2 != ""){shipping_address['street2'] = addressInfo.street2}

    return shipping_address ;
}

let returnDefaultBillingInfo = async function fetchDefaultBillingInfo() {
    let returnData = null;
      await axios({
              method: 'GET',
              url: project_settings.address_book_api_url+'?address_type=billing&website_id='+website_settings['projectID']+'&user_id='+user_id+'&deleted_at=false&is_address=1&is_default=1',
          })
      .then(async response => {
            let billing_address = {}
            if(response.data.data.length > 0){
            addressInfo  = response.data.data[0]
            billing_address['address_type'] = addressInfo.address_type
            billing_address['name'] = addressInfo.name
            billing_address['city'] = await getCountryStateCityById(addressInfo.city,3)
            billing_address['country'] = await getCountryStateCityById(addressInfo.country,1)
            billing_address['state'] = await getCountryStateCityById(addressInfo.state,2)
            billing_address['culture'] = addressInfo.culture
            billing_address['email'] = addressInfo.email
            if(addressInfo.mobile != "") {billing_address['mobile'] = addressInfo.mobile}
            billing_address['phone'] = addressInfo.phone
            billing_address['postalcode'] = addressInfo.postalcode
            billing_address['street1'] = addressInfo.street1
            if(addressInfo.street2 != ""){billing_address['street2'] = addressInfo.street2}
            returnData = billing_address
            return returnData
        }
      })
      .catch({
      })
      return returnData;
}

$(document).on("click","#js_tab_list",function(){
    activetab = $(this).find('li.active > a').attr('href');
    activeSubtab = $(activetab).find('#js_sub_tab_list > li.active > a').attr('href');
    activetab = (activeSubtab!=undefined) ? activeSubtab : activetab;

    let setActivetab = activetab.replace(/\#/g, '');

    //set dynamic id in html of place order and request quote by active tab
    let activeTabHtml = $(activetab).find(".js_set_active_tab").html()
    activeTabHtml = activeTabHtml.replace(/#activetab#/g,setActivetab)
    $(activetab).find(".js_set_active_tab").html(activeTabHtml)

    let rqhtml = $(activetab+' .checkbox_colors').html();
    rqhtml = rqhtml.replace(/#data.tabID#/g, setActivetab);
    $(activetab+' .checkbox_colors').html(rqhtml);
    $(activetab).find('#js_request_quote_qty_box').html('');
    $(activetab).find(".js_color_checkbox").each(function(){
        $(this).prop("checked",false);
    });

    $(activetab).find(".js_add_imprint_location_request_quote").each(function(){
        $(this).prop("checked",false);
    });

    if(hasImprintData == undefined){
        // $(activetab).find('#decoration-Decoration-Print-position').hide();
        $('#'+setActivetab+'-Print-position').hide();
    }

    $(activetab +' .js-section-errors').remove();
    $(activetab + '.print-checkbox').html('');
    $(activetab).find('#js_imprint_request_quote').empty();
    $(activetab).find('#js_request_quote_instruction').val('');
    $(activetab).find('#js_shipping_method').addClass('hide');
    $(activetab).find('.js_select_shipping_type').prop('checked',false);
    //console.log($(activetab).find('#js_shipping_method').find(".shipping-scroll").html())
    //$(activetab).find('#js_shipping_method').find(".shipping-scroll").addClass('hide');

    if(get_product_details.attributes.colors == undefined || get_product_details.attributes.colors.length <= 0) {
        $(".checkbox_colors").html("<span class='red'>There is no color for this product.</span>");
        $("#"+setActivetab+"-Print-position-block, #"+setActivetab+"-Shipping-method-col, #"+setActivetab+" #js_request_quote_instruction").addClass('hide');
    }

    autoCounter();

});


$(document).on("click",".split-add-new-address",function(){

	/*let colors_qty = {};
    let colors_hex_code = {};
    $('.js_color_checkbox:checked').each(function() {
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        let hex_code = $(this).parent().css('background-color');
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        if(qty == 0){
              showErrorMessage("Please enter quantity.")
              return false;
        }
        colors_qty[colorName] = qty;
        colors_hex_code[colorName] = hex_code;
    });

    if(colors_qty.length == 0){
      showErrorMessage("Please select color.")
      return false;
    }

    let shippingAddressColorQtyAreaHtml = $(".js_shipping_qty_box_main").html();
    let replaceQtyHtml = '';
    $.each(colors_qty,function(key,value){
      colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,key)
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,colors_hex_code[key])
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,value)
      replaceQtyHtml += colorQtyHtml1
    })
    $(".js_shipping_qty_box_main").html(replaceQtyHtml);*/
    let shippingAddressHml = shippingAddressHtmlTemplate;

    shippigCounter = parseInt($(activetab+" .js_request_quote_shipping_counter").val());
    shippigCounter = shippigCounter+1;

    $(activetab+" .js_request_quote_shipping_counter").val(shippigCounter);

    // As this is default address, we should not have delete button for default address
    shippingAddressHml = shippingAddressHml.replace(/#data.deletebutton#/g,'<span class="js-delete-address css-delete-address pull-right">Delete</span>');

    shippingAddressHml = shippingAddressHml.replace(/#data.counter#/g,shippigCounter);
    $(activetab).find(".shipping-method #js_shipping_method").append(shippingAddressHml);

    /* Handle Colors in newly added address started */
    let colors_qty = {};
    let colors_hex_code = {};
    let colors_id_code = {};
    $(activetab+' .js_color_checkbox:checked').each(function() {
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        let hex_code = $(this).parent().attr("style");
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        if(qty == 0){
//              showErrorMessage("Please enter quantity.")
//              return false;
        }
        colors_qty[colorName] = qty;
        colors_hex_code[colorName] = hex_code;
        colors_id_code[colorName] = color_name;
    });

    if(colors_qty.length == 0){
      showErrorMessage("Please select color.")
      return false;
    }

    /* Handling colors started */
    let shippingAddressColorQtyAreaHtml = shippingAddressColorQtyAreaHtmlTemplate;
    let replaceQtyHtml = '';
    $.each(colors_qty,function(key,value){
      let alreadyAssignedQuantiy = 0;
      colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,key)
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,colors_hex_code[key])

      // Deciding the quantity for new address started
      $("."+colors_id_code[key]+" .js_request_quote_shipping_qty_box ").each(function(){
    	  alreadyAssignedQuantiy = parseInt(alreadyAssignedQuantiy) + parseInt($(this).val());
    	  remainingQuantity = (value-alreadyAssignedQuantiy);
    	  if(remainingQuantity < 0){ remainingQuantity = 0 }
      })
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,remainingQuantity)
      // Deciding the quantity for new address ended

      colorQtyHtml1 = colorQtyHtml1.replace(/#data.extraclass#/g,colors_id_code[key])
      replaceQtyHtml += colorQtyHtml1
    })
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_qty_box_main").html(replaceQtyHtml);
    /* Handling colors ended */

    /* Handle Colors in newly added address ended */

    let setActivetab = activetab.replace(/\#/g, '');
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").attr("id",setActivetab+"_datetimepicker"+shippigCounter);

    $(".js_request_quote_shipping_qty_box").removeAttr('readonly');
    attachDeleteEvent("#js_shipping_method_detail_"+shippigCounter);
    attachAutoCompleteEvent("#js_shipping_method_detail_"+shippigCounter);
});

$(document).on("change",activetab+" .js_select_shipping_type",function(){
  let setActivetab = activetab.replace(/\#/g, '');
    if (user_id == null ) {
      window.location = 'login.html';
      return false;
    }

    if($(this).val() == 'standard')
    {
        $(activetab + " .split-add-new-address").addClass('hide');
        selectedShippingType = 'standard';
    }
    else if($(this).val() == 'split')
    {
        $(activetab + " .split-add-new-address").removeClass('hide');
        selectedShippingType = 'split';
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
    let colors_hex_code = {};
    let colors_id_code = {};
    $(activetab+' .js_color_checkbox:checked').each(function() {
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        // let hex_code = $(this).parent().css('background-color');
        let hex_code = $(this).parent().attr("style");
        hex_code = hex_code.replace(/"/g, "'");
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        if(qty == 0){
//              showErrorMessage("Please enter quantity.")
//              return false;
        }
        colors_qty[colorName] = qty;
        colors_hex_code[colorName] = hex_code;
        colors_id_code[colorName] = color_name;
    });

    if(colors_qty.length == 0){
      showErrorMessage("Please select color.")
      return false;
    }

    shippigCounter = 1;

    $(activetab+" .js_request_quote_shipping_counter").val(shippigCounter);
    /*if(shippingAddressColorQtyAreaHtmlTemplate == '')
	{
    	shippingAddressColorQtyAreaHtmlTemplate = $(activetab).find(".js_shipping_qty_box_main").html();
	}

    if(shippingAddressHtmlTemplate == '')
	{
    	shippingAddressHtmlTemplate = $(activetab).find(".shipping-method #js_shipping_method").html();
	}*/

    let shippingAddressHml = shippingAddressHtmlTemplate;

    // As this is default address, we should not have delete button for default address
    shippingAddressHml = shippingAddressHml.replace(/#data.deletebutton#/g,'');

    shippingAddressHml = shippingAddressHml.replace(/#data.counter#/g,shippigCounter);
    $(activetab).find(".shipping-method #js_shipping_method").html(shippingAddressHml);

    /* Handling colors started */
    let shippingAddressColorQtyAreaHtml = shippingAddressColorQtyAreaHtmlTemplate;
    let replaceQtyHtml = '';
    $.each(colors_qty,function(key,value){
      colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,key)
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,colors_hex_code[key])
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,value)
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.extraclass#/g,colors_id_code[key])
      replaceQtyHtml += colorQtyHtml1
    })
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_qty_box_main").html(replaceQtyHtml);
    /* Handling colors ended */

    //let setActivetab = activetab.replace("#","")
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").attr("id",setActivetab+"_datetimepicker"+shippigCounter);

    if(addressBookHtmlTemplate == '')
    {
    	addressBookHtmlTemplate = $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html();
    }
    let addressBookHtml = addressBookHtmlTemplate;

    $(activetab).find(".shipping-method #js_shipping_method").removeClass("hide");

    if($(this).val() == 'standard')
    {
        $(activetab + " .split-add-new-address").addClass('hide');
        $(activetab + " .js_request_quote_shipping_qty_box").attr('readonly');
        $(activetab + " .js_request_quote_shipping_qty_box").css("cursor", "not-allowed");
    }
    else if($(this).val() == 'split')
    {
        $(activetab + " .split-add-new-address").removeClass('hide');
        $(activetab + " .js_request_quote_shipping_qty_box").removeAttr('readonly');
        $(activetab + " .js_request_quote_shipping_qty_box").css("cursor", "auto");

    }

    attachAutoCompleteEvent("#js_shipping_method_detail_"+shippigCounter);
});

// Auto sugession for search of addressbook

$(document).on("click",activetab+" .datepicker-color",function(){
    $(this).prev('input').focus()
})

$(document).on("click",activetab+" .js_rq_ship_shipmethod_ul li",function(){
     let thisObj = $(this);
     let transitTime = thisObj.data("transit-time")
    //  alert(transitTime)
     let shipCounter = thisObj.closest(".js_shipping_method_detail").data("shipping-counter")
     let parentObj = $(activetab+" #js_shipping_method_detail_"+shipCounter)
     setdate(shipCounter,parentObj,activetab,transitTime)
})

$(document).on("change",activetab + ".js_add_imprint_location_request_quote",function(){
    let print_pos_id = $(this).attr("id");
    let printPos = $(this).attr("value");
    let listHtmlPrintPosMethod1 = '';
    let productHtmlPrintPosMethod = '';
    let select_imprint_method ='<li id="" data-dropval="" data-printpos="" data-full-color="" data-max-imprint-color="" data-method=""><a>Select method</a></li>';

    if($(activetab).find('#'+print_pos_id).is(":checked")){
        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod.replace('#data.printPositionName#',printPos);
        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace('#printPosMethod#',print_pos_id);
        listHtmlPrintPosMethod1 = listHtmlPrintPosMethod1.replace(/#printPosMethodId#/g,print_pos_id);
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

        if($(activetab).find("#js_imprint_request_quote").length!=""){
            $(activetab).find("#js_imprint_request_quote").append(productHtmlPrintPosMethod);
            $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
        }else{
            $(activetab).find("#js_imprint_request_quote").html(productHtmlPrintPosMethod);
            $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find(".js_select_method").html(select_imprint_method);
        }
        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).find('.imprint-color-select').hide()
    }
    else{
        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).remove();
    }
});

function changeShippingDetails(currentAddressCounter)
{
	let currentAddressShippingCarrier = $('#js_shipping_method_detail_'+currentAddressCounter).find('.js_rq_ship_shippingcarrier .imprint-lbl-method').html();

	if(currentAddressShippingCarrier != undefined && currentAddressShippingCarrier != '')
	{
		$(activetab).find('#js_shipping_method_detail_'+currentAddressCounter+' .js_select_shipping_carrier_method li').filter('[data-value="'+(currentAddressShippingCarrier.toLowerCase())+'"]').trigger('click');

		$('#js_shipping_method_detail_'+currentAddressCounter).find('.js_rq_ship_shippingmethod').html('Select Method <span class="caret"></span>');
		$(activetab).find('#js_shipping_method_detail_'+currentAddressCounter+' .js_rq_ship_shippingmethod').trigger('click');
		$('#js_shipping_method_detail_'+currentAddressCounter).find('.js_rq_ship_handdate').val('');
	}

}
function attachShippingDetailChangeEvent()
{
	$(document).off("change", activetab + ' .js_request_quote_shipping_qty_box').on("change", activetab + ' .js_request_quote_shipping_qty_box', function(){
		let currentAddressCounter = $(this).closest('.js_shipping_method_detail').data('shipping-counter');
		changeShippingDetails(currentAddressCounter)
	});
}
$(document).on("change", activetab + ' .js_color_checkbox',function(){
    if(user_id == null) {
        window.location = "login.html";
        return false;
    }

    let id = $(this).attr("id");

    if($(this).is(":checked")) {
        // var hexCodeBgColor = $(this).parent().css('background-color');
        let hexCodeBgColor = $(this).parent().attr("style");
        // Quantity = '<div class="quntity-count js_color_wise_qty" id="js_request_quote_qty_box_'+id+'"><div class="color-input" style="'+hexCodeBgColor+'" title="'+$(this).val()+'"><br></div><div class="selector-quantity js-quantity-section"><div class="selector-btn"><div class="sp-minus"><a data-multi="-1" href="javascript:void(0)" class="js-quantity-selector">-</a></div>'+
        // '<div class="selector-input"> <input type="text" value="0" class="selector-input js_request_quote_qty js_request_quote_nosize_qty" ></div><div class="sp-plus"><a data-multi="1" href="javascript:void(0)" class="js-quantity-selector">+</a></div></div><div class="clearfix"></div></div><a href="javascript:void(0)" data-toggle="tooltip" class="js_request_quote_qty_remove remove-qty" data-id="'+id+'">'+
        // '<i class="fa fa-trash-o"></i></a></div>';

        Quantity = "<div class='quntity-count js_color_wise_qty' id='js_request_quote_qty_box_"+id+"'><div class='color-input' style='"+hexCodeBgColor+"' title='"+$(this).val()+"'><br></div><div class='selector-quantity js-quantity-section'><div class='selector-btn'><div class='sp-minus'><a data-multi='-1' href='javascript:void(0)' class='js-quantity-selector'>-</a></div>"+
        "<div class='selector-input'> <input type='text' value='0' class='selector-input js_request_quote_qty js_request_quote_nosize_qty' ></div><div class='sp-plus'><a data-multi='1' href='javascript:void(0)' class='js-quantity-selector'>+</a></div></div><div class='clearfix'></div></div><a href='javascript:void(0)' data-toggle='tooltip' class='js_request_quote_qty_remove remove-qty' data-id='"+id+"'>"+"<i class='fa fa-trash-o'></i></a></div>";

        $(this).prop("checked",true);
        if($(activetab).find("#js_request_quote_qty_box").html() !=""){
            $(activetab).find("#js_request_quote_qty_box").append(Quantity);
        }else{
            $(activetab).find("#js_request_quote_qty_box").html(Quantity);
        }

        if($(activetab+' .js-quantity-section.collapse').length > 0 ){
					$(activetab+' .js-quantity-section').addClass('in');
					$(activetab+' .js-quantity-section').css('height','');
					$(activetab+' .js-quantity-section').parent().find('.js-add-class').removeClass('collapsed');
				}

        // START -> If address is visible, if user checks one more color, then add that color with address
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        let hex_code = $(this).parent().attr("style");
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());

        let shippingAddressColorQtyAreaHtml = shippingAddressColorQtyAreaHtmlTemplate;
        let replaceQtyHtml = '';
        colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,colorName)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,hex_code)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,qty)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.extraclass#/g,id)

        $(activetab).find('.js_shipping_method_detail').each(function(i) {
        	$(this).find(".js_shipping_qty_box_main").append(colorQtyHtml1);
        	if(selectedShippingType == 'split')
        	{
        		$(this).find(".js_request_quote_shipping_qty_box").removeAttr('readonly');
        	}
        	attachShippingDetailChangeEvent();
        });
        // END -> If address is visible, if user checks one more color, then add that color with address
    }
    else{
        if($(activetab).find("#js_request_quote_qty_box_"+id).length > 0){
            $(activetab).find("#js_request_quote_qty_box_"+id).remove();
            $(this).prop("checked",false);
            $(activetab).find('.js_rq_shipping_quantity').filter('[data-color-id="'+id+'"]').remove();
            $(activetab).find('.'+id).remove();
        }
    }
});

$(document).on("click", activetab + ' .js_request_quote_qty_remove', function(){
    let colorCbId = $(this).closest('a').attr("data-id");
    $(activetab).find("#"+colorCbId).prop("checked",false).trigger("change");
});

function setdate(shipCounter,parentObj,activetab,transitTime=0){
  if($(activetab).find(parentObj).find('.shipping-datepicker').length > 0){
      let date = new Date();
      let startDate = date;
      let endDate = "";
      let count = 0;
      let noOfDaysToAdd = 0
      let setDate = "";
      if(transitTime > 0 && transitTime !=''){
          noOfDaysToAdd = noOfDaysToAdd + parseInt(transitTime);
      }

      while(count < noOfDaysToAdd){
        endDate = new Date(startDate.setDate(startDate.getDate() + 1));
        if(endDate.getDay() != 0 && endDate.getDay() != 6){
            count++;
        }
      }

      if(endDate != "")
      {
        setDate = new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate())
      }
      else{
        setDate = date
      }

      // let setActivetab = activetab.replace("#","")
      $(activetab).find(parentObj).find(activetab+"_datetimepicker"+shipCounter).datepicker("setDate", setDate);
      $(activetab).find(parentObj).find(activetab+"_datetimepicker"+shipCounter).datepicker('option', 'minDate', setDate);

  }
}

function validateForm(data,activetab){
  let requiredSection = {}
  let errorMsg = {}
  let returnData = {}
  requiredSection['color'] = "color"
  requiredSection['imprint'] = "printPosition"
  requiredSection['shipping_method'] = "shippingMethod"
  //requiredSection['special_instruction'] = "specialInstruction"

  $.each(requiredSection,function(fld,section){
      switch (section) {
          case 'color':
            let colorError = colorValidation(fld,section,data)
            if(!isEmpty(colorError)) {
                // errorMsg.push(colorError)
                for (let prop in colorError) {
                  if (colorError.hasOwnProperty(prop)) {
                    errorMsg[prop] = colorError[prop];
                  }
                }
            }
            break;
          case 'printPosition':
            let printPosError = printPosValidation(fld,section,data)
            // console.log("printPosError",printPosError);
            if(!isEmpty(printPosError)) {
              // errorMsg.push(printPosError)//errorMsg[section] = printPosError//[section]
                for (let prop in printPosError) {
                  if (printPosError.hasOwnProperty(prop)) {
                    errorMsg[prop] = printPosError[prop];
                  }
                }
            }
            break;
          case 'shippingMethod':
             let shippingError = shippingValidation(fld,section,data)
             if(!isEmpty(shippingError)) {
               //errorMsg.push(shippingError)
                 for (let prop in shippingError) {
                   if (shippingError.hasOwnProperty(prop)) {
                     errorMsg[prop] = shippingError[prop];
                   }
                 }
             }
             break;
          case 'specialInstruction':
            let dataErr = {}
            let errorLog = {}
            if(isEmpty(data[fld])){
              dataErr[fld] = "Please select special instruction."
              errorMsg[section] = dataErr
            }
      }
  })
  if(!isEmpty(errorMsg)){
      returnData["status"] = "error"
      returnData['error_data'] = errorMsg
  }else{
      returnData["status"] = "success"
  }
  // alert(activetab)
  return returnData;
}

function colorValidation(fld,section,value){
    let errorLog = {}
    let color = {}
    if(isEmpty(value[fld])){
        color[fld] = "Please select at-least one color";
        errorLog[section] = color
    }
    else if (!isEmpty(value[fld])) {
        let quantityArr = {}
        $.each(value[fld],function(colorName,quantity){
            if(quantity <= 0 || quantity == ''){
                quantityArr[colorName] = "Please enter quantity."
            }
        })
        if(!isEmpty(quantityArr)) errorLog['quantity'] = quantityArr
        else{
              let minQty = '';
              // Find Minimum Qty from price range
              $.each(get_product_details.pricing, function(index,element){
                if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                  let priceRangeArry = []
                    $.each(element.price_range,function(index,element2){
                        if(element2.qty.lte != undefined) priceRangeArry.push(parseInt(element2.qty.lte))
                        if(element2.qty.gte != undefined) priceRangeArry.push(parseInt(element2.qty.gte))
                    })
                    if(priceRangeArry != ""){
                        minQty = Math.min.apply(Math,priceRangeArry);
                    }
                }
             })

             if(minQty != "" && minQty > 0){
                if(value.total_qty < minQty){
                    errorLog['quantity'] = "Quantity should be equal to or greater than the minimum quantity."
                }
             }
        }
    }
    // console.log("errorLog - Color",errorLog);
    return errorLog
}

function printPosValidation(fld,section,value){
    let errorLog = {}
    if(hasImprintData == undefined){
        return errorLog
    }
    if(isEmpty(value[fld])){
        let printPos = {}
        printPos[fld] = "Please Select at-least one Print Position";
        errorLog[section] = printPos
    }else{
        let imprintArr = {}
        $.each(value[fld],function(key,imprint_data){
              let printPos = {}
              let print_position = replaceWithUnderscore(imprint_data.imprint_position_name)
              let maxColorSelection = $('#js_max_selection_color_'+print_position).val()
              if( imprint_data.imprint_method_name == undefined ){
                  printPos['imprint_method'] = "Please select imprint method"
                  imprintArr[section+'-'+print_position] = printPos
              }
              else if (imprint_data.no_of_color == undefined || imprint_data.no_of_color <=0 ) {
                  if(maxColorSelection > 0 ){
                      printPos['no_of_color'] = "Please select number of colors."
                      imprintArr[section+'-'+print_position] = printPos
                  }
              }
//              else if (isEmpty(imprint_data.selected_colors)) {
//                    if(maxColorSelection > 0 ){
//                        printPos['selected_colors'] = "Please select imprint color."
//                        imprintArr[section+'-'+print_position] = printPos
//                    }
//              }
        })
        if(!isEmpty(imprintArr)) errorLog = imprintArr
    }
    // console.log("errorLog print pos",errorLog);
    return errorLog
}

function shippingValidation(fld,section,value){
	/*console.log('FLD');
	console.log(fld);
	console.log('SECTION');
	console.log(section);
	console.log('VALUE');
	console.log(value);*/
  let errorLog = {}
  // console.log("value[fld]",value[fld]);
  if(isEmpty(value[fld])){
      let shippingLog = {}
      shippingLog[fld] = "Please select shipping method.";
      errorLog[section] = shippingLog
  }else{
      let shippingArr = {}
      let arrKey = 1
	  let splitShippingColorQuantity = {};

      $.each(value[fld].shipping_detail,function(key,shippingData){
          let splitShippingAddressQuantity = 0;
		  $.each(shippingData.color_quantity,function(colorkey,colorvalue){
			  splitShippingAddressQuantity = parseInt(splitShippingAddressQuantity) + parseInt(colorvalue);
			  if(splitShippingColorQuantity[colorkey] != undefined)
			  {
    			  splitShippingColorQuantity[colorkey] = parseInt(splitShippingColorQuantity[colorkey]) + parseInt(colorvalue)
			  }
			  else
			  {
				  splitShippingColorQuantity[colorkey] = parseInt(colorvalue)
			  }
		  });
      })

      if(value['color'] != undefined)
      {
    	  $.each(value['color'],function(colorkey,colorvalue){
			  if(splitShippingColorQuantity[colorkey] != undefined)
			  {
    			 if(splitShippingColorQuantity[colorkey] != colorvalue)
    			 {
    				 let shippingLog = {}
    			      shippingLog[fld] = "The total quantity of color "+colorkey+" for all split shipping address must be exact "+colorvalue;
    			      errorLog[section] = shippingLog
    			 }
			  }
		  });
      }
      console.log(errorLog);

      if(isEmpty(errorLog))
      {
          $.each(value[fld].shipping_detail,function(key,shippingData){
              let section1 = section+'-'+arrKey

              let splitShippingAddressQuantity = 0;
    		  $.each(shippingData.color_quantity,function(colorkey,colorvalue){
    			  splitShippingAddressQuantity = parseInt(splitShippingAddressQuantity) + parseInt(colorvalue);
    			  if(splitShippingColorQuantity[colorkey] != undefined)
    			  {
        			  splitShippingColorQuantity[colorkey] = parseInt(splitShippingColorQuantity[colorkey]) + parseInt(colorvalue)
    			  }
    			  else
    			  {
    				  splitShippingColorQuantity[colorkey] = parseInt(colorvalue)
    			  }
    		  });

              let shippingVal = {}
              if(!isEmpty(shippingData.color_quantity) && splitShippingAddressQuantity <= 0){
            	  shippingVal['shipping_method'] = "All colors cant not have 0 quantity in address."
                  shippingArr[section1] = shippingVal
        	  }
              else if(shippingData.selected_address_id == undefined){
                  shippingVal['selected_address_id'] = "Please select shipping address."
                  shippingArr[section1] = shippingVal
              }
              else if(!isEmpty(shippingData.shipping_detail) && shippingData.shipping_detail.shipping_carrier == ''){
                      shippingVal['shipping_carrier'] = "Select shipping carrier."
                      shippingArr[section1] = shippingVal
              }
              else if(!isEmpty(shippingData.shipping_detail) && shippingData.shipping_detail.shipping_method == '') {
                    shippingVal['shipping_method'] = "Select shipping method."
                    shippingArr[section1] = shippingVal
                  }
              else if (shippingData.shipping_detail.shipping_charge == '') {
                    shippingVal['shipping_method'] = "Select shipping method."
                    shippingArr[section1] = shippingVal
                  }
              arrKey = arrKey + 1
          })
      }

      if(!isEmpty(shippingArr)) errorLog = shippingArr
  }
  return errorLog
}

function loadBxSlider(){
  $('.ob-product-gallery .product-big-image-thumbnails').bxSlider({
        mode: 'vertical',
        slideWidth:100,
        minSlides: 2,
        pager:false,
        slideMargin:7
  });
}

$(document).on("blur", activetab + ' .js-quantity-section .js_request_quote_nosize_qty',function(){
    let colors_qty = {};
    $('.js_color_checkbox:checked').each(function() {
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        colors_qty[colorName] = qty;
    });

    $('.js_shipping_qty_box_main .js_request_quote_shipping_qty_box').each(function(i) {
    	if(selectedShippingType == 'standard')
    	{
            let colorName = $(this).closest('.js_rq_shipping_quantity').data('color-id');
            $(this).val(colors_qty[colorName]);
            // Trigger change event for updating shipping details
            $(this).trigger('change');
    	}
    });
});

function attachDeleteEvent(parentDiv){
	if ($(activetab).find(parentDiv + " .js-delete-address").length > 0){

		// Turn off old events which are attached
		$(document).off("click", activetab + ' .js-delete-address');

		// Turn on new events
		$(document).on("click", activetab + ' .js-delete-address',function(){

			let deleteConfirm = confirm("Are you sure you want to remove this address?");
			if(deleteConfirm == true)
			{
				let shippingCounter = $(activetab+" .js_request_quote_shipping_counter").val();
				let currentAddressCounter = $(this).closest('.js_shipping_method_detail').data('shipping-counter');

				// First remove the current address
				$(activetab + ' #js_shipping_method_detail_'+currentAddressCounter).remove();

				// Now shift the other addresses one step up
				for(i=(currentAddressCounter+1);i<=shippingCounter;i++)
				{
					$(activetab + ' #js_shipping_method_detail_'+i).attr('id','js_shipping_method_detail_'+(i-1))
					$(activetab + ' #js_shipping_method_detail_'+(i-1)).attr('data-shipping-counter',(i-1))
					$(activetab + ' #js_shipping_method_detail_'+(i-1)+' .option-head a:first' ).html('Shipping Address '+(i-1))
				}
				$(activetab+" .js_request_quote_shipping_counter").val((shippigCounter-1));
			}
		});
	}
}
function attachAutoCompleteEvent(parentDiv){
	 if ($(activetab).find(parentDiv + " .auto_complete_shipping_email").length > 0)
	    {
	      var ShipAddUrl = project_settings.address_book_api_url+'?address_type=shipping&website_id='+website_settings['projectID']+'&user_id='+user_id+'&deleted_at=false&is_address=1';
	      $(activetab).find(parentDiv + " .auto_complete_shipping_email").typeahead({
	        name : 'sear',
	        display:'value',
	        minLength: 2,
	        limit: 10,
	        remote: {
	        url : ShipAddUrl+'&terms=%QUERY',
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
	              showPageAjaxLoading();
	          let counter = $(obj.currentTarget).closest('.js_shipping_method_detail').data('shipping-counter');
	          let shippigCounter = counter;
              let addressBookId = datum.id;

              setSelectedAddress(addressBookId,shippigCounter);
	      });
	    }
}


function setSelectedAddress(addressBookId,shippigCounter)
{
    axios({
        method: 'GET',
        url: project_settings.address_book_api_url+'/'+addressBookId,
      })
    .then(async response => {
        if(response.data != undefined ){
            let returnData = response.data;
            let replaceAddressHtml = '';
            replaceAddressHtml += returnData.name+"<br>";
            replaceAddressHtml += returnData.email+"<br>";
            replaceAddressHtml += returnData.street1+"<br>,";
            if(returnData.street2 != undefined){
              replaceAddressHtml += returnData.street2+"<br>";
            }
            // change
            let city = await getCountryStateCityById(returnData.city,3);
            replaceAddressHtml += city+",";

            let state = await getCountryStateCityById(returnData.state,2);
            replaceAddressHtml += state+",";

            let country = await getCountryStateCityById(returnData.country,1);
            if(cid == null)
            {
                changeShippingDetails(shippigCounter);
            }
            // if(cid == null)
            // {
            //     $('#js_shipping_method_detail_'+shippigCounter).find('.js_rq_ship_shippingcarrier').html('Select Carrier <span class="caret"></span>');
            // }
          //   $('#js_shipping_method_detail_'+shippigCounter).find('.js_rq_ship_shippingcarrier').attr('data-value','');
            replaceAddressHtml += country
            // END -Change

            if(returnData.postalcode != undefined ){
              replaceAddressHtml += "-"+returnData.postalcode+"<br>";
            }
            if(returnData.phone != undefined ){
              replaceAddressHtml += "T: "+returnData.phone+",<br>";
            }
            if(returnData.mobile != undefined ){
              replaceAddressHtml += "M: "+returnData.mobile+"<br>";
            }
            replaceAddressHtml += '<input class="shippingAddressId" name="shippingAddressId" value="'+returnData.id+'" type="hidden">';
            addressBookHtml = addressBookHtmlTemplate;

            if(addressBookHtml.indexOf("#data.address#")!= -1){
                addressBookHtml = addressBookHtml.replace(/#data.address#/g,replaceAddressHtml);
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(addressBookHtml);
            }else{
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(replaceAddressHtml)
            }
            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses").removeClass("hide");
          // change
              let shipping_details = get_product_details.shipping[0];
              if(shipping_details.fob_city == '' || shipping_details.fob_state_code == '' || shipping_details.fob_zip_code == '' || shipping_details.fob_country_code == ''){
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_option").html('')
              }
              var addressFrom  = {
                  "name": shipping_details.fob_city,
                  "street1": shipping_details.fob_city,
                  "city": shipping_details.fob_city,
                  "state": shipping_details.fob_state_code,
                  "zip": shipping_details.fob_zip_code,
                  "country": shipping_details.fob_country_code,
                  // "phone": "+1 555 341 9393",//optional
                  // "email": "shippotle@goshippo.com",//optional
                  "validate": true//optional
              };

              var addressTo  = {
                  "name": returnData.name,
                  "street1": returnData.street1,//"500 to 598 1st St",//,
                  "city": city,
                  "state": state,
                  "zip": returnData.postalcode,
                  "country": country,
                  // "phone": "+1 555 341 9393",//optional
                  // "email": "shippotle@goshippo.com",//optional
                  "validate": true//optional
              };
              // console.log("addressTo",addressTo);

              $(document).off('click', '#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li').on('click','#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li', function (e) {
                  // if(e.handled !== true)
                  {
                      showPageAjaxLoading()
                      var thisObj = $(this);

                      let attr = $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-value');

                      if (typeof attr !== typeof undefined && attr !== false) {
                          $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-value','')
                          $('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_shippingmethod').attr('data-service','')
                      }
                      getShippingRate('#js_shipping_method_detail_'+shippigCounter,thisObj,addressFrom,addressTo,shipping_details,shippigCounter);
                  }
              });
              $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_option").removeClass("hide");
          // END -Change

            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses").removeClass("hide");
            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").datepicker({
                changeMonth: true,
                changeYear: true,
                format: 'mm/dd/yyyy',
                minDate: new Date(),
                onSelect: function(dateText, inst) {
                    let date = $(this).val();
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").val(date);
                }
            });
        }
        hidePageAjaxLoading();
    })
    .catch(error => {
      hidePageAjaxLoading();
      // console.log('Error fetching and parsing data', error);
    });
}
