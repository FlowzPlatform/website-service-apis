$(document).on('click','.js-btn-download-compare-product', async function (e) {
    showPageAjaxLoading();
    await sleep(500);
    let compareHtml = $("#download-comparision");
    let originalCompareHtml = compareHtml.html();
    
    let compareValuesCount = 0;
    let compare_values='';
      
    if(user_details != null)
    {
      if(localStorage.getItem("savedComparedRegister") != null && localStorage.getItem("savedComparedRegister").length > 0)
      {
        compare_values = JSON.parse(localStorage.getItem("savedComparedRegister"));
      }
      else{
        compare_values = '';        
      }
    }
    else {
      let decideLocalStorageKey = decide_localStorage_key(3);      
      compare_values = JSON.parse(localStorage.getItem(decideLocalStorageKey));
    }
  
    let itemTitleHtml=productHtml=itemSkuHtml=activeSummaryHtml=itemFeaturesHtml=itemPriceHtml='';
    let productData;
    let html = $('#download-comparision #product_img').html();
    let itemPrice = $('#download-comparision #product_price').html();
    let item_sku = $('#download-comparision #product_sku').html();
    let activeSummary = $('#download-comparision #product_summary').html();
    let item_features = $('#download-comparision #product_features').html();
  
    if (typeof(compareHtml.html()) !== "undefined" && compare_values != null && compare_values.length > 0) 
    {
      for (item in compare_values)
      {
          let prodId = compare_values[item]['product_id'];
  
          $.ajax({
            type: 'GET',
            url: project_settings.product_api_url+"?_id="+prodId+"&source=default_image,product_id,sku,product_name,currency,min_price,description,features,images",
            async: false,
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("vid", website_settings.Projectvid.vid);
            },
            dataType: 'json',
            success: async function (data)
            {
              productData = data.hits.hits;
              if(productData.length >0)
              {
              compareValuesCount = compareValuesCount+1;
  
              let itemTitleHtml = html;
              
              let product_image = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
              
              if( productData[0]._source.images != undefined ){
                product_image = productData[0]._source.images[0].images[0].secure_url;
              }
  
              itemTitleHtml = itemTitleHtml.replace('#data.image#',product_image);
  
              itemTitleHtml = itemTitleHtml.replace(/#data.title#/g,productData[0]._source.product_name);
  
              productHtml = itemTitleHtml;
  
              let itemPriceHtml = itemPrice;
              if(websiteConfiguration.site_management.price_and_qunatity_for_guest_user.status == 1)
              {
                itemPriceHtml = itemPriceHtml.replace('#data.price#',$("#listing #js-price-per-qty-"+productData[0]._id).find(".priceProd").html());
                itemPriceHtml = itemPriceHtml.replace('#data.min_qty#',$("#listing .product-"+productData[0]._id).find(".js_quantity_input").val());
              }
              let itemSkuHtml1 = item_sku;
              itemSkuHtml1 = itemSkuHtml1.replace('#data.sku#',productData[0]._source.sku);
              itemSkuHtml = itemSkuHtml1;
  
              let itemSummaryHtml = activeSummary;
              itemSummaryHtml = itemSummaryHtml.replace('#data.summary#',stripHtml(productData[0]._source.description));
              activeSummaryHtml = itemSummaryHtml;
  
              let itemFeaturesHtml1 = item_features;
              
              let fetureList = '';
              for (let [i, features] of productData[0]._source.features.entries() ) {
                fetureList += features.key+": "+features.value+"<br>";
              }
  
              itemFeaturesHtml1 = itemFeaturesHtml1.replace('#data.features#',fetureList);
              itemFeaturesHtml = itemFeaturesHtml1;
  
              if(item == 0 || compareValuesCount == 1)
              {
                compareHtml.find("#product_img").html("<td style='width:20%' class='feature-block'></td>"+productHtml)
                if(websiteConfiguration.site_management.price_and_qunatity_for_guest_user.status == 0){
                  compareHtml.find("#product_price").remove();
                }
                else
                {
                  compareHtml.find("#product_price").addClass('hide').html("<td style='width:20%' class='feature-block'>PRICE</td>"+itemPriceHtml)
                }
                compareHtml.find("#product_sku").html("<td style='width:20%' class='feature-block'>ITEM CODE</td>"+itemSkuHtml)
                compareHtml.find("#product_summary").html("<td style='width:20%'class='feature-block'>SUMMARY</td>"+activeSummaryHtml)
                compareHtml.find("#product_features").html("<td style='width:20%' class='feature-block'>FEATURES</td>"+itemFeaturesHtml)
              }
              else{
                compareHtml.find("#product_img").append(productHtml)
                if(websiteConfiguration.site_management.price_and_qunatity_for_guest_user.status == 1){
                  compareHtml.find("#product_price").append(itemPriceHtml)
                }
                compareHtml.find("#product_sku").append(itemSkuHtml)
                compareHtml.find("#product_summary").append(activeSummaryHtml)
                compareHtml.find("#product_features").append(itemFeaturesHtml)
              }
            }
            }
          });
      }
  
      axios({
        method: 'post',
        url: project_settings.download_pdf_api_url,
        data: {
          "html" : '<div id="download-comparision">'+compareHtml.html()+'</div>'
        },
        }).then(function (response) {
          var arrayBufferView = new Uint8Array( response.data.data );
          var blob=new Blob([arrayBufferView], {type:"application/pdf"});
          
          var link=document.createElement('a');
          link.href=window.URL.createObjectURL(blob);
          link.download='compare-product';
          link.click();
          let compareHtml = $("#download-comparision");
          $("#download-comparision").html(originalCompareHtml);
          hidePageAjaxLoading();
        })
        .catch(function (error) {
          hidePageAjaxLoading();
        })
        return false;
    }
    return false;
  });
  
  $(document).on('change', '#listing .js_quantity_input', async function(e) {
    this.PreviousVal = $(this).val();
    let thisPreviousVal = this.PreviousVal ;
    let QtyBox = $(this);
    let qty = QtyBox.val();
    let product_id = QtyBox.data('product-id');
    let minQty = QtyBox.data('min-qty');
    
    if(qty == "" || qty == 0){
      $(".product-"+product_id).find(".js_quantity_input").val(minQty);
      qty = minQty;
    }
    
    let data = { productId:product_id, qty:qty };
    // showTopAjaxLoading();
    $(".product-"+product_id).find(".js_quantity_input").attr("value",qty);
    
    let productPricing = await getProductDetailBySource(product_id,'pricing,currency')
  
    if(productPricing.pricing != undefined){
      let priceRang = '';
      $.each(productPricing.pricing, function(index,element){
              if(element.price_type == "regular" && element.type == "decorative" && element.global_price_type == "global"){
                   $.each(element.price_range,function(index,element2){
                      if(element2.qty.lte != undefined){
                          if(qty>=element2.qty.gte && qty<=element2.qty.lte){
                            $("#js-price-per-qty-"+product_id).find(".priceProd").html(productPricing.currency+" "+element2.price.toFixed(project_settings.price_decimal));
                            return false;
                          }
                        }
                        else
                        {
                          $("#js-price-per-qty-"+product_id).find(".priceProd").html(element2.price.toFixed(project_settings.price_decimal));
                          return false;                          
                        }
                     });
              }
      });
    }
    return false;
  
});