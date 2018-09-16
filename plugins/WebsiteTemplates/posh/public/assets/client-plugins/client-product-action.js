$(document).ready(function(){
    let pid = getParameterByName('pid');
    if($("#order_sample").length > 0){
        let link = $("#order_sample").attr("href")//.replace("#data.productId#",pid)
        link = link.replace("#data.productId#",pid)
        $("#order_sample").attr("href",link)

    }
    // download variation images
    $("#download_image").on("click",async function(){
        let productResponse = await getProductDetailById(pid)
        if(productResponse != null && productResponse.images != undefined){
            // console.log("productResponse",productResponse);
            let zip = new JSZip();
            let count = 0;
            let zipFilename = productResponse.sku+".zip";
            let urls = productResponse.images[0].images;
// console.log("urls",urls,zipFilename);
            urls.forEach(function(urlObj){
              let filename = urlObj.web_image;
              // loading a file and add it in a zip file
              JSZipUtils.getBinaryContent(urlObj.secure_url, function (err, data) {
                 if(err) {
                    throw err; // or handle the error
                 }
                 zip.file(filename, data, {binary:true});
                 count++;
                 if (count == urls.length) {
                   zip.generateAsync({type:'blob'}).then(function(content) {
                    //  window.location = "data:application/zip;base64," + content;
                      saveAs(content, zipFilename);
                      // location.href="data:application/zip;base64," + content;
                   });
                }
              });
            });
        }
    })

    $(document).on('click','#js-show_play_video', async function (e) {
        let productResponse = await getProductDetailById(pid)
        if(productResponse.video_url.trim() != '') {
            $('#modal-table').attr('class','modal fade model-popup-black');
            $("#modal-table").find(".modal-title").html('<i class="strip video-popup-strip"></i>Play Video');
            $("#modal-table").find(".modal-dialog").addClass("play-video");
            $(".js-play_video_block .play-video-block").html('<iframe frameborder="0" allowfullscreen="1" title="YouTube video player" width="573" height="350" src="'+productResponse.video_url+'"></iframe>');
            let guestUserHtml = $(".js-play_video_block").html();
            //let replaceHtml = guestUserHtml.replace("#data.video_url#",productResponse.video_url);
            $(".js_add_html").html(guestUserHtml)
            $('#modal-table').modal('show');
            return false;
        }
    });

    $(document).on('click','#js-share_product', function (e) {
        $('#modal-table').attr('class','modal fade model-popup-black');
        $("#modal-table").find(".modal-title").html('<i class="strip share-popup-strip"></i>Share Product');
        $("#modal-table").find(".modal-dialog").removeClass("play-video");
        let guestUserHtml = $(".js-share_product_html").html();
        $(".js_add_html").html(guestUserHtml)
        $('#modal-table').modal('show');

        // var switchTo5x=true;
        $.getScript("http://w.sharethis.com/button/buttons.js", function(){
            stLight.options({publisher: "2c09b640-d455-4fbb-a9c9-1046dc187914", doNotHash: false, doNotCopy: false, hashAddressBar: false, popup: 'true'});
            // stLight.options({publisher: "c68c8f6c-c670-419b-b8e2-23772e22a861", doNotHash: false, doNotCopy: false, hashAddressBar: false, popup: 'true'});
            stButtons.locateElements();
        });

        return false;
    });
});

// inventory start
let inventoryData = [];
$(document).on('click','#js-check-inventory', async function (e) {
    $('.js-inventory-colors').html('');
    let productResponse = await getProductDetailById(pid)
    if(productResponse.inventory != 'undefined' && Array.isArray(productResponse.inventory) && productResponse.inventory.length > 0) {
        $.each(productResponse.inventory, function(i,element){
            let colorInventoryColors = "";
            $.each(element.attributes.colors, async function(j,color){
                inventoryData[color] = parseInt(element.qty_on_hand);
                let element_color_style = "background-color:"+color+";"
                let colorsHexVal = await replaceColorSwatchWithHexaCodes(color,"color");
                if(colorsHexVal != null && colorsHexVal[color] != undefined){
                    if(typeof colorsHexVal[color].hexcode != 'undefined'){
                        element_color_style = "background-color:"+colorsHexVal[color].hexcode+";"
                    }
                    else if (typeof colorsHexVal[element_color].file != 'undefined') {
                        element_color_style = "background-image:url("+colorsHexVal[color].file.url+");"
                    }
                }
                colorInventoryColors = '<li role="presentation"><a class="Color-box" data-value="'+color+'" style="'+element_color_style+'" role="menuitem" tabindex="-1" href="javascript:;"></a></li>';
                $('.js-inventory-colors').append(colorInventoryColors);
            });
        });
    }
});
$(document).on('click','.js-inventory-colors li', function (e) {
    if($(this).find('a').attr("style") != 'undefined' && $(this).find('a').attr("style") != '') {
        $('.js-current-color').attr('data-value',$(this).find('a').data("value"))
        $('.js-current-color').attr('style',$(this).find('a').attr("style"))
    }
});
$(document).on('click','.js-inventory-submit', function (e) {
    let colorName = $('.js-current-color').attr('data-value');
    let enteredQty = $('.js-inventory-quantity').val();

    if(colorName == undefined || colorName == '') {
        $('.js-inventory-msg').css('color','red');
        $('.js-inventory-msg').html('Please select color.');
        return false;
    }
    else if(Math.floor(enteredQty) == enteredQty && $.isNumeric(enteredQty)) {
        if(enteredQty <= inventoryData[colorName]) {
            $('.js-inventory-msg').css('color','green');
            $('.js-inventory-msg').html('In Stock');
            return false;
        }
        else {
            $('.js-inventory-msg').css('color','red');
            $('.js-inventory-msg').html('Not in Stock');
            return false;
        }
    }
    else {
        $('.js-inventory-msg').css('color','red');
        $('.js-inventory-msg').html('Please enter valid quantity.');
        return false;
    }
});
// inventory end

// order sample start
$(document).on('click','#sample_submit',function (e) {
    $("form#sample_order_form").validate({
        rules: {
            "sample_fname" : "required",
            "sample_lname" : "required",
            "sample_phone" : {
                required:true,
                minlength: 10
            },
            "sample_email":{
                required:true,
                email: true
            }
        },
        messages: {
            "sample_fname" : "Enter valid first name.",
            "sample_lname" : "Enter valid last name.",
            "phone" : {
                required : "Please enter phone number.",
                minlength: "Please enter valid phone number."
            },
            "sample_email":{
                required:"Please enter email",
                email: "Please enter valid email."
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
            let form_data = formObj.serializeArray();
            let orderSample = {};
            let productJsonData = {};
            let sampleColors = [];
            let qtyTotal = singlePrice = 0;

            $('input[name^="sample_quantity"]').each(function() {
                let qty = $(this).val();
                if(Math.floor(qty) == qty && $.isNumeric(qty)) {
                    let clr = $(this).closest('tr').find('.js_color_checkbox').val();
                    sampleColors.push({'color':clr,'qty':qty});
                    qtyTotal += parseInt(qty);
                }
            });

            if(get_product_details.pricing != undefined){
                $.each(get_product_details.pricing, function(index,element){
                    if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global") {
                        $.each(element.price_range,function(index,element2){
                            if(element2.qty.lte != undefined){
                                if(qtyTotal >= element2.qty.gte && qtyTotal <= element2.qty.lte) {
                                    singlePrice = parseFloat(element2.price).toFixed(project_settings.price_decimal);
                                }
                            }
                            else
                            {
                                if(qtyTotal >= element2.qty.gte) {
                                    singlePrice = parseFloat(element2.price).toFixed(project_settings.price_decimal);
                                }
                            }
                        });
                    }
                });
            }

            let samplePrice = parseFloat(singlePrice * qtyTotal).toFixed(project_settings.price_decimal);
            
            for (var input in form_data){
                let value = form_data[input]['value'];
                orderSample[form_data[input]['name']] = value;
            }
            orderSample['sampleColors'] = sampleColors;
            orderSample['samplePrice'] = samplePrice;
            orderSample['singlePrice'] = singlePrice;
            orderSample['totalQty'] = qtyTotal;
            orderSample['email'] = orderSample['sample_email'];
            orderSample['slug'] = 'order-sample';

            delete orderSample['sample_quantity[]'];
            delete orderSample['sample_submit'];

            productJsonData['form_data'] = orderSample;
            productJsonData['website_id'] = website_settings['projectID'];

            // console.log('productJsonData == ',productJsonData)

            $.ajax({
                type : 'POST',
                url : project_settings.request_quote_api_url,
                data : productJsonData,
                cache: false,
                dataType : 'json',
                success : function(response_data) {
                    if(response_data!= "") {
                        hidePageAjaxLoading()
                        showSuccessMessage("Email Sent Successfully.");
                        window.location = "orderSampleSuccess.html";
                        return false;
                    }
                    else if(response_data.status == 400) {
                        hidePageAjaxLoading()
                        showErrorMessage("Internal Server Error.");
                        return false;
                    }
                }
            });
        
            return false;
        }
    }).form()
});
// order sample end

$(document).on('click','.send-email-product', function (e) {
    $('form#email_product').validate({
        rules: {
            "name":"required",
            "from_email":{
                required:true,
                email: true
            },
            "to_email":{
                required:true,
                multiemails: true
            },
            "message":"required",
        },
        messages: {
            "name":"Please enter sender name.",
            "from_email":{
                required:"Please enter sender email",
                email: "Please enter valid sender email."
            },
            "to_email":{
                required:"Please enter receiver email",
                multiemails: "Please enter valid receiver email."
            },
            "message":"Please enter message.",
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
            let productResponse = $.ajax({
                type: 'GET',
                url: project_settings.product_api_url+"?_id="+pid+"&source=default_image,sku,product_name,pricing,features,images",
                async: false,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
                },
                dataType: 'json',
                success: function (data)
                {
                    let formObj = $(form);
                    var productJsonData = {};
                    productJsonData['data'] = data.hits.hits[0]._source;
                    
                    var form_data = formObj.serializeArray();
                    var emailProduct = {};
                    for (var input in form_data){
                        var name = form_data[input]['value'];
                        emailProduct[form_data[input]['name']] = name;
                        emailProduct['slug'] = 'email-product';
                        emailProduct['email'] = emailProduct['from_email'];
                    }
                    productJsonData['form_data'] = emailProduct;

                    productJsonData['website_id'] = website_settings['projectID'];


                    var fetureList = '';
                    for (let [i, features] of productJsonData['data'].features.entries() ) {
                        fetureList += "<b>"+features.key+"</b>: "+features.value+"<br/><br/>";
                    }
                    productJsonData['features'] = fetureList;


                    if(productJsonData['data'].pricing != undefined){
                        let priceRang = [];
                        $.each(productJsonData['data'].pricing, function(index,element){
                                if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                                    $.each(element.price_range,function(index,element2){
                                    if(element2.qty.lte != undefined){
                                        priceRang.push(element2.qty.gte + '-' + element2.qty.lte);
                                        }
                                        else
                                        {
                                        priceRang.push(element2.qty.gte + '+');
                                        }
                                    });
                                }
                        });
                        productJsonData['quantity_head'] = priceRang;
                    }
                    if(productJsonData['data'].pricing != undefined){
                        let priceRang = [];
                        $.each(productJsonData['data'].pricing, function(index,element){
                            if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global")
                            {
                                $.each(element.price_range,function(index,element2){
                                    if(element2.qty.lte != undefined){
                                        priceRang.push(element2.price.toFixed(project_settings.price_decimal));
                                    }
                                    else
                                    {
                                    priceRang.push(element2.price.toFixed(project_settings.price_decimal));
                                    }
                                });
                            }
                        });
                        productJsonData['quantity_pricing'] = priceRang;
                    }
                    
                    if(productJsonData['data'].images != undefined){
                        productJsonData['image'] = productJsonData['data'].images[0].images[0].secure_url;
                    }else{
                        productJsonData['image'] = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                    }

                    $.ajax({
                    type : 'POST',
                    url : project_settings.request_quote_api_url,
                    data : productJsonData,
                    dataType : 'json',
                        success : function(response_data) {
                            // $('#emailProduct').modal('toggle');
                            //console.log('response_data',response_data)
                            if(response_data!= "") {
                                // $("#email_product").find("input,textarea").val('');
                                hidePageAjaxLoading()
                                showSuccessMessage("Email Sent Successfully.");
                                $('#emailProduct').modal('toggle');
                                // window.location = "thankYou.html";
                                return false;
                            }
                            else if(response_data.status == 400) {
                                hidePageAjaxLoading()
                                return false;
                            }
                        }
                    });
                }
            });
        },
    }).form()
});

// Print Product 
$(document).on('click','.js-product-detail-print-product', async function (e) {
    showPageAjaxLoading();
    let productResponse = await getProductDetailById(pid)
    $('#modal-table').attr('class','modal fade model-popup-black print-product-detail');
    $("#modal-table").find(".modal-title").html('<i class="strip video-popup-strip"></i> Print Preview');
    $("#modal-table").find(".modal-dialog").removeClass("play-video").addClass('print-product print-comparision');

    // Product Quantity Price
    if(productResponse.pricing != undefined){
        let priceRang = '';
            $.each(productResponse.pricing, function(index,element){
                if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                        $.each(element.price_range,function(index,element2){
                        // console.log("in each condition");
                        if(element2.qty.lte != undefined){
                            priceRang += '<div><div class="table-heading print_product_col">'+ element2.qty.gte + '-' + element2.qty.lte + '</div><div class="table-content print_product_col">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                        }
                        else
                        {
                            priceRang += '<div><div class="table-heading print_product_col">'+ element2.qty.gte + '+' + '</div><div class="table-content print_product_col">' + '$' + parseFloat(element2.price).toFixed(project_settings.price_decimal) + '</div></div>';
                        }
                            });
                        $("#print-product").find(".quantity-table-col").html(priceRang);    
                        $("#print-product").find(".quantity-table-col").css('opacity',1);
                }
            });
        }

    let guestUserHtml = $("#print-product").html();

    guestUserHtml = guestUserHtml.replace(/#data.product_name#/g,productResponse.product_name);
    guestUserHtml = guestUserHtml.replace('#data.sku#',productResponse.sku);
    guestUserHtml = guestUserHtml.replace('#data.description#',productResponse.description);
    guestUserHtml = guestUserHtml.replace('#data.colors#',productResponse.attributes.colors);

    if(productResponse.images != undefined){
        guestUserHtml = guestUserHtml.replace('#data.product_img#',productResponse.images[0].images[0].secure_url);
    }else{
        guestUserHtml = guestUserHtml.replace('#data.product_img#','https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png');        
    }
    
    if(productResponse.imprint_data instanceof Array || productResponse.shipping instanceof Array) {
        if(productResponse.imprint_data instanceof Array) {
            production_days = productResponse.imprint_data[0].production_days+" "+productResponse.imprint_data[0].production_unit;
            setup_charge = productResponse.imprint_data[0].setup_charge;
            if(typeof production_days !== "undefined" && production_days != '') {
                guestUserHtml = guestUserHtml.replace('#data.production_days#',production_days);
            }
            else{
                guestUserHtml = guestUserHtml.replace('#data.production_days#','-');
            }

            if(typeof setup_charge !== "undefined" && setup_charge != '') {
                guestUserHtml = guestUserHtml.replace('#data.setup_charge#',setup_charge);
            }
            else{
                guestUserHtml = guestUserHtml.replace('#data.setup_charge#','-');
            }
        }
        if(productResponse.shipping instanceof Array) {
            if(productResponse.shipping[0].free_on_board != undefined && productResponse.shipping[0].free_on_board != ''){
                fob = productResponse.shipping[0].free_on_board;
                guestUserHtml = guestUserHtml.replace('#data.fob#',fob);
            }
            else{
                guestUserHtml = guestUserHtml.replace('#data.fob#','-');
            }
            
            // if(productResponse.shipping[0].carton_length != undefined && productResponse.shipping[0].carton_length != ''){
            //     carton_length = productResponse.shipping[0].carton_length+" "+productResponse.shipping[0].carton_size_unit;
            //     guestUserHtml = guestUserHtml.replace('#data.setup_charge#',setup_charge);
            // }

            // if(productResponse.shipping[0].carton_weight != undefined  && productResponse.shipping[0].carton_weight != ''){
            //     carton_weight = productResponse.shipping[0].carton_weight+" "+productResponse.shipping[0].carton_weight_unit;
            //     guestUserHtml = guestUserHtml.replace('#data.setup_charge#',setup_charge);
            // }

            if(productResponse.shipping[0].shipping_qty_per_carton !=undefined  && productResponse.shipping[0].shipping_qty_per_carton != ''){
                shipping_qty_per_carton = productResponse.shipping[0].shipping_qty_per_carton;
                guestUserHtml = guestUserHtml.replace('#data.qty_per_carton#',shipping_qty_per_carton);
            }
            else{
                guestUserHtml = guestUserHtml.replace('#data.qty_per_carton#','-');
            }
        }
        else{
            guestUserHtml = guestUserHtml.replace('#data.qty_per_carton#','-');
            guestUserHtml = guestUserHtml.replace('#data.fob#','-');
        }
    }
    
    // let colorsHexVal = await replaceColorSwatchWithHexaCodes(productResponse.attributes.colors,"color");
    // console.log("colorsHexVal",colorsHexVal);
    hidePageAjaxLoading();
    $(".js_add_html").html(guestUserHtml)
    $('#modal-table').modal('show');
    return false;
});

$(document).on('click','.js-print-it', function (e) {
    showPageAjaxLoading();
    printElement(document.getElementById("print-product"));
    hidePageAjaxLoading();
})

function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    setTimeout(function(){
        window.print();
    },2000);
}
// END - Print Product