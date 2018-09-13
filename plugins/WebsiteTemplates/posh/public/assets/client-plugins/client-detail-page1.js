let pid = getParameterByName('pid');
let cid = getParameterByName('cid');
localStorage.setItem("guestPersonalInfo","")
localStorage.removeItem("requestQuoteAddress");

if(pid != null) {
    var get_product_details = function () {
        let tmp = null;
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
                  let err = eval("(" + xhr.responseText + ")");
            },
        });
        return tmp;
      }();
  
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
  
        //   recentlyViewedProducts(recentViewedProducts);
      }
  }
console.log('get_product_details',get_product_details)

$(document).ready( async function(){
    if(get_product_details == null ){
        hidePageAjaxLoading()
        window.location = "error404.html";
        return false;
    }
    var productDetails = get_product_details;
    ProductName = productDetails.product_name;
    ProductImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
    if(productDetails.images != undefined)  {
        ProductImage = productDetails.images[0].images[0].secure_url;//productDetails.default_image;
    }
    else {
    $("#download_image").parent('li').remove()
    }

    ProductSku = productDetails.sku;
    hasImprintData = productDetails.imprint_data;

    let listHtml = $('#title .row').html();
    let titleAndSkuHtml = listHtml.replace(/#data.product_name#/g,ProductName);
    let breadcrumbHtml = $(".breadcrumb").html();
    breadcrumbHtml = breadcrumbHtml.replace(/#data.title#/g,ProductName)
    
    $(".breadcrumb").html(breadcrumbHtml);
    $('#title .row').html(titleAndSkuHtml);
    let productImageUrl = ProductImage;
    $('#product_img').attr("src",productImageUrl)
    $('#product_img').data("zoom-image",productImageUrl)
    $('#product_img').data("orig-img",productImageUrl)

    $('.js-product_sku').html(ProductSku);

    // product colors
    if(productDetails.attributes.colors != undefined && productDetails.attributes.colors.length > 0) {
        let sampleColorHtml = '';
        $('.sample_color_append').html('');
        let colorsHexVal = await replaceColorSwatchWithHexaCodes(productDetails.attributes.colors,"color");
        $.each(productDetails.attributes.colors, function(index_color,element_color){
            let colorVal = element_color.toLowerCase();
            colorVal = colorVal.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(-)+|(-)+$/g,'').toLowerCase();
            
            let element_color_style = "background-color:"+element_color+";"
            if(colorsHexVal != null && colorsHexVal[element_color] != undefined){
                if(typeof colorsHexVal[element_color].hexcode != 'undefined'){
                    element_color_style = "background-color:"+colorsHexVal[element_color].hexcode+";"
                }
                else if (typeof colorsHexVal[element_color].file != 'undefined') {
                    element_color_style = "background-image:url("+colorsHexVal[element_color].file.url+");"
                }
            }

            //order sample start
            sampleColorHtml += '<tr> <td> <div class="checkbox_color" style="'+element_color_style+'" title="'+element_color+'"> <input class="js_color_checkbox" type="checkbox" name="sample_color[]" id="sample_'+colorVal+'" value="'+element_color+'" data-hex-code="'+element_color+'" /> <label for="Decoration_'+colorVal+'"></label> </div></td><td> <input type="text" name="sample_quantity[]" class="input" placeholder="Enter Quantity"> </td></tr>';
            //order sample end
        });

        $('.sample_color_append').html(sampleColorHtml);
    }

    // Add Variation Images
    let imageGallaryHtml = '<ul>';
    
    if(productDetails.images != undefined){
        for (let element of productDetails.images[0].images) {
            let imageUrl = element.secure_url;
            let color = element.color;
            color = color.toLowerCase().replace(/\s/g, '-');
            imageGallaryHtml += '<li class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_'+color+'_link" data-zoom-image="'+imageUrl+'">';
            imageGallaryHtml += '<img data-orig-img-'+color+'="'+imageUrl+'" src="'+imageUrl+'" class="clr_'+color+' lazyLoad" alt="'+ProductName+'" title="'+ProductName+'" /></a><input type="hidden" id="var_img_clr_id" value="clr_'+element.color+'"/></li>';
        }
    }
    else
    {
      imageGallaryHtml += '<li class="slide"><a href="javascript:void(0);" class="product-thumb-img-anchar  clr_default_link" data-zoom-image="'+productImageUrl+'">';
      imageGallaryHtml += '<img data-orig-img-default="'+productImageUrl+'" src="'+productImageUrl+'" class="clr_default lazyLoad" alt="'+ProductName+'" title="'+ProductName+'" /></a><input type="hidden" id="var_img_clr_id" value="clr_default"/></li>';
    }
    imageGallaryHtml +='</ul>'

    $(".js-image-gallery").html(imageGallaryHtml);
    // END - Add Variation Images

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

        // QUANTITY PRICE TABLE START
        $(".quantity-table-col").owlCarousel({ 
            loop:false,
            items:3,
            responsiveClass:true,
            nav:true,
            responsive:{
                0:{items:2,},
                500:{items:2,},
                600:{items:3,},
                800:{items:3,},
                900:{items:3,},
                1024:{items:3,},
                1200:{items:5,}
            }
        });
        // END QUANTITY PRICE TABLE END

        // Zoom Image
        $('.product-gallery').zoom({ on:'click' });
        $(".product-thumb-img-anchar").on('click', function () {
                $('.product-gallery').trigger('zoom.destroy');
                var img_src = $(this).find("img").attr("src");
                $(".product-big-image").find("img").attr("src", img_src);
                $('.product-gallery').zoom({ on:'click' });
        });

        //product description
        if(typeof productDetails.description !== "undefined" && productDetails.description != '') {
            $('.js-product_description_text').html(productDetails.description);
        }

        //Specification

        if(typeof productDetails.description !== "undefined" && productDetails.description != '') 
        {
            let fetureList = '';
            for (let [i, features] of productDetails.features.entries() ) {
                fetureList += "<li>"+features.value+"</li>";
            }
            $('.js-specification').html(fetureList);
        }
        // Shipping
        if(productDetails.shipping instanceof Array) {
            if(productDetails.shipping[0].free_on_board != undefined && productDetails.shipping[0].free_on_board != ''){
                fob = productDetails.shipping[0].free_on_board;
                $('.js-product-shipping-text').append("<strong>FOB:</strong> "+fob+"<br/>");
            }
            if(productDetails.shipping[0].carton_length != undefined && productDetails.shipping[0].carton_length != ''){
                carton_length = productDetails.shipping[0].carton_length+" "+productDetails.shipping[0].carton_size_unit;
                $('.js-product-shipping-text').append("<strong>Carton Length:</strong> "+carton_length+"<br/>");
            }
            if(productDetails.shipping[0].carton_weight != undefined  && productDetails.shipping[0].carton_weight != ''){
                carton_weight = productDetails.shipping[0].carton_weight+" "+productDetails.shipping[0].carton_weight_unit;
                $('.js-product-shipping-text').append("<strong>Carton Weight:</strong>"+carton_weight+"<br/>");
            }
            if(productDetails.shipping[0].shipping_qty_per_carton !=undefined  && productDetails.shipping[0].shipping_qty_per_carton != ''){
                shipping_qty_per_carton = productDetails.shipping[0].shipping_qty_per_carton;
                $('.js-product-shipping-text').append("<strong>Qty Per Carton:</strong>"+shipping_qty_per_carton+"<br/>");
            }
        }
        // END

        // Decoration option - Imprint
        if(productDetails.imprint_data instanceof Array) {
            let imprint_data = productDetails.imprint_data;
            let decorationSectionHtml = '';

            for(let item in imprint_data)
            {
                let decorationHtml = '';
                let imprintDetails = imprint_data[item];
                
                if(typeof imprintDetails.imprint_method !== "undefined" && imprintDetails.imprint_method != '') {
                    decorationHtml +="<strong>Method:</strong> "+imprintDetails.imprint_method+"<br>";
                }
                
                if(typeof imprintDetails.imprint_position !== "undefined" && imprintDetails.imprint_position != '') {
                    decorationHtml +="<strong>Location:</strong> "+imprintDetails.imprint_position+"<br>";
                }

                if(typeof imprintDetails.setup_charge !== "undefined" && imprintDetails.setup_charge != '') {
                    decorationHtml +="<strong>Set up charge:</strong> "+imprintDetails.setup_charge+"<br>";
                }

                if(typeof imprintDetails.max_imprint_color_allowed !== "undefined" && imprintDetails.max_imprint_color_allowed != '') {
                    decorationHtml +="<strong>Max Colors:</strong> "+imprintDetails.max_imprint_color_allowed+"<br>";
                }

                if(typeof imprintDetails.imprint_area !== "undefined" && imprintDetails.imprint_area != '') {
                    decorationHtml +="<strong>Decoration Size: </strong> "+imprintDetails.imprint_area+"<br>";
                }
                

                decorationSectionHtml += '<div class="col-lg-4 col-sm-6 col-md-3 col-xs-12"><div class="specifiction"><div class="decoMethodBox">'+decorationHtml+'</div></div></div>';
            }
            $('.js-decoration_option').html(decorationSectionHtml);
        }
        //END
        if(productDetails.video_url == "" && $("#js-show_play_video").length > 0)
        {
            $("#js-show_play_video").parent().remove();
        }
})