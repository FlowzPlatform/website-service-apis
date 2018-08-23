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
                url: project_settings.product_api_url+"?_id="+pid+"&source=default_image,sku,product_name,pricing,features",
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
                            console.log('response_data',response_data)
                            if(response_data!= "") {
                                // $("#email_product").find("input,textarea").val('');
                                hidePageAjaxLoading()
                                showSuccessMessage("Email Sent Successfully.");
                                window.location = "thankYou.html";
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