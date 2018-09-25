var pid = getParameterByName('pid');
var cid = getParameterByName('cid');
// verifyAddress(sd);
// console.log('taxcloud_url', project_settings.taxcloud_url)
localStorage.setItem("guestPersonalInfo","")
localStorage.removeItem("requestQuoteAddress");

let verifyAddress = function (ADD, codes) {
  if (typeof TaxCloud != 'undefined' && TaxCloud.apiKey != '' && TaxCloud.apiId != '') {
    let taxid = TaxCloud.apiId;
    let taxkey = TaxCloud.apiKey;
    if (codes.countrycode != 'US') {
      console.log('Not US FOUND')
      // flag = true;
      return true;
    } else {
      let flag = false;
      let add = {
        Zip4:"0000",
        Zip5: ADD.zip,
        State: codes.statecode,
        City: "",
        Address2:"",
        Address1: ADD.street1,
        apiLoginID: taxid, 
        apiKey: taxkey
      };
      $.ajax({
            type: 'POST',
            url: project_settings.taxcloud_url+ '/VerifyAddress',
            async: false,
            dataType: 'json',
            data: add, 
            success: function (data) {
                //console.log('Dataa:: ', data)
                if (data.ErrNumber == '0') {
                  flag = true;
                } else {
                  flag = false;
                }
            },
            error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              flag = false;   
            },
        });
      return flag;
    }
  } else {
    return true
  }
  
};


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

    if(get_product_details != null && get_product_details != undefined) {
        // RECENTLY VIEWED PRODUCTS
        let recentProductsName = "recentViewedProducts_"+website_settings.projectID;
        let recentViewedProducts = [];
        if (localStorage.getItem(recentProductsName) != null) {
            recentViewedProducts = JSON.parse(localStorage.getItem(recentProductsName));
        }
        
        if(!(recentViewedProducts.includes(pid))) {
            if(recentViewedProducts.length > 5) {
                recentViewedProducts.splice(0, 1);
            }
            recentViewedProducts.push(pid);
        }
        localStorage.setItem(recentProductsName, JSON.stringify(recentViewedProducts));

        recentlyViewedProducts(recentViewedProducts);
    }
}

function recentlyViewedProducts(recentViewedProducts) {
    if(recentViewedProducts != null && recentViewedProducts.length > 1)
    {
        let recentLoop = recentViewedProducts;
        let cIndex = recentLoop.indexOf(pid);
        if (cIndex > -1) {
            recentLoop.splice(cIndex, 1);
        }

        let recentProductHtml = "";
        $.each( recentLoop, function( key, productId ) {
            $.ajax({
                type: 'GET',
                url: project_settings.product_api_url+"?_id="+productId+"&source=default_image,product_id,sku,product_name,currency,min_price,price_1,images",
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
                },
                dataType: 'json',
                success: function (data) {
                    let productData = data.hits.hits[0]._source;
                    if(!isEmpty(productData))
                    {
                        let productImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                        if(productData.images != undefined){
                            productImage = productData.images[0].images[0].secure_url
                        }
                        let detailLink = website_settings.BaseURL+'productdetail.html?locale='+project_settings.default_culture+'&pid='+productId;
                        let price = parseFloat(productData.price_1).toFixed(project_settings.price_decimal);

                        recentProductHtml += '<div class="item"> <div class="pro-box"> <div class="pro-image box01"> <div class="product-img-blk"> <a href="'+detailLink+'"><img src="'+productImage+'" class="img-responsive center-block lazyLoad" alt="'+productData.product_name+'" title="'+productData.product_name+'"> </a> </div></div><div class="pro-desc"> <a href="'+detailLink+'" class="item-title"> '+productData.product_name+' </a> <div class="item-code"> Item # : '+productData.sku+' </div><div class="price">'+productData.currency+' '+price+'</div></div><div class="clearfix"></div></div></div>';
                    }
                    else {
                        let AIndex = recentLoop.indexOf(productId);
                        if (AIndex > -1) {
                            recentLoop.splice(AIndex, 1);
                        }
                        localStorage.setItem(recentProductsName, JSON.stringify(recentLoop));
                    }
                }
            });
        });

        $('#owl-carousel-recently-products').html(recentProductHtml);
        $('.js-recent-viewed-products').removeClass('hide');
    }
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

  //$('#js-request-info .js-section-number').addClass('no-tag');

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
                	ProductName = productDetails.product_name;
                  // console.log("productDetails.images[0]",productDetails.images[0]);
                  ProductImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                  if(productDetails.images != undefined)  {
                      ProductImage = productDetails.images[0].images[0].secure_url;//productDetails.default_image;
                  }
                  else {
                    $("#download_image").parent('li').remove()
                  }

                  // console.log("ProductImage",ProductImage);
                  ProductSku = productDetails.sku;
                  hasImprintData = productDetails.imprint_data;
                
                axios({
                    method: 'GET',
                    url: project_settings.webtools_api_url+'?website='+website_settings['projectID']+'&sku='+ProductSku,
                })
                .then(async response => {
                    if(response.data.data.length > 0){
                        let webtoolData = response.data.data[0];

                        if(webtoolData.product_pdf != undefined && webtoolData.product_pdf != '') {
                            $('#download_product_template').attr('href',webtoolData.product_pdf)
                        }
                        else {
                            $('#download_product_template').parent('li').remove()
                        }

                        if(webtoolData.art_pdf != undefined && webtoolData.art_pdf != '') {
                            $('#download_art_template').attr('href',webtoolData.art_pdf)
                        }
                        else {
                            $('#download_art_template').parent('li').remove()
                        }

                        if(webtoolData.gcc_pdf != undefined && webtoolData.gcc_pdf != '') {
                            $('#download_gcc_template').attr('href',webtoolData.gcc_pdf)
                        }
                        else {
                            $('#download_gcc_template').parent('li').remove()
                        }

                        if(webtoolData.special_pricing != undefined && webtoolData.special_pricing != '') {
                            $('#download_special_pricing').attr('href',webtoolData.special_pricing)
                        }
                        else {
                            $('#download_special_pricing').parent('li').remove()
                        }
                    }
                    else {
                        $('#download_product_template, #download_art_template, #download_gcc_template, #download_special_pricing').parent('li').remove()
                    }
                })            

                  // $('#product_name').html(ProductName)
                  let listHtml = $('#title .row').html();
                  let titleAndSkuHtml = listHtml.replace(/#data.product_name#/g,ProductName);
                  titleAndSkuHtml = titleAndSkuHtml.replace('#data.sku#',ProductSku);
                  let breadcrumbHtml = $(".breadcrumb").html();
                  breadcrumbHtml = breadcrumbHtml.replace(/#data.title#/g,ProductName)
                  $(".breadcrumb").html(breadcrumbHtml);
                  // console.log(titleAndSkuHtml);
                  // productHtml += listHtml1;
                  $('#title .row').html(titleAndSkuHtml);
                  let productImageUrl = ProductImage;
                  $('#product_img').attr("src",productImageUrl)
                  $('#product_img').data("zoom-image",productImageUrl)
                  $('#product_img').data("orig-img",productImageUrl)
			            // $('#product_sku').html(ProductSku);

                  // Add Variation Images
                  let imageGallaryHtml = '';

                  // console.log("imageGallaryHtml",imageGallaryHtml);
    		          if(productDetails.images != undefined){
    		            // $.each(productDetails.images[0].images, function(index, element) {
                       for (let element of productDetails.images[0].images) {
                          // let imageUrl = project_settings.product_api_image_url+project_settings.supplier_id+'/'+element.web_image;
                          let imageUrl = element.secure_url;
    		                  let color = element.color;
                          color = color.toLowerCase().replace(/\s/g, '-');
                          imageGallaryHtml += '<div class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_'+color+'_link" data-zoom-image="'+imageUrl+'">';
                          imageGallaryHtml += '<img data-orig-img-'+color+'="'+imageUrl+'" src="'+imageUrl+'" class="clr_'+color+' lazyLoad" alt="'+ProductName+'" title="'+ProductName+'" /></a><input type="hidden" id="var_img_clr_id" value="clr_'+element.color+'"/></div>';
    		               }
    		          }else{
                    imageGallaryHtml += '<div class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_default_link" data-zoom-image="'+productImageUrl+'">';
                    imageGallaryHtml += '<img data-orig-img-default="'+productImageUrl+'" src="'+productImageUrl+'" class="clr_default lazyLoad" alt="'+ProductName+'" title="'+ProductName+'" /></a><input type="hidden" id="var_img_clr_id" value="clr_default"/></div>';
                  }

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
                    //  console.log("colorsHexVal",colorsHexVal);
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
                    });

                    $(".checkbox_colors").html(productHtmlColor);

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
                            let totalPrice = 0.00; //summary
                            let shipp_charge = 0.00; //summary
                            $("#js_tab_list li:first").click();
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
                                    "<div class='selector-input'> <input type='text' value='"+response_data.color[$(this).val()]+"' class='selector-input js_request_quote_qty js_request_quote_nosize_qty' ></div><div class='sp-plus'><a data-multi='1' href='javascript:void(0)' class='js-quantity-selector'>+</a></div></div><div class='clearfix'></div></div><a href='javascript:void(0)' data-toggle='tooltip' class='js_request_quote_qty_remove remove-qty ui-icon-delete' data-id='"+id+"'>"+"<i class='fa fa-trash-o'></i></a></div>";

                                    $(this).prop("checked",true);
                                    // $(".js_add_imprint_location_request_quote").prop("checked",true);

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

                                //summary for color selection
                                let totalQty = 0;
                                if($(activetab+' .js_color_checkbox:checked').length > 0) {
                                    $("#Quantity-quote, .js_summary_qty").removeClass('hide');
                                    let qtyMerge = "";
                                    $(activetab+' .js_color_checkbox:checked').each(function() {
                                        let colorName = $(this).val();
                                        let color_name = $(this).attr('id');
                                        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());

                                        qtyMerge = qtyMerge + '<tr id="js_row_summary_qty_'+color_name+'"><td width="20%">'+colorName+' </td><td><span>: '+qty+'</span></td></tr>';

                                        totalQty = totalQty + parseFloat(qty);
                                    });
                                    $('#js_product_summary_qty').html(qtyMerge);

                                    $(".total_quantity").html(totalQty);
                                    $(".jsTotal, .estimate-total-block").removeClass('hide');
                                }
                                else {
                                    $("#Quantity-quote, .js_summary_qty").addClass('hide');
                                }

                                //summary for total price
                                var productDetails = get_product_details;
                                if(productDetails.pricing != undefined){
                                    let priceRang = '';
                                    $.each(productDetails.pricing, function(index,element){
                                        if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global")
                                        {
                                            $.each(element.price_range,function(index,element2){
                                                if(element2.qty.lte != undefined) {
                                                    if(totalQty >= element2.qty.gte && totalQty <= element2.qty.lte) {
                                                        totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                                                    }
                                                }
                                                else
                                                {
                                                    if(totalQty >= element2.qty.gte) {
                                                        totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                $("#js_product_summary_charges .total_price").html('$'+parseFloat(totalPrice).toFixed(project_settings.price_decimal));
                            });

                            $(activetab+"-Print-position-block").addClass("in");

                            // $(activetab).find(".js_add_imprint_location_request_quote").each(function(){
                            //     $(this).prop("checked",false);
                            // });

                            //summary for setup charge
                            if(typeof response_data.charges != 'undefined' && typeof response_data.charges.setup_charge != 'undefined') {
                                totalPrice = parseFloat(totalPrice) + parseFloat(response_data.charges.setup_charge)
                            }

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

                                    //summary for print position
                                    $('.js_print_postion_location').append('<div class="js_summary_imprint_location_'+print_pos_id+'"><div class="estimate-row heading"><span>Print Position : '+printPos+'</span></div><div class="row"><div class="col-sm-12"><div class="js_product_summary_imprint_location_'+print_pos_id+'"><div class="estimate-row js_imprint_method_summary_'+print_pos_id+' hide">Imprint Method : <span></span></div> <div class="estimate-row js_color_number_summary_'+print_pos_id+' hide">How many colors : <span></span></div> <div class="estimate-row js_selected_color_summary_'+print_pos_id+' hide"></div></div></div></div></div>');

                                    let printPosLower = replaceWithUnderscore(imprint_info.imprint_position_name);//"BARREL";//$(this).attr("value");
                                    // console.log(printPosLower);

                                    let printMethod = replaceWithUnderscore(imprint_info.imprint_method_name);//"BARREL";//$(this).attr("value");
                                    // console.log(printMethod);

                                    let listHtmlPrintPosMethod1 = '';
                                    let productHtmlPrintPosMethod = '';
                                    let select_imprint_method ='';

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
                                        $("#js_imprint_request_quote_box_"+printPosLower).find("#select_method_"+printMethod).click();

                                        $( ".js_imprint_method_selectbox_"+printPosLower+"_"+printMethod+" ul li[data-value='"+no_of_color+"']" ).click();

                                        if(typeof imprint_info.selected_colors != "undefined")
                                        {
                                            let selColorsHtml = ""; //summary
                                            for (let [i,imprint_selected_colors] of imprint_info.selected_colors.entries())
                                            {
                                                let j = i+1;
                                                //$( "ul[data-color-no='"+j+"'] li[data-value='"+imprint_selected_colors+"'][data-printpos='"+printPosLower+"']" ).click();

                                                $(activetab).find("#js_selected_color_id_"+printPosLower+"_"+printMethod+"_"+j).val(imprint_selected_colors);
                                                $(activetab).find("#js_selected_color_id_"+printPosLower+"_"+printMethod+"_"+j).next().find(".color-select-box button").attr("data-printpos",printPosLower)
                                                $(activetab).find("#js_selected_color_id_"+printPosLower+"_"+printMethod+"_"+j).next().find(".color-select-box button").attr("data-value",imprint_selected_colors)
                                                $(activetab).find("#js_selected_color_id_"+printPosLower+"_"+printMethod+"_"+j).next().find(".color-select-box button").html('<span class="imprint-lbl-method">'+imprint_selected_colors+'</span><span class="caret"></span>')

                                                //summary for select color from list
                                                selColorsHtml = selColorsHtml + '<div class="js_selected_color_'+j+'">color'+j+' : <span>'+imprint_selected_colors+'</span></div><br>';
                                            }

                                            //summary for select color from list
                                            if(selColorsHtml != '') {
                                                $('.js_selected_color_summary_'+printPosLower).html(selColorsHtml+"<br>");
                                                $('.js_selected_color_summary_'+printPosLower).removeClass('hide');
                                            }
                                        }
                                    }
                                    else{
                                        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).remove();
                                    }

                                    if(typeof imprint_info.artwork_type != "undefined")
                                    {
                                        let artwork_type = imprint_info.artwork_type;

                                        let selectedType = $(activetab).find("#js_request_quote_artwork_"+print_pos_id);
                                        
                                        $(selectedType).find("ul li[data-type='"+artwork_type+"'] a").click();

                                        let checkSendEmail = '';
                                        if(artwork_type == "upload_artwork_typeset")
                                        {
                                            if(typeof imprint_info.artwork.artwork_text_email != "undefined")
                                            {
                                                checkSendEmail = "#logo_text_email_"+print_pos_id;
                                            }
                                            else{
                                                checkSendEmail = "#logo_text_image_"+print_pos_id;
                                            }
                                        }
                                        else if(artwork_type == "upload_artwork")
                                        {
                                            if(typeof imprint_info.artwork != "undefined")
                                            {
                                                if(typeof imprint_info.artwork.artwork_email != "undefined")
                                                {
                                                    checkSendEmail = "#logo_email_"+print_pos_id;
                                                }
                                                else{
                                                    checkSendEmail = "#logo_image_"+print_pos_id;
                                                }
                                            }
                                        }

                                        if(checkSendEmail != "")
                                        {
                                            $(activetab).find(checkSendEmail).click();
                                        }
                                        
                                        if(typeof imprint_info.artwork != "undefined")
                                        {
                                            if(typeof imprint_info.artwork.artwork_text != "undefined")
                                            {
                                                for (let [i,artwork_text] of imprint_info.artwork.artwork_text.entries())
                                                {
                                                    let j = i+1;
                                                    // console.log('artwork_text',artwork_text)

                                                    let inputTextVal = '';
                                                    let addClick = '';
                                                    

                                                    if(artwork_type == "typeset")
                                                    {
                                                        inputTextVal = "#text_is_text_"+print_pos_id+"_"+j;
                                                        addClick =  "#is_text_add_"+print_pos_id;
                                                    }
                                                    else if(artwork_type == "upload_artwork_typeset")
                                                    {
                                                        inputTextVal = "input[data-id='text_is_logo_text_text_"+print_pos_id+"_"+j+"']";//"#text_is_text_"+print_pos_id+"_"+j;
                                                        addClick =  "#is_logo_text_text_add_"+print_pos_id;
                                                    }

                                                    if(inputTextVal != "")
                                                    {
                                                        $(activetab).find(inputTextVal).val(artwork_text);
                                                    }
                                                    
                                                    if(j>1)
                                                    {
                                                        if(addClick != "")
                                                        {
                                                            $(activetab).find(addClick).click();
                                                        }

                                                        if(inputTextVal != "")
                                                        {
                                                            $(activetab).find(inputTextVal).val(artwork_text);
                                                        }
                                                    }

                                                    //summary for upload artwork
                                                    $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_text_'+j+' span').text(artwork_text);
                                                    $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_text_'+j).removeClass('hide');
                                                }
                                            }

                                            if(typeof imprint_info.artwork.artwork_thumb != "undefined")
                                            {
                                                for (let [i,artwork_thumb] of imprint_info.artwork.artwork_thumb.entries())
                                                {
                                                    let j = i+1;
                                                    let thumbImg = '';
                                                    let addClick = '';
                                                    let actualImg = '';

                                                    if(artwork_type == "upload_artwork")
                                                    {
                                                        addClick =  "#is_logo_add_"+print_pos_id;   
                                                        thumbImg = "#logo_show_"+print_pos_id+"_"+j;
                                                        actualImg = "#logo_save_"+print_pos_id+"_"+j;
                                                    }
                                                    else if(artwork_type == "upload_artwork_typeset")
                                                    {
                                                        addClick =  "#is_logo_text_add_"+print_pos_id;   
                                                        thumbImg = "#logo_type_show_"+print_pos_id+"_"+j;
                                                        actualImg = "#logo_type_save_"+print_pos_id+"_"+j;
                                                    }

                                                    $(activetab).find(thumbImg).attr("src",artwork_thumb);
                                                    $(activetab).find(thumbImg).removeClass("hide");
                                                    $(activetab).find(actualImg).val(imprint_info.artwork.artwork_image[i]);
                                                    
                                                    if(j>1)
                                                    {
                                                        $(activetab).find(addClick).click();
                                                    }

                                                    //summary for upload artwork
                                                    $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_logo_'+j+' span img').attr("src",artwork_thumb);
                                                    $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_logo_'+j).removeClass('hide');
                                                }
                                            }

                                            $(selectedType).find("div[data-type='"+artwork_type+"']").find(".js_artwork_instructions_text").val(imprint_info.artwork.artwork_instruction);

                                            //summary for upload artwork
                                            $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_textarea span').text(imprint_info.artwork.artwork_instruction);
                                        }
                                        $('.js_summary_artwork_'+print_pos_id+'_'+artwork_type).find('.js_sum_art_textarea').removeClass('hide');
                                    }
                                }
                                if(websiteConfiguration.transaction.place_order.print_position.artwork.status == 0 && activetab != "#js-request-quote"){
                                    $(activetab).find('.art-pos-value').parent().remove();
                                }
                            }

                            $(activetab).find('input[name=request_quote_shipping_type][value="'+response_data.shipping_method.shipping_type+'"]').click();//.prop("checked",true);

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

                                carrierData = [];
                                carrierData['shipping_carrier'] = shipping_carrier.toUpperCase();
                                carrierData['shipping_method'] = shipping_method+' '+shipping_charge;
                                carrierData['on_hand_date'] = on_hand_date;

                                setSelectedAddress(addressBookId,i,carrierData);
                                let setActivetab = activetab.replace(/\#/g, '');

                                for (let color_quantity in shipping_info.color_quantity) {
                                    let color_quantity_class = replaceWithUnderscore(color_quantity)

                                    $(activetab).find("#js_shipping_method_detail_"+i).find("."+setActivetab+"_"+color_quantity_class).find(".js_request_quote_shipping_qty_box").val(shipping_info.color_quantity[color_quantity]);

                                    $(activetab).find("#js_shipping_method_detail_"+i).find("."+setActivetab+"_"+color_quantity_class).find("total").html(shipping_info.color_quantity[color_quantity]);
                                }

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_request_quote_shipping_qty_box").val();

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").attr('data-value',shipping_carrier);

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingcarrier").html('<span class="imprint-lbl-method">'+shipping_carrier.toUpperCase()+'</span> <span class="caret"></span>');

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shippingmethod").attr('data-value',shipping_charge);
                                shipp_charge = shipp_charge + parseFloat(shipping_charge);  //summary

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
                                        let setShippingDate = $(this).attr("id");
                                        $(activetab).find("#"+setShippingDate).val(date);

                                        //summary for address inhand date
                                        $('.js_inhand_date_'+i).find('span').html(date);
                                        $('#Quantity-quote, .js_inhand_date_'+i).removeClass('hide');
                                    }
                                });

                                $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_handdate").datepicker('setDate', on_hand_date);

                                // $(activetab).find("#js_shipping_method_detail_"+i+" .js_rq_ship_shipmethod_ul li:first").click();

                                attachDeleteEvent("#js_shipping_method_detail_"+i);
                                attachShippingDetailChangeEvent()
                            }
                            // END - Shipping Section


                            $(activetab).find("#js_request_quote_instruction").val(response_data.special_instruction);

                            //summary for shipping charges
                            if(shipp_charge != 0.00 && !isNaN(shipp_charge)) {
                                $('.js-shipping-charge-summary').find('span').html("$"+parseFloat(shipp_charge).toFixed(project_settings.price_decimal));
                                $('.js-additional-charges-summary').removeClass('hide');
                                $('.js-shipping-charge-summary').removeClass('hide');
                            }
                            else {
                                shipp_charge = 0.00;
                            }
                            let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge);
                            $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));

                            //summary for special instruction
                            if(response_data.special_instruction != '') {
                                $('.js_summary_instruction').html(response_data.special_instruction);
                                $('#Quantity-quote, .js_special_inst').removeClass('hide');
                            }
                        }
                    }
                    })
                }
                // END - Edit Cart Product
                if (user_id != null ) {
                    if(websiteConfiguration.transaction.place_order.registered_user.status == 0){
                        // let html = 'Access Denied';
                        // $('#js-place-order').html(html);
                        $('#js-place-order').next('div').addClass('active')
                        $('#js-place-order').remove()
                        $("#js_tab_list").find('li').filter(function() {return !! $(this).find('a[href="#js-place-order"]').length;}).next('li').addClass("active")
                        $("#js_tab_list").find('li').filter(function() {return !! $(this).find('a[href="#js-place-order"]').length;}).remove()

                    }
                }
                else{
                    if(websiteConfiguration.transaction.place_order.guest_user.status == 0){
                        // let html = 'Access Denied';
                        // $('#js-place-order').html(html);
                        $('#js-place-order').next('div').addClass('active')
                        $('#js-place-order').remove()
                        $("#js_tab_list").find('li').filter(function() {return !! $(this).find('a[href="#js-place-order"]').length;}).next('li').addClass("active")
                        $("#js_tab_list").find('li').filter(function() {return !! $(this).find('a[href="#js-place-order"]').length;}).remove()
                    }
                }

                if(websiteConfiguration.transaction.place_order.shipping.standard_shipping.status == 0 && activetab != "#js-request-quote"){
                    $(activetab).find("input[name='request_quote_shipping_type'][value='standard']").parent().remove();
                }

                if(websiteConfiguration.transaction.place_order.shipping.split_shipping.status == 0 && activetab != "#js-request-quote"){
                    $(activetab).find("input[name='request_quote_shipping_type'][value='split']").parent().remove();
                }
                
                if(websiteConfiguration.transaction.place_order.product_summary.status == 0 && activetab != "#js-request-quote")
                {
                    $("#js-product-summary-container").addClass('hide');
                }
                

                if(websiteConfiguration.product_detail.imprint_info.status == 0)
                {
                    $("a[href='#imprint-info']").parent().remove();
                    $("#imprint-info").remove();
                }

                if(websiteConfiguration.product_detail.product_description.status == 0)
                {
                    $("a[href='#product_description']").parent().remove();
                    $("#product_description").remove();
                }
                
                if(websiteConfiguration.product_detail.product_detail.status == 0)
                {
                    $("a[href='#product-detail']").parent().remove();
                    $("#product-detail").remove();
                }

                if(websiteConfiguration.product_detail.shipping_info.status == 0)
                {
                    $("a[href$='product-shipping']").parent().remove();
                    $("#product-shipping").remove();
                }

                if($(".product-detail-tab").find('#myTab').html().trim().length === 0){
                    $(".product-detail-tab").remove();
                }

                if(productDetails.video_url == "" && $("#js-show_play_video").length > 0)
                {
                    $("#js-show_play_video").parent().remove();
                }
                
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

    //RECENTLY VIEWED PRODUCTS
    $("#owl-carousel-recently-products").owlCarousel({
        navigation: true,
        items:4,
        autoPlay: 3200,
        margin: 10,
        autoplayHoverPause: true,
        lazyLoad: true,
        stopOnHover: true,
        itemsCustom: false,
        itemsDesktop: [1170, 4],
        itemsDesktop: [1024, 3],
        itemsTabletSmall: false,
        itemsMobile: [400, 2],
        itemsMobile: [399, 1],
        singleItem: false,
        itemsScaleUp: false,
        afterInit: function (elem) {
            var that = this
            that.owlControls.prependTo(elem)
        }
    });

    $(document).on('click','.js_submit_info', async function (e) {
            let formObj = $(this).closest('form');
            let product_data = await getProductDetailById(pid)
            let guestUserDetail = ''
            let instruction = $(activetab).find("textarea[name='note']").val()
            if(instruction == ''){
              if($(".special-instruction-textarea").find('ul').length <= 0){
                $(activetab).find("textarea[name='note']").after('<ul class="red"><li>Please enter special instructions.</li></ul>');
              }
              return false;
            }
            else if(user_details == null){
              $('#modal-table').addClass('model-popup-black');
              $('#modal-table').addClass('request-info-popup-modal');
              $("#modal-table").find(".modal-title").html('Your Information')
              let guestUserHtml = $(".js_guest_info").html()
            //   $(".js_guest_info").html('')
              $(".js_add_html").html(guestUserHtml)
              $('#modal-table').modal('show');
              // window.location = "login.html";
              return false;
            }
            showPageAjaxLoading()
            submitRequestInfo(product_data,instruction,guestUserDetail)
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
        if ( thisObj.parent().parent().find('button').hasClass('dropdown-toggle') ){
            // set button text only if it is available
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

     //summary for imprint method
     $(document).on("click",".js_select_method li",function(){
        let thisObj = $(this);
        let position_name = thisObj.attr('data-printpos');
        let imprintMethodName = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-method-select button").attr('data-method');

        if(typeof imprintMethodName != 'undefined') {
            $('.js_imprint_method_summary_'+position_name).find('span').html(imprintMethodName);
            $('.js_color_number_summary_'+position_name).addClass('hide');
            $('.js_selected_color_summary_'+position_name).addClass('hide');
            $('.js_imprint_method_summary_'+position_name).removeClass('hide');

            //summary for setup charges
            let total_setup_charge = 0;
            $(activetab).find(".imprint-method-select button").each(function(i) {
                let imprintMethod = $(this).attr('data-method');
                if(typeof imprintMethod != 'undefined' && imprintMethod != '') {
                    let imprint_position = [];
                    imprint_position.push({'imprint_method_name': imprintMethod});

                    let setup_charge = calculate_setup_charge(imprint_position)
                    if(setup_charge > 0)
                    {
                        total_setup_charge = total_setup_charge + setup_charge;
                    }
                }
            });
            $('.js-setup-charge-summary').find('span').html("$"+parseFloat(total_setup_charge).toFixed(project_settings.price_decimal))
            $('.js-setup-charge-summary').removeClass('hide');
            $('.js-additional-charges-summary').removeClass('hide');
            
            let shipp_charge = 0.00;
            let setup_charge = total_setup_charge;
            if($("#js-product-summary-container").length > 0)
            {
                let totalPrice = $("#js_product_summary_charges .total_price").html().replace('$','');
                if($('.js-shipping-charge-summary').find('span').html() != '$0.00') {
                    shipp_charge = $('.js-shipping-charge-summary').find('span').html().replace('$','');
                }
       
                let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge) + parseFloat(setup_charge);
                $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));
            }
        }
        $('#Quantity-quote, .js_print_postion_location').removeClass('hide');
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

        //summary for how many colors
        let position_name = dataAttributes.position;
        let no_of_color = 0;
        if($(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").attr('data-value')) {
            no_of_color = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").attr('data-value');
        }
        if(no_of_color != 0) {
            $('.js_color_number_summary_'+position_name).find('span').html(no_of_color+' color(s)');
            $('.js_selected_color_summary_'+position_name).addClass('hide');
            $('.js_color_number_summary_'+position_name).removeClass('hide');
        }

          //imprint_color_val.imprint_color = ["Process Blue","Reflex Blue","Pantone Yellow","Pms 340","Pms 354","Pantone Orange","Pantone Purple"] // Static imprint color

          if(typeof imprint_color_val.imprint_color != 'undefined') {
            for(let i=1;i<=dataAttributes.value;i++) {
                colorHtml1 = colorHtml.replace(/#data.printPositionName#/g,printPosition)
                colorHtml1 = colorHtml1.replace(/#data.imprintId#/g,imprintMethod)
                colorHtml1 = colorHtml1.replace(/#data.printColor#/g,i)
                replaceColorHtml += colorHtml1;
            }
            parentObj.find(".js-color-div-append").html(replaceColorHtml)
          }

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
        let color_name = $(this).parent().parent().find('button').attr('data-value');
        let color_no = $(this).parent('ul').attr('data-color-no');
        let print_pos = $(this).attr("data-printpos")
        let parentObj = $(this).closest('#js_imprint_request_quote_box_'+print_pos)
        let method_name = parentObj.find('.imprint-method-select button').attr('data-dropval');
        let position_name = parentObj.find('.imprint-method-select button').attr('data-printpos');
        parentObj.find('#js_selected_color_id_'+position_name+'_'+method_name+'_'+color_no).val(color_name);

        //summary for select color from list
        let imprint_method_name = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-method-select button").attr('data-dropval');

        let no_of_color = 0;
        if($(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").attr('data-value')) {
            no_of_color = $(activetab).find("#js_imprint_request_quote_box_"+position_name+" .imprint-color-select button").attr('data-value');
        }

        let selColorsHtml = "";
        if(no_of_color.length > 0) {
            for(var k=1;k<=no_of_color;k++) {
                let selectedColor = $(activetab).find('#js_selected_color_id_'+position_name+'_'+imprint_method_name+'_'+k).val();
                if(selectedColor != "" && typeof selectedColor != "undefined") {
                    selColorsHtml = selColorsHtml + '<div class="js_selected_color_'+k+'">color'+k+' : <span>'+selectedColor+'</span></div><br>';
                }
            }
        }

        if(selColorsHtml != '') {
            $('.js_selected_color_summary_'+position_name).html(selColorsHtml+"<br>");
            $('.js_selected_color_summary_'+position_name).removeClass('hide');
        }
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

        if(dataAttributes.maxImprintColor > 0 && dataAttributes.maxImprintColor != '') {
            for(let i=1;i<=dataAttributes.maxImprintColor;i++){
                imprintColor +=  '<li data-value="'+i+'" data-position="'+dataAttributes.printpos+'"><a href="javascript:void(0)">'+i+' Color</a></li>'
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
      virtualButtonHtml1 = virtualButtonHtml1.replace("#data.spplierId#",project_settings.supplier_id)
      virtualButtonHtml1 = virtualButtonHtml1.replace("#data.culture#",project_settings.default_culture)
      $("#ob_virtual_list").html(virtualButtonHtml1)
      $("#js_display_virtual").after('<script type="text/javascript" src="http://virtualmarketingcart.com/js/virtualintegration.js"></script>')

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

            let currentTab = $(activetab+' #js_request_quote_artwork_'+position_name+' li.active a').attr('href');
            let art_type = $(activetab+' '+currentTab).attr('data-type');
            let art_section = getArtworkData(currentTab,position_name);

            let imprint_position_data = { 'imprint_position_name': positionName, 'imprint_method_name': imprintMethodName, 'no_of_color' : no_of_color, 'selected_colors' : selected_colors, 'artwork_type' : art_type, 'artwork' : art_section };
            
            imprint_position.push(imprint_position_data);
        });
        //console.log("imprint_position new",imprint_position);

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

            if(user_details != null)
            {
                if(selected_address_id != undefined) shipping_address = await returnshippingData(selected_address_id);
            }
            
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

            if(typeof get_in_hand_date == 'undefined')
            {
                get_in_hand_date='';
            }

            let user_shipping_address = (ordertab !== 'place-order' && shipping_address!=='') ? shipping_address : '';

            let shipping_detail = {"on_hand_date":get_in_hand_date,'ship_date':'',"ship_transittime": get_transittime,"shipping_carrier": shipping_carrier,"shipping_charge": get_shipping_charge,"shipping_method": get_shipping_method};

            if(ordertab === 'request-quote' && user_details == null)
            {
                let requestQuoteAddressData = JSON.parse(localStorage.getItem("requestQuoteAddress"));
                // console.log('requestQuoteAddressData',requestQuoteAddressData)
                // console.log('i000',i)
                if(localStorage.getItem("requestQuoteAddress") != null && localStorage.getItem("requestQuoteAddress") != "" &&typeof requestQuoteAddressData[i-1] != "undefined")
                {
                    requestQuoteAddressData[i-1]['city'] = await getCountryStateCityById(requestQuoteAddressData[i-1].city,3)
                    requestQuoteAddressData[i-1]['country'] = await getCountryStateCityById(requestQuoteAddressData[i-1].country,1)
                    requestQuoteAddressData[i-1]['state'] = await getCountryStateCityById(requestQuoteAddressData[i-1].state,2)
                    
                    shipping_details.push({'color_quantity':shipping_colors_qty,'shipping_from':'shipping_book','selected_address_id':selected_address_id,'shipping_detail':shipping_detail,'shipping_address':requestQuoteAddressData[i-1]});
                }
                else{
                    shipping_details.push({'color_quantity':shipping_colors_qty,'shipping_from':'shipping_book','selected_address_id':selected_address_id,'shipping_detail':shipping_detail,'shipping_address':""});
                }
            }
            else{
                shipping_details.push({'color_quantity':shipping_colors_qty,'shipping_from':'shipping_book','selected_address_id':selected_address_id,'shipping_detail':shipping_detail,'shipping_address':user_shipping_address});
            }
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
                            let setActivetab = activetab.replace(/\#/g, '');
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
                if(ordertab === 'request-quote' && user_details == null)
                {
                    //pop-up
                    if(localStorage.getItem("guestPersonalInfo") == null || localStorage.getItem("guestPersonalInfo") == "")
                    {
                        hidePageAjaxLoading();
                        $('#modal-table').attr('class','modal fade model-popup-black request-info-popup-modal');
                        $("#modal-table").find(".modal-title").html('Personal Info');
                        $("#modal-table").find(".modal-dialog").removeClass("play-video"); 
                        let guestUserHtml = $(".js_guestuserPersonalInfo").html();
                        
                        $(".js_add_html").html(guestUserHtml)
                        $('#modal-table').modal('show');
                        return false;

                    }
                    else{
                        let guestPersonalInfo = JSON.parse(localStorage.getItem("guestPersonalInfo"));
                        data['guest_request_personalInfo'] = guestPersonalInfo;
                        data['form_data'] = {'slug':'guest-request-quote','to_email':data['guest_request_personalInfo']['personalinfo_email']};
                        localStorage.setItem("guestPersonalInfo","")
                        // console.log('guestPersonalInfo',guestPersonalInfo);
                    }

                    data['billing_info'] = '';//await returnDefaultBillingInfo();
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
                    data['billing_info'] = await returnDefaultBillingInfo();
                }
                
                data['product_description'] = get_product_details;
                data['website_id'] = website_settings['projectID'];
                data['owner_id'] = website_settings['UserID'];
                // data['product_image_url'] = project_settings.product_api_image_url;

                // console.log('---data---',data);
                // return false;
                
                $.ajax({
                    type : 'POST',
                    url : project_settings.request_quote_api_url,
                    data : data,
                    // headers: {"Authorization": userToken},
                    dataType : 'json',
                    success : function(response_data) {
                        if(response_data!= "") {
                            hidePageAjaxLoading()
                            if(ordertab === 'request-quote' && user_details == null)
                            {
                                showSuccessMessage("Request Quote Email Sent Sucessfully","thankYou.html");
                            }
                            else{
                                showSuccessMessage("Request Quote Save Sucessfully","thankYou.html");
                            }
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
        }
        // console.log("data",data);
    })

    if(cid == null)
    {
      $('#js_tab_list li.active').trigger('click');
    }
});

function getArtworkData(currentTab,position_name)
{
    let art_url = [];
    let art_thumb = [];
    $(activetab+' '+currentTab+' .js-save-artwork-logo').each(function(i) {
        if($(this).val().trim() != '') {
            art_url.push($(this).val());
            art_thumb.push($(this).prev('img').attr('src'));
        }
    });

    let typeset = [];
    $(activetab+' '+currentTab+' .js-art-text').each(function(i) {
        if($(this).val().trim() != '') {
            typeset.push($(this).val());
        }
    });
    
    art_section = {};
    if(art_url.length > 0) {
        art_section.artwork_image = art_url;
    }
    else {
        delete art_section.artwork_image;
    }

    if(art_thumb.length > 0) {
        art_section.artwork_thumb = art_thumb;
    }
    else {
        delete art_section.artwork_thumb;
    }

    if(typeof $(activetab+' '+currentTab+' .js_artwork_instructions_text').val() != 'undefined' && $(activetab+' '+currentTab+' .js_artwork_instructions_text').val().trim() != '') {
        art_section.artwork_instruction = $(activetab+' '+currentTab+' .js_artwork_instructions_text').val();
    }

    if(typeset.length > 0) {
        art_section.artwork_text = typeset;
    }
    else {
        delete art_section.artwork_text;
        delete art_section.artwork_instruction;
    }

    if(typeof $(activetab+' '+currentTab+' .js-upload-email-radio').prop('checked') != 'undefined' && $(activetab+' '+currentTab+' .js-upload-email-radio').prop('checked') == true) {
        art_section.artwork_email = 1;
        delete art_section.artwork_image;
        delete art_section.artwork_thumb;
        delete art_section.artwork_instruction;
    }
    else {
        delete art_section.artwork_email;
    }

    if(typeof $(activetab+' '+currentTab+' .js-upload-email-type-radio').prop('checked') != 'undefined' && $(activetab+' '+currentTab+' .js-upload-email-type-radio').prop('checked') == true) {
        art_section.artwork_text_email = 1;
        delete art_section.artwork_image;
        delete art_section.artwork_thumb;
        delete art_section.artwork_text;
        delete art_section.artwork_instruction;
    }
    else {
        delete art_section.artwork_text_email;
    }

    return art_section;
}

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
                    rateHtml = '<li data-service="Select Method" data-value="0.00" data-transit-time=""><a href="javascript:void(0)">Product shipping detail is missing</a></li>'

                    let quantity= total_qty;
                    let quantity_in_carton = shipping_details.shipping_qty_per_carton
                    if(quantity_in_carton != 0)
                    {
                        var noOfBox = Math.ceil(quantity/quantity_in_carton);
                    }

                    // if(noOfBox > 50)
                    // {
                    //     let max_qty = shipping_qty_per_carton*50;
                    //     $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                    //     $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").append('<div class="red js-section-errors">Maximum '+max_qty+' quantities are allowed.</div>')
                    // }
                    // else{
                    //     $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section .js-section-errors").remove();
                    //     $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").append('<div class="red js-section-errors">Please try with less quantity.</div>')
                    // }
                    // console.log("result.data",result.data)
                    // console.log("result.data.address_to.validation_results.messages[0].text",result.data.messages[0].text)
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
            let sectionHtml = $(this).html();
            sectionHtml1 = sectionHtml.split("<i>")
            $(this).html(sectionHtml1[0])
            sectionCount = sectionCount + 1;
            $(this).append("<i>"+sectionCount+"</i>&nbsp;");
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
                // let data_imprint_method = replaceWithUnderscore(imprint_data[item].imprint_method)
                let data_imprint_method = imprint_data[item].imprint_method
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
              url: project_settings.address_book_api_url+'?website_id='+website_settings['projectID']+'&user_id='+user_id+'&deleted_at=false&is_address=1&billing_default=1',
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

    // console.log('activetab',activetab);
    $("#js-product-summary-container").addClass('hide');
    if(websiteConfiguration.transaction.request_quote.product_summary.status != 0 && activetab == "#js-request-quote")
    {
        $("#js-product-summary-container").removeClass('hide');
    }

    if(websiteConfiguration.transaction.place_order.product_summary.status != 0 && activetab != "#js-request-quote")
    {
        $("#js-product-summary-container").removeClass('hide');
    }

    let setActivetab = activetab.replace(/\#/g, '');

    //set dynamic id in html of place order and request quote by active tab
    let activeTabHtml = $(activetab).find(".js_set_active_tab").html()

    if(typeof activeTabHtml != 'undefined' ){
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
      $(activetab + '.print-checkbox').html('');
      $(activetab).find('#js_imprint_request_quote').empty();
      $(activetab).find('#js_request_quote_instruction').val('');
      $(activetab).find('#js_shipping_method').addClass('hide');
      $(activetab).find('.js_select_shipping_type').prop('checked',false);

      //quote
      if(websiteConfiguration.transaction.request_quote.shipping.standard_shipping.status == 0 && activetab == "#js-request-quote"){
        $(activetab).find("input[name='request_quote_shipping_type'][value='standard']").parent().remove();
      }

      if(websiteConfiguration.transaction.request_quote.shipping.split_shipping.status == 0 && activetab == "#js-request-quote"){
        $(activetab).find("input[name='request_quote_shipping_type'][value='split']").parent().remove();
      }
     
      if(websiteConfiguration.transaction.request_quote.shipping.standard_shipping.status == 0 && activetab == "#js-request-quote"){
        $(activetab).find("input[name='request_quote_shipping_type'][value='standard']").parent().remove();
      }
      
    }

    $(activetab +' .js-section-errors').remove();

    //console.log($(activetab).find('#js_shipping_method').find(".shipping-scroll").html())
    //$(activetab).find('#js_shipping_method').find(".shipping-scroll").addClass('hide');

    if(get_product_details.attributes.colors == undefined || get_product_details.attributes.colors.length <= 0) {
        $(".checkbox_colors").html("<span class='red'>There is no color for this product.</span>");
        $("#"+setActivetab+"-Print-position-block, #"+setActivetab+"-Shipping-method-col, #"+setActivetab+" #js_request_quote_instruction").addClass('hide');
    }

    autoCounter();
    if(typeof cid == 'undefined' || cid == null) {
        $('#Quantity-quote-block').html('<div class="panel-body"><div class="estimate-detail" id="js_product_summary"><div class="estimate-tag-block js_summary_qty hide"><div class="estimate-row heading"><span>Quantity</span></div><div class="row"><div class="col-sm-12"><table class="product-color-price-table" id="js_product_summary_qty"></table></div></div></div><div class="estimate-tag-block js_print_postion_location hide"></div><div class="estimate-tag-block estimate-address-block js_summary_shipping_type hide"><div class="estimate-row heading"><span>Shipping Method</span></div><div class="row"><div class="col-sm-12"><div class="estimate-row ship_type">Shipping Type : <span></span></div><div class="js_shipp_address_data hide"></div></div></div></div></div><div class="js_special_inst estimate-detail hide"><div class="estimate-tag-block"><div class="estimate-row heading"><span>Special Instructions</span></div><div class="row"><div class="col-sm-12"><div class="js_summary_instruction" style="white-space:pre-wrap"></div></div></div></div></div><div class="jsTotal estimate-detail hide"><div class="js_product_summary_charges" id="js_product_summary_charges"><div class="estimate-tag-block js-additional-charges-summary hide"><div class="estimate-row heading"><span>Additional Charges</span></div><div class="row"><div class="col-sm-12"><div class="estimate-row charge_type js-shipping-charge-summary hide">Shipping Charge(s): <span class="text-uppercase">$0.00</span></div><div class="estimate-row charge_type js-setup-charge-summary hide">Setup Charge: <span class="text-uppercase">$0.00</span></div><div class="estimate-row charge_type js-total-tax-in-summary hide">Total Tax: <span class="text-uppercase">$0.00</span></div></div></div></div><div class="estimate-total-block hide"><div class="row"><div class="col-lg-7 col-md-7 col-sm-7"><table class="estimate-sub-table responsive"><thead><tr><th>Quantity</th><th>Price</th></tr></thead><tbody><tr><td class="total_quantity">0</td><td class="total_price">$0.00</td></tr></tbody></table></div><div class="col-lg-5 col-md-5 col-sm-5 estimate-sub-totle"><h4>Total Price: </h4><h5 class="final_price">$0.00</h5></div></div></div></div></div></div>');

        $('#Quantity-quote').addClass('hide');
    }
});


$(document).on("click",".split-add-new-address",function(){
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
    let setActivetab = activetab.replace(/\#/g, '');

    $.each(colors_qty,function(key,value){
        let alreadyAssignedQuantiy = 0;
        colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,key)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,colors_hex_code[key])
        let colors_id_codeReplace = colors_id_code[key].replace(/#data.tabID#/g,setActivetab)
        remainingQuantity = 0;

	// Deciding the quantity for new address started
        $("."+colors_id_codeReplace+" .js_request_quote_shipping_qty_box ").each(function(){
            alreadyAssignedQuantiy = parseInt(alreadyAssignedQuantiy) + parseInt($(this).val());
            remainingQuantity = parseInt(value)-parseInt(alreadyAssignedQuantiy);
            if(remainingQuantity < 0){ remainingQuantity = 0 }
        })

        colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,remainingQuantity)
        // Deciding the quantity for new address ended

        colorQtyHtml1 = colorQtyHtml1.replace(/#data.extraclass#/g,colors_id_codeReplace)
        replaceQtyHtml += colorQtyHtml1
    })
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_qty_box_main").html(replaceQtyHtml);
    /* Handling colors ended */

    /* Handle Colors in newly added address ended */

    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").attr("id",setActivetab+"_datetimepicker"+shippigCounter);

    $(".js_request_quote_shipping_qty_box").removeAttr('readonly');
    attachDeleteEvent("#js_shipping_method_detail_"+shippigCounter);
    attachAutoCompleteEvent("#js_shipping_method_detail_"+shippigCounter);
    
    if(setActivetab == "js-request-quote" && user_details == null)
    {
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-add_new_address_cls").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-address_list_cls").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").find(".ship-add-tit").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").find(".search-mail-block").remove();
    }
    else{
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-add_address_guest").remove();
    }
});

$(document).on("change",activetab+" .js_select_shipping_type",function(){
  let setActivetab = activetab.replace(/\#/g, '');
    if (user_id == null && setActivetab !== "js-request-quote") {
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
      colorQtyHtml1 = colorQtyHtml1.replace(/#data.tabID#/g,setActivetab)
      replaceQtyHtml += colorQtyHtml1
    })
    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_qty_box_main").html(replaceQtyHtml);
    /* Handling colors ended */

    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_rq_ship_handdate").attr("id",setActivetab+"_datetimepicker"+shippigCounter);

    // if(addressBookHtmlTemplate == '')
    if(setActivetab == "js-request-quote" && user_details == null)
    {
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-add_new_address_cls").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-address_list_cls").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").find(".ship-add-tit").remove();
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js-shippingMethod-section").find(".search-mail-block").remove();
    }
    else{
	if(addressBookHtmlTemplate == '')
    	{
    		addressBookHtmlTemplate = $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html();
    	}
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter).find(".js-add_address_guest").remove();
    }
    let addressBookHtml = addressBookHtmlTemplate;

    if (user_id == null && setActivetab === "js-request-quote") {
        $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html();    
    }
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

    //summary for shipping method
    $('.js_shipp_address_data').html('');
    $('.ship_type').html("Shipping Type : <span>"+selectedShippingType.replace(/\b\w/g, l => l.toUpperCase())+" Shipping</span>");
    $('#Quantity-quote, .js_summary_shipping_type').removeClass('hide');
});

// Auto sugession for search of addressbook

$(document).on("click",activetab+" .datepicker-color",function(){
    $(this).prev('input').focus()
})

$(document).on("click",activetab+" .js_rq_ship_shipmethod_ul li",function(){
     let thisObj = $(this);
     let transitTime = thisObj.data("transit-time")
     let shipCounter = thisObj.closest(".js_shipping_method_detail").data("shipping-counter")
     let parentObj = $(activetab+" #js_shipping_method_detail_"+shipCounter)

     //summary for shipping address method
     $('.js_address_method_'+shipCounter).find('span').html($(this).find('a').text());
     $('#Quantity-quote, .js_address_method_'+shipCounter).removeClass('hide');

     //summary for shipping charges
     let shippingCharge = $(this).attr('data-value');
     $(activetab+' .js_rq_ship_shippingmethod').each(function(i) {
        if($(this).closest(".js_shipping_method_detail").data("shipping-counter") != shipCounter) {
            shippingCharge = parseFloat(shippingCharge) + parseFloat($(this).attr('data-value'));
        }
     });

     $('.js-shipping-charge-summary').find('span').html("$"+parseFloat(shippingCharge).toFixed(project_settings.price_decimal));
     $('.js-additional-charges-summary').removeClass('hide');
     $('.js-shipping-charge-summary').removeClass('hide');

     let shipp_charge = shippingCharge;
     let setup_charge = 0.00;
     if($("#js-product-summary-container").length > 0)
     {
        let totalPrice = $("#js_product_summary_charges .total_price").html().replace('$','');
        if($('.js-setup-charge-summary').find('span').html() != '$0.00') {
            setup_charge = $('.js-setup-charge-summary').find('span').html().replace('$','');
        }

        let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge) + parseFloat(setup_charge);
        $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));
     }

     setdate(shipCounter,parentObj,activetab,transitTime)
})

$(document).on("change",activetab + ".js_add_imprint_location_request_quote",function(){
    let print_pos_id = $(this).attr("id");
    let printPos = $(this).attr("value");
    let listHtmlPrintPosMethod1 = '';
    let productHtmlPrintPosMethod = '';
    let select_imprint_method ='';

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


        //summary for print position
        let imprint_method_name = $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id+" .imprint-method-select button").attr('data-dropval');
        let imprintMethodName = $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id+" .imprint-method-select button").attr('data-method');

        let no_of_color = 0;
        if($(activetab).find("#js_imprint_request_quote_box_"+print_pos_id+" .imprint-color-select button").attr('data-value')) {
            no_of_color = $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id+" .imprint-color-select button").attr('data-value');
        }

        let selColorsHtml = "";
        if(no_of_color.length > 0) {
            for(var k=1;k<=no_of_color;k++) {
                let selectedColor = $(activetab).find('#js_selected_color_id_'+print_pos_id+'_'+imprint_method_name+'_'+k).val();
                if(selectedColor != "" && typeof selectedColor != "undefined") {
                    selColorsHtml = selColorsHtml + '<div class="js_selected_color_'+k+'">color'+k+' : <span>'+selectedColor+'</span></div><br>';
                }
            }
        }

        if(typeof imprintMethodName != 'undefined') {
            $('.js_imprint_method_summary_'+print_pos_id).find('span').html(imprintMethodName);
            $('.js_imprint_method_summary_'+print_pos_id).removeClass('hide');
        }
        if(no_of_color != 0) {
            $('.js_color_number_summary_'+print_pos_id).find('span').html(no_of_color+' color(s)');
            $('.js_color_number_summary_'+print_pos_id).removeClass('hide');
        }
        if(selColorsHtml != '') {
            $('.js_selected_color_summary_'+print_pos_id).html(selColorsHtml);
            $('.js_selected_color_summary_'+print_pos_id).removeClass('hide');
        }
        if(typeof imprintMethodName == 'undefined' && no_of_color == 0 && selColorsHtml == '') {
            $('.js_print_postion_location').append('<div class="js_summary_imprint_location_'+print_pos_id+'"><div class="estimate-row heading"><span>Print Position : '+printPos+'</span></div><div class="row"><div class="col-sm-12"><div class="js_product_summary_imprint_location_'+print_pos_id+'"><div class="estimate-row js_imprint_method_summary_'+print_pos_id+' hide">Imprint Method : <span></span></div> <div class="estimate-row js_color_number_summary_'+print_pos_id+' hide">How many colors : <span></span></div> <div class="estimate-row js_selected_color_summary_'+print_pos_id+' hide"></div></div></div></div></div>');
        }

        if(websiteConfiguration.transaction.request_quote.print_position.artwork.status == 0 && activetab == "#js-request-quote"){
            $(activetab).find('.art-pos-value').parent().remove();
        }

        if(websiteConfiguration.transaction.place_order.print_position.artwork.status == 0 && activetab != "#js-request-quote"){
            $(activetab).find('.art-pos-value').parent().remove();
        }
    }
    else{
        $(activetab).find("#js_imprint_request_quote_box_"+print_pos_id).remove();
        $('.js_summary_imprint_location_'+print_pos_id).remove(); //summary

        //summary for setup charges
        let total_setup_charge = 0;
        $(activetab).find(".imprint-method-select button").each(function(i) {
            let imprintMethod = $(this).attr('data-method');
            if(typeof imprintMethod != 'undefined' && imprintMethod != '') {
                let imprint_position = [];
                imprint_position.push({'imprint_method_name': imprintMethod});

                let setup_charge = calculate_setup_charge(imprint_position)
                if(setup_charge > 0)
                {
                    total_setup_charge = total_setup_charge + setup_charge;
                }
            }
        });
        $('.js-setup-charge-summary').find('span').html("$"+parseFloat(total_setup_charge).toFixed(project_settings.price_decimal))
        $('.js-setup-charge-summary').removeClass('hide');
        $('.js-additional-charges-summary').removeClass('hide');
        
        let shipp_charge = 0.00;
        let setup_charge = total_setup_charge;
        let totalPrice = $("#js_product_summary_charges .total_price").html().replace('$','');
        if($('.js-shipping-charge-summary').find('span').html() != '$0.00') {
            shipp_charge = $('.js-shipping-charge-summary').find('span').html().replace('$','');
        }
   
        let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge) + parseFloat(setup_charge);
        $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));
    }

    //summary for print position
    if($(activetab+' .js_add_imprint_location_request_quote:checked').length > 0) {
        $('#Quantity-quote, .js_print_postion_location').removeClass('hide');
    }
    else {
        $('.js_print_postion_location').addClass('hide');
    }
});


//upload artwork section start
$(document).on("click",activetab + " .js-upload-art-radio",function(){
    $('.js-upload-art').removeClass('hide');
    if(!$('.js-upload-email').hasClass('hide')) {
        $('.js-upload-email').addClass('hide');
    }

    //summary for upload artwork
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
    $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><div class="estimate-row js_sum_art_logo_1 hide">Uploaded Artwork 1 : <span><img src="#"></span></div><div class="estimate-row js_sum_art_logo_2 hide">Uploaded Artwork 2 : <span><img src="#"></span></div><br></div>');
});

$(document).on("click",activetab + " .js-upload-email-radio",function(){
    $('.js-upload-email').removeClass('hide');
    if(!$('.js-upload-art').hasClass('hide')) {
        $('.js-upload-art').addClass('hide');
    }

    //summary for upload artwork
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);
    let tab_id = $(this).closest(".art-pos-value").find('li.active a').attr('href');
    let art_email = $(this).closest(".art-pos-value").find(tab_id+' .js_artwork_email').text();
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
    $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><div class="estimate-row js_sum_art_email">Send Artwork via Email : <span>'+art_email+'</span></div><br></div>');
});

$(document).on("click",activetab + " .js-upload-art-type-radio",function(){
    $('.js-upload-art-type').removeClass('hide');
    if(!$('.js-upload-email-type').hasClass('hide')) {
        $('.js-upload-email-type').addClass('hide');
    }

    //summary for upload artwork
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
    $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><div class="estimate-row js_sum_art_logo_1 hide">Uploaded Artwork 1 : <span><img src="#"></span></div><div class="estimate-row js_sum_art_logo_2 hide">Uploaded Artwork 2 : <span><img src="#"></span></div><div class="estimate-row js_sum_art_text_1 hide">Text 1 : <span></span></div><div class="estimate-row js_sum_art_text_2 hide">Text 2 : <span></span></div><div class="estimate-row js_sum_art_textarea hide">Instructions: <span class="content-inline"></span></div><br></div>');
});

$(document).on("click",activetab + " .js-upload-email-type-radio",function(){
    $('.js-upload-email-type').removeClass('hide');
    if(!$('.js-upload-art-type').hasClass('hide')) {
        $('.js-upload-art-type').addClass('hide');
    }

    //summary for upload artwork
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);
    let tab_id = $(this).closest(".art-pos-value").find('li.active a').attr('href');
    let art_email = $(this).closest(".art-pos-value").find(tab_id+' .js_artwork_email').text();
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
    $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><div class="estimate-row js_sum_art_email">Send Artwork via Email : <span>'+art_email+'</span></div><br></div>');
});

$(document).on("click",activetab + ".js_add_logo",function(){
    let img_src = $(this).closest('.js-img-global').find('img').attr('src');
    if(typeof img_src == 'undefined' || img_src == '') {
        showErrorMessage("Please upload artwork.");
        return false;
    }
    $(this).addClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    //$('#js_is_logo_'+pos+'_2 input[type=file]').attr('disabled', false);
    $('#js_is_logo_'+pos+'_2').removeClass('hide');
});

$(document).on("click",activetab + " .js_remove_logo",function(){
    $('.js_add_logo').removeClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    //$('#js_is_logo_'+pos+'_2 input[type=file]').attr('disabled', true);
    $('#logo_show_'+pos+'_2').attr('src','');
    $('#logo_show_'+pos+'_2').addClass('hide');
    $('#logo_save_'+pos+'_2').attr('value','');
    $('#js_is_logo_'+pos+'_2').addClass('hide');

    //summary for upload artwork
    $('.js_sum_art_logo_2').find('img').attr('src','');
    $('.js_sum_art_logo_2').addClass('hide');
});

$(document).on("click",activetab + " .js_add_text",function(){
    let text_val = $(this).closest('.js-text-global').find('.js-art-text').val();
    if(typeof text_val == 'undefined' || text_val.trim() == '') {
        showErrorMessage("Please enter text.");
        return false;
    }
    $(this).addClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    $('#js_is_text_'+pos+'_2 input[type=text]').attr('disabled', false);
    $('#js_is_text_'+pos+'_2').removeClass('hide');
});

$(document).on("click",activetab + " .js_remove_text",function(){
    $('.js_add_text').removeClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    $('#js_is_text_'+pos+'_2 input[type=text]').val('');
    $('#js_is_text_'+pos+'_2 input[type=text]').attr('disabled', true);
    $('#js_is_text_'+pos+'_2').addClass('hide');

    //summary for upload artwork
    $('.js_sum_art_text_2').find('span').text('');
    $('.js_sum_art_text_2').addClass('hide');
});

$(document).on("click",activetab + " .js_add_logo_type",function(){
    let img_src = $(this).closest('.js-img-global').find('img').attr('src');
    if(typeof img_src == 'undefined' || img_src == '') {
        showErrorMessage("Please upload artwork.");
        return false;
    }
    $(this).addClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    //$('#js_is_logo_type_'+pos+'_2 input[type=file]').attr('disabled', false);
    $('#js_is_logo_type_'+pos+'_2').removeClass('hide');
});

$(document).on("click",activetab + " .js_remove_logo_type",function(){
    $('.js_add_logo_type').removeClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    //$('#js_is_logo_type_'+pos+'_2 input[type=file]').attr('disabled', true);
    $('#logo_type_show_'+pos+'_2').attr('src','');
    $('#logo_type_show_'+pos+'_2').addClass('hide');
    $('#logo_type_save_'+pos+'_2').attr('value','');
    $('#js_is_logo_type_'+pos+'_2').addClass('hide');

    //summary for upload artwork
    $('.js_sum_art_logo_2').find('img').attr('src','');
    $('.js_sum_art_logo_2').addClass('hide');
});

$(document).on("click",activetab + " .js_add_text_type",function(){
    let text_val = $(this).closest('.js-text-global').find('.js-art-text').val();
    if(typeof text_val == 'undefined' || text_val.trim() == '') {
        showErrorMessage("Please enter text.");
        return false;
    }
    $(this).addClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    $('#js_is_text_type_'+pos+'_2 input[type=text]').attr('disabled', false);
    $('#js_is_text_type_'+pos+'_2').removeClass('hide');
});

$(document).on("click",activetab + " .js_remove_text_type",function(){
    $('.js_add_text_type').removeClass('hide');
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    $('#js_is_text_type_'+pos+'_2 input[type=text]').val('');
    $('#js_is_text_type_'+pos+'_2 input[type=text]').attr('disabled', true);
    $('#js_is_text_type_'+pos+'_2').addClass('hide');

    //summary for upload artwork
    $('.js_sum_art_text_2').find('span').text('');
    $('.js_sum_art_text_2').addClass('hide');
});

$(document).on('click', '.js-upload-art-image', function(e) {
    let id = $(this).closest('.js-img-global').find('img').attr('id');
    let save_id = $(this).closest('.js-img-global').find('input[type=hidden]').attr('id');
    let pos = $(this).closest('.art-pos-value').attr('data-pos'); //summary
    let index = $(this).attr('data-index'); //summary
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text(); //summary
    let art_heading_undescore = replaceWithUnderscore(art_heading); //summary

    cloudinary.openUploadWidget({
        cloud_name: cloudinaryDetails.cloudName,
        api_key: cloudinaryDetails.apiKey,
        upload_preset: cloudinaryDetails.uploadPreset,
        sources: ['local', 'url'],
        public_id: website_settings['projectID']+'/artwork/'+Date.now(),
        multiple: false
    },
    function(error, result) {
        //console.log(error, result)
        if(typeof result != 'undefined') {
            $("#"+id).attr('src',result[0].thumbnail_url);
            if($('#'+id).hasClass( "hide" )) {
                $('#'+id).removeClass('hide');
            }
            $("#"+save_id).attr('value',result[0].url);

            //summary for upload artwork
            $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_logo_"+index).removeClass('hide');
            $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_logo_"+index).find('img').attr('src',result[0].thumbnail_url);
        }
    });

    //readImgUrl(this,e,id); // do not remove this comment.
});

//summary for upload artwork
$(document).on("click",activetab + " #js_imprint_request_quote li a",function(){
    let art_heading = $(this).text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);
    let pos = $(this).closest('.art-pos-value').attr('data-pos');

    $("*[class^=js_summary_artwork_"+pos+"]").addClass('hide');
    if(typeof $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).html() != 'undefined' && $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).html() != '') {
        $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).removeClass('hide');
        $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).html($(".js_summary_artwork_"+pos+"_"+art_heading_undescore).html());
    }
    else if(art_heading_undescore == 'typeset') {
        $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
        $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><div class="estimate-row js_sum_art_text_1 hide">Text 1 : <span></span></div><div class="estimate-row js_sum_art_text_2 hide">Text 2 : <span></span></div><div class="estimate-row js_sum_art_textarea hide">Instructions: <span class="content-inline"></span></div><br></div>');
    }
    else {
        $(".js_summary_artwork_"+pos+"_"+art_heading_undescore).remove();
        $('.js_product_summary_imprint_location_'+pos).after('<div class="js_summary_artwork_'+pos+'_'+art_heading_undescore+'"><div class="estimate-row heading js_sum_art_head"><span>'+art_heading+'</span></div><br></div>');
    }
});
$(document).on("keyup",activetab + ' .js-art-text',function(){
    let val = $(this).val();
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let index = $(this).attr('data-index');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);

    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_text_"+index).removeClass('hide');
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_text_"+index).find('span').text(val);
});
$(document).on("keyup",activetab + ' .js_artwork_instructions_text',function(){
    let val = $(this).val();
    let pos = $(this).closest('.art-pos-value').attr('data-pos');
    let art_heading = $(this).closest(".art-pos-value").find('li.active a').text();
    let art_heading_undescore = replaceWithUnderscore(art_heading);

    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_textarea").removeClass('hide');
    $(".js_summary_artwork_"+pos+"_"+art_heading_undescore+" .js_sum_art_textarea").find('span').text(val);
});
//upload artwork section end


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
    let setActivetab = activetab.replace(/\#/g, '');
    if (user_id == null && setActivetab !== "js-request-quote") {
        window.location = "login.html";
        return false;
    }

    let id = $(this).attr("id");

    if($(this).is(":checked")) {
        let hexCodeBgColor = $(this).parent().attr("style");

        Quantity = "<div class='quntity-count js_color_wise_qty' id='js_request_quote_qty_box_"+id+"'><div class='color-input' style='"+hexCodeBgColor+"' title='"+$(this).val()+"'><br></div><div class='selector-quantity js-quantity-section'><div class='selector-btn'><div class='sp-minus'><a data-multi='-1' href='javascript:void(0)' class='js-quantity-selector'>-</a></div>"+
        "<div class='selector-input'> <input type='text' value='0' class='selector-input js_request_quote_qty js_request_quote_nosize_qty' ></div><div class='sp-plus'><a data-multi='1' href='javascript:void(0)' class='js-quantity-selector'>+</a></div></div><div class='clearfix'></div></div><a href='javascript:void(0)' data-toggle='tooltip' class='js_request_quote_qty_remove remove-qty ui-icon-delete' data-id='"+id+"'>"+"<i class='fa fa-trash-o'></i></a></div>";

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
        let setActivetab = activetab.replace(/\#/g, '');

        let shippingAddressColorQtyAreaHtml = shippingAddressColorQtyAreaHtmlTemplate;
        let replaceQtyHtml = '';
        colorQtyHtml1 = shippingAddressColorQtyAreaHtml.replace(/#data.color#/g,colorName)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.colorhexcode#/g,hex_code)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.quantity#/g,qty)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.extraclass#/g,id)
        colorQtyHtml1 = colorQtyHtml1.replace(/#data.tabID#/g,setActivetab)

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

    //summary for color selection
    let totalQty = 0;
    if($(activetab+' .js_color_checkbox:checked').length > 0) {
        $("#Quantity-quote, .js_summary_qty").removeClass('hide');
        let qtyMerge = "";
        $(activetab+' .js_color_checkbox:checked').each(function() {
            let colorName = $(this).val();
            let color_name = $(this).attr('id');
            let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());

            qtyMerge = qtyMerge + '<tr id="js_row_summary_qty_'+color_name+'"><td width="20%">'+colorName+' </td><td><span>: '+qty+'</span></td></tr>';

            totalQty = totalQty + parseFloat(qty);
        });
        $('#js_product_summary_qty').html("<tbody>"+qtyMerge+"</tbody>");

        $(".total_quantity").html(totalQty);
        $(".jsTotal, .estimate-total-block").removeClass('hide');
    }
    else {
        $("#Quantity-quote, .js_summary_qty").addClass('hide');
    }

    //summary for total price
    let totalPrice = 0.00; //summary
    var productDetails = get_product_details;
    if(productDetails.pricing != undefined){
        let priceRang = '';
        $.each(productDetails.pricing, function(index,element){
            if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global")
            {
                $.each(element.price_range,function(index,element2){
                    if(element2.qty.lte != undefined) {
                        if(totalQty >= element2.qty.gte && totalQty <= element2.qty.lte) {
                            totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                        }
                    }
                    else
                    {
                        if(totalQty >= element2.qty.gte) {
                            totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                        }
                    }
                });
            }
        });
    }
    $("#js_product_summary_charges .total_price").html('$'+parseFloat(totalPrice).toFixed(project_settings.price_decimal));

    //summary for shipping charges
    let shipp_charge = 0.00;
    let setup_charge = 0.00;
    if($("#js-product-summary-container").length > 0)
    {
        if($('.js-shipping-charge-summary').find('span').html() != '$0.00') {
            shipp_charge = $('.js-shipping-charge-summary').find('span').html().replace('$','');
        }
        if($('.js-setup-charge-summary').find('span').html() != '$0.00') {
            setup_charge = $('.js-setup-charge-summary').find('span').html().replace('$','');
        }
        let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge) + parseFloat(setup_charge);
        $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));
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

      //summary for address inhand date
      $('.js_inhand_date_'+shipCounter).find('span').html($(activetab).find(parentObj).find(activetab+"_datetimepicker"+shipCounter).val());
      $('#Quantity-quote, .js_inhand_date_'+shipCounter).removeClass('hide');
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
            let checkMiniQuantity = true;
            
            if(websiteConfiguration.transaction.place_order.check_minimum_qty.status == 0 && activetab != "#js-request-quote"){
                checkMiniQuantity = false;
            }
            else if(websiteConfiguration.transaction.request_quote.check_minimum_qty.status == 0 && activetab == "#js-request-quote"){
                checkMiniQuantity = false;                
            }

            if(checkMiniQuantity)
            {
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
              /*else if(!isEmpty(shippingData.shipping_detail) && shippingData.shipping_detail.shipping_carrier == ''){
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
                  }*/
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
    let qtyShow = "";
    let totalQty = 0; //summary
    let totalPrice = 0.00; //summary
    
    $('.js_color_checkbox:checked').each(function() {
        let colorName = $(this).val();
        let color_name = $(this).attr('id');
        let qty = parseInt($("#js_request_quote_qty_box_"+color_name+" input.js_request_quote_qty").val());
        colors_qty[colorName] = qty;

        //summary for quantity selection
        qtyShow = qtyShow + '<tr id="js_row_summary_qty_'+color_name+'"><td width="20%">'+colorName+' </td><td><span>: '+qty+'</span></td></tr>';

        totalQty = totalQty + parseFloat(qty);
    });
    
    //summary for total price
    var productDetails = get_product_details;
    if(productDetails.pricing != undefined){
        let priceRang = '';
        $.each(productDetails.pricing, function(index,element){
            if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global")
            {
                $.each(element.price_range,function(index,element2){
                    if(element2.qty.lte != undefined) {
                        if(totalQty >= element2.qty.gte && totalQty <= element2.qty.lte) {
                            totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                        }
                    }
                    else
                    {
                        if(totalQty >= element2.qty.gte) {
                            totalPrice = totalQty*parseFloat(element2.price).toFixed(project_settings.price_decimal);
                        }
                    }
                });
            }
        });
    }
    if(totalPrice === 0)
    {
        let setActivetab = activetab.replace(/\#/g, '');
        $("#"+setActivetab+"-Quantity-block").find('.js-section-errors').remove();   
        $("#"+setActivetab+"-Quantity-block").append('<div class="red js-section-errors">Quantity should be equal to or greater than the minimum quantity.</div>');
    }
    else{
        let setActivetab = activetab.replace(/\#/g, '');
        $("#"+setActivetab+"-Quantity-block").find('.js-section-errors').remove(); 
        $('#js_product_summary_qty').html(qtyShow);
        $(".total_quantity").html(totalQty); //summary
    
        $('.js_shipping_qty_box_main .js_request_quote_shipping_qty_box').each(function(i) {
            if(selectedShippingType == 'standard')
            {
                let colorName = $(this).closest('.js_rq_shipping_quantity').data('color-id');
                $(this).val(colors_qty[colorName]);
                // Trigger change event for updating shipping details
                $(this).trigger('change');
            }
        });
        
        $("#js_product_summary_charges .total_price").html('$'+parseFloat(totalPrice).toFixed(project_settings.price_decimal));
        
        //summary for shipping charges
        let shipp_charge = 0.00;
        let setup_charge = 0.00;
        if($("#js-product-summary-container").length > 0)
        {
            if($('.js-shipping-charge-summary').find('span').html() != '$0.00') {
                shipp_charge = $('.js-shipping-charge-summary').find('span').html().replace('$','');
            }
            if($('.js-setup-charge-summary').find('span').html() != '$0.00') {
                setup_charge = $('.js-setup-charge-summary').find('span').html().replace('$','');
            }
            let final_price = parseFloat(totalPrice) + parseFloat(shipp_charge) + parseFloat(setup_charge);
            $("#js_product_summary_charges .final_price").html('$'+parseFloat(final_price).toFixed(project_settings.price_decimal));
        }
    }
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
                let currentAddressCounter1 = $(this).closest('.js_shipping_method_detail').attr('data-shipping-counter');
				
				// First remove the current address
				$(activetab + ' #js_shipping_method_detail_'+currentAddressCounter1).remove();
                
                let setActivetab = activetab.replace(/\#/g, '');
                if(setActivetab == "js-request-quote" && user_details == null)
                {
                    if(localStorage.getItem('requestQuoteAddress') != null)
                    {
                        let addressRemove = JSON.parse(localStorage.getItem('requestQuoteAddress'));
                        addressRemove.splice(parseInt(currentAddressCounter1)-1, 1);
                        localStorage.setItem('requestQuoteAddress',JSON.stringify(addressRemove));
                    }
                }
				//summary for shipping address split
				$('#js_shipp_address_details_'+currentAddressCounter).remove();
				if(shippingCounter == currentAddressCounter) {
				    $('#js_shipp_address_details_'+currentAddressCounter).find('counter').html((currentAddressCounter-1));
				}
				
				// Now shift the other addresses one step up
				for(i=(currentAddressCounter+1);i<=shippingCounter;i++)
				{
					$(activetab + ' #js_shipping_method_detail_'+i).attr('id','js_shipping_method_detail_'+(i-1))
					$(activetab + ' #js_shipping_method_detail_'+(i-1)).attr('data-shipping-counter',(i-1))
					$(activetab + ' #js_shipping_method_detail_'+(i-1)+' .option-head a:first' ).html('Shipping Address '+(i-1))
					$('#js_shipp_address_details_'+i).find('counter').html((i-1)); //summary
                }
                let shippingCounterTemp = shippingCounter
				$(activetab+" .js_request_quote_shipping_counter").val((shippingCounterTemp-1));
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


function setSelectedAddress(addressBookId,shippigCounter,carrierData = null)
{
    axios({
        method: 'GET',
        url: project_settings.address_book_api_url+'/'+addressBookId,
      })
    .then(async response => {
        if(response.data != undefined ){
            let returnData = response.data; 
            // console.log('returnData', returnData)
            let city = await getCountryStateCityById(returnData.city,3);
            let state = await getCountryStateCityById(returnData.state,2);
            let country = await getCountryStateCityById(returnData.country,1);

            // console.log('::::::::::::::', get_product_details)
            if (typeof get_product_details.shipping == 'undefined') {
              console.log('No Shipping FOUND')
            }
            let shipping_details = get_product_details.shipping[0];
            // console.log('shipping_details', shipping_details)
              if(shipping_details.fob_city == '' || shipping_details.fob_state_code == '' || shipping_details.fob_zip_code == '' || shipping_details.fob_country_code == ''){
                    $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_option").html('')
              }

              let getLocation = await getStreetLocation(shipping_details.fob_zip_code)
              let getStreet = await getStreetData(getLocation)
              // console.log('getStreet', getStreet, getLocation)
              var addressFrom  = {
                  "name": shipping_details.fob_city,
                  "street1": getStreet,
                  "city": shipping_details.fob_city,
                  "state": shipping_details.fob_state_code,
                  "zip": shipping_details.fob_zip_code,
                  "country": shipping_details.fob_country_code,
                  // "phone": "+1 555 341 9393",//optional
                  // "email": "shippotle@goshippo.com",//optional
                  // "validate": true//optional
              };

              var addressTo  = {
                  "name": returnData.name,
                  "street1": returnData.street1,
                  "city": city,
                  "state": state,
                  "zip": returnData.postalcode,
                  "country": country,
                  // "phone": "+1 555 341 9393",//optional
                  // "email": "shippotle@goshippo.com",//optional
                  // "validate": true//optional
              };
              //console.log('addressFrom ::', addressFrom);
              let sCode = await getStateCode(returnData.state, 2)
              if (sCode != null) {
                let verify_address_to = await verifyAddress(addressTo, sCode)
                let verify_address_from = await verifyAddress(addressFrom, sCode)
                //console.log('verify_address ::', verify_address_to, verify_address_from)
                if(!verify_address_to){
                    hidePageAjaxLoading()
                    showErrorMessage("Please add correct shipping address.")
                    return false;
                }
                // showSuccessMessage()
                
              } else {
                console.log('STATE CODE NOT FOUND')
              }

            let replaceAddressHtml = '';
            replaceAddressHtml += returnData.name+"<br>";
            replaceAddressHtml += returnData.email+"<br>";
            replaceAddressHtml += returnData.street1+"<br>,";
            if(returnData.street2 != undefined){
              replaceAddressHtml += returnData.street2+"<br>";
            }
            // change
            // let city = await getCountryStateCityById(returnData.city,3);
            replaceAddressHtml += city+",";

            // let state = await getCountryStateCityById(returnData.state,2);
            replaceAddressHtml += state+",";
            // console.log('returnData.state ::::', returnData.state)
            // let country = await getCountryStateCityById(returnData.country,1);
            if(cid == null)
            {
                changeShippingDetails(shippigCounter);
                //$('#js_shipping_method_detail_'+shippigCounter).find('.js_rq_ship_shippingcarrier').html('Select Carrier <span class="caret"></span>');
            }
            //$('#js_shipping_method_detail_'+shippigCounter).find('.js_rq_ship_shippingcarrier').attr('data-value','');
            replaceAddressHtml += country;
            // END -Change

            if(typeof returnData.postalcode != "undefined" && returnData.postalcode != ''){
              replaceAddressHtml += "-"+returnData.postalcode+"<br>";
            }
            if(typeof returnData.phone != "undefined" && returnData.phone != ''){
              replaceAddressHtml += "T: "+returnData.phone+",<br>";
            }
            if(typeof returnData.mobile != "undefined" && returnData.mobile!= ''){
              replaceAddressHtml += "M: "+returnData.mobile+"<br>";
            }
            replaceAddressHtml += '<input class="shippingAddressId" name="shippingAddressId" value="'+returnData.id+'" type="hidden">';
            addressBookHtml = addressBookHtmlTemplate;

            let appendAddress = ""; //summary
            if(addressBookHtml.indexOf("#data.address#")!= -1){
                addressBookHtml = addressBookHtml.replace(/#data.address#/g,replaceAddressHtml);
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(addressBookHtml);
                appendAddress = addressBookHtml; //summary
            }else{
                $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses p").html(replaceAddressHtml);
                appendAddress = replaceAddressHtml; //summary
            }
            $(activetab).find("#js_shipping_method_detail_"+shippigCounter+" .js_shipping_addresses").removeClass("hide");

            //summary for shipping address
            if($("#js_shipp_address_details_"+shippigCounter).length) {
                $("#js_shipp_address_details_"+shippigCounter+" .js_shipp_address_block span").html(appendAddress);
            }
            else {
                $('.js_shipp_address_data').append('<div id="js_shipp_address_details_'+shippigCounter+'" class="js_shipp_address_details" style="padding-top: 10px;"><div class="estimate-row"><b>Shipping Address <counter>'+shippigCounter+'</counter> :</b></div><div class="row"><div class="col-sm-12"><div class="estimate-row js_shipp_address_block"><span>'+appendAddress+'</span></div></div></div><div class="estimate-row js_address_carrier_'+shippigCounter+' hide">Shipping Carrier : <span></span></div><div class="estimate-row js_address_method_'+shippigCounter+' hide">Method : <span></span></div><div class="estimate-row js_inhand_date_'+shippigCounter+' hide">In Hand Date : <span></span></div>');
            }

            if(carrierData != null) {
                $(".js_address_carrier_"+shippigCounter+" span").html(carrierData['shipping_carrier']);
                $(".js_address_carrier_"+shippigCounter).removeClass('hide');

                $(".js_address_method_"+shippigCounter+" span").html(carrierData['shipping_method']);
                $(".js_address_method_"+shippigCounter).removeClass('hide');

                $('.js_inhand_date_'+shippigCounter).find('span').html(carrierData['on_hand_date']);
                $('.js_inhand_date_'+shippigCounter).removeClass('hide');
            }

            let shipping_type = $(activetab).find('input[name=request_quote_shipping_type]:checked').val();
            if(shipping_type == 'standard') {
                $('.js_shipp_address_details').find('counter').html('');
            }
            
            $('#Quantity-quote, .js_shipp_address_data').removeClass('hide');


            // change
              // console.log("addressTo",addressTo);

              if(websiteConfiguration.transaction.shipping_estimator.shipping_carrier.fedex.status == 0){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li[data-value="fedex"]').remove();
              }

              if(websiteConfiguration.transaction.shipping_estimator.shipping_carrier.ups.status == 0){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_select_shipping_carrier_method li[data-value="ups"]').remove();
              }

              if(websiteConfiguration.transaction.place_order.shipping.inhand_date.status == 0 && activetab != "#js-request-quote"){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_handdate').parent().parent().remove();
              }

              if(websiteConfiguration.transaction.place_order.shipping.shipping_carrier.status == 0 && activetab != "#js-request-quote"){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_shipping_option').remove();
              }

              //quote

              if(websiteConfiguration.transaction.request_quote.shipping.inhand_date.status == 0 && activetab == "#js-request-quote"){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_rq_ship_handdate').parent().parent().remove();
              }

              if(websiteConfiguration.transaction.request_quote.shipping.shipping_carrier.status == 0 && activetab == "#js-request-quote"){
                $(activetab).find('#js_shipping_method_detail_'+shippigCounter+' .js_shipping_option').remove();
              }

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

                      //summary for shipping carrier
                      let address_carrier = $(this).find('a').text();
                      $('.js_address_carrier_'+shippigCounter).find('span').html(address_carrier);
                      $('#Quantity-quote, .js_address_carrier_'+shippigCounter).removeClass('hide');

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
                    
                    //summary for address inhand date
                    $('.js_inhand_date_'+shippigCounter).find('span').html(date);
                    $('#Quantity-quote, .js_inhand_date_'+shippigCounter).removeClass('hide');
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

// async function getStreetLocation(ZipCode){
//    var resp = "";
//     await axios({
//         method: 'GET',
//         url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB8lRsIznCRCJAWjf8-Zd-NjOAdxXZW680&address={"+ZipCode+"}&sensor=true",
//         })
//     .then(async function (response) {
//         resp = response.data.results[0].geometry.location.lat+","+response.data.results[0].geometry.location.lng;
//         return resp;
//     })
//     .catch(function (error) {
//         // console.log("error",error);
//     });
//     return resp;
// }

// async function getStreetData(location){
//     var resp = "";
//     await axios({
//         method: 'GET',
//         url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB8lRsIznCRCJAWjf8-Zd-NjOAdxXZW680&latlng="+location+"&sensor=true",
//     })
//     .then(function (response1) {
//         // console.log("response1",response1);        
//         let resp1 = response1.data.results[0].formatted_address.split(",");
//         resp = resp1[0]
//         return resp;
//     })
//     .catch(function (error) {
//         // console.log("error",error);
//     })
//     return resp;
// }
//summary for special instruction
$(document).on("keyup", activetab + ' .js-specialInstruction-section textarea',function(){
    $('.js_summary_instruction').html($(this).val());
    $('#Quantity-quote, .js_special_inst').removeClass('hide');
});

function submitRequestInfo(productData,instruction,guestUserDetail){
  let data = {'product_id':pid,'product_data':productData,'user_detail':user_details,'instruction':instruction,'culture':project_settings.default_culture,'guest_user_detail':guestUserDetail,"website_id":website_settings['projectID'],"websiteName":website_settings['websiteName'],"owner_id":website_settings['UserID']};
  $.ajax({
        type: 'POST',
        url: project_settings.request_info_api_url,
        // data: {product_api_url:project_settings.product_api_url,'user_detail':user_details,'form_data':formObj.serializeFormJSON(),'culture':project_settings.default_culture,'guest_user_detail':null,"website_id":"bb1e5568-f907-4583-9259-42019a2352cc"},
        data: data,
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
}

$(document).on('click','.js-submit-btn',function (e) {
      let formId = $(this).closest("form").attr("id")
      $("form#"+formId).validate({
          rules: {
            "fullName" : "required",
            "phone" : {
              required:true,
              minlength: 12
            },
            "email":{
              required:true,
              email: true
            },
            "company_name" : "required",
            "zipcode" : "required"
          },
          messages: {
            "fullName" : "Please enter name.",
            "phone" : {
              required : "Please enter phone number.",
              minlength: "Please enter valid phone number."
            },
            "email":{
              required:"Please enter email",
              email: "Please enter valid email."
            },
            "company_name" : "Please enter company name.",
            "zipcode" : "Please enter Postal code."
          },
          errorElement: "li",
          errorPlacement: function(error, element) {
            //console.log("error",error);
            //console.log("element",element);
            error.appendTo(element.closest("div"));
            $(element).closest('div').find('ul').addClass('red')
          },
          errorLabelContainer: "#errors",
          wrapper: "ul",
          submitHandler: function(form) {
            //console.log("+++++++++++++++++++");
             let guestUserDetail = $(form).serializeFormJSON()
             let productData = get_product_details
             let instruction = $(activetab).find("textarea[name='note']").val()
             submitRequestInfo(productData,instruction,guestUserDetail)
            // console.log("data",data);
            return false;
          }
      }).form()

})

if (user_id != null ) {
    if(websiteConfiguration.transaction.request_info.registered_user.status == 0){
        $("a[href='#js-request-info']").parent().remove();
        let html = 'Access Denied';
        $('#js-request-info').html(html);
    }
}
else{
    if(websiteConfiguration.transaction.request_info.guest_user.status == 0){
        $("a[href='#js-request-info']").parent().remove();
        let html = 'Access Denied';
        $('#js-request-info').html(html);
    }
}

if (user_id != null ) {
    if(websiteConfiguration.transaction.request_quote.registered_user.status == 0){
        $("a[href='#js-request-quote']").parent().remove();
        let html = 'Access Denied';
        $('#js-request-quote').html(html);
    }
}
else{
    if(websiteConfiguration.transaction.request_quote.guest_user.status == 0){
        $("a[href='#js-request-quote']").parent().remove();
        let html = 'Access Denied';
        $('#js-request-quote').html(html);
    }
}