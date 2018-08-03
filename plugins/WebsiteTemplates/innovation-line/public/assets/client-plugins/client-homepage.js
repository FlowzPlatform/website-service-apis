// $(function() {
//     $('.lazyLoad').Lazy({
//         scrollDirection: 'vertical',
//         effect: 'fadeIn',
//         visibleOnly: true,
//         onError: function(element) {
//             console.log('error loading ' + element.data('src'));
//         }
//     });
// });

$(document).ready(async function(){
    // display tags list by categories of product tag
    if($(".js-product-tags").length > 0){
        let catName = $(".js-product-tags").attr("data-category")
        let categoryHtml = $(".js-tag-listing").html()
        let catHtml = ''
        if(catName != ""){
            let responseTagCat = await getTagCategoryByName(catName)
            if( responseTagCat != null ){
                let obj = "tag_category="+responseTagCat.id
                let responseTagList = await getTagListByObj(obj)
                // console.log("responseTagCat",responseTagList);
                if(responseTagList != null){
                  for (let [key,tagRes] of responseTagList.entries()) {
                      categoryHtml1 = categoryHtml.replace("#data.tagLink#","productTags.html?locale=en_us&tid="+tagRes.id)
                      categoryHtml1 = categoryHtml1.replace("#data.image#",tagRes.tag_icon)
                      categoryHtml1 = categoryHtml1.replace("#data.tagName#",tagRes.tag_name)
                      catHtml +=categoryHtml1
                  }
                  $(".js-tag-listing").html(catHtml)
                  // $("#owl-carousel-related-products").closest(".row").css({"display": "flex"});
                  $("#owl-carousel-related-products").owlCarousel({
                      stopOnHover : true,
                      navigation:true,
                      pagination:true,
                      items : 4,
                      itemsDesktop: [1199, 4],
                      itemsDesktopSmall: [979, 4],
                      itemsTablet: [767, 2],
                      itemsMobile: [479, 2]
                  });
                  $('.js-product-tags').removeClass('hide');
                  // categoryTag listing
                }
            }
        }
    }

    //Featured PRODUCTS Listing

    /*if($(".js-tag-product-list").length > 0){
        let tagHtmlList = $(".js-tag-product-list");
        $.each(tagHtmlList,async function(index,tagHTML){
            // console.log("index",index,tagHTML);
            let productBoxHtml = $(this).find('.js-list').html()
            let productSlug = $(this).attr("data-slug")
            let replaceProductBox = ''
            if(productSlug != ""){
                let replaceProductBox = await tagProductList("tag_slug="+productSlug,productBoxHtml)
                if(replaceProductBox != ''){
                    $(this).find('.js-list').html(replaceProductBox)
                    $(this).removeClass('hide')
                    $(this).find("#owl-carousel-recommeded").closest(".row").css({"display": "flex"});
                    // $(this).find("#owl-carousel-recommeded").owlCarousel({
                    $("#owl-carousel-best-seller").owlCarousel({
                        stopOnHover : true,
                        navigation:true,
                        pagination:true,
                        items : 2,
                        itemsDesktop: [1199, 2],
                        itemsDesktopSmall: [979, 2],
                        itemsTablet: [767, 2],
                        itemsMobile: [479, 2]
                    });
                }
            }
        })
    }*/

    // featured product
    if($(".js-tag-featured-product-list").length > 0){
        let tagHtmlList = $(".js-tag-featured-product-list");
        let productBoxHtml = $(".js-tag-featured-product-list").find('.js-list').html()
        let productSlug = $(".js-tag-featured-product-list").attr("data-slug")
        let replaceProductBox = ''
        if(productSlug != ""){
            let replaceProductBox = await tagProductList("tag_slug="+productSlug,productBoxHtml)
            if(replaceProductBox != ''){
                tagHtmlList.find('.js-list').html(replaceProductBox)
                tagHtmlList.removeClass('hide')
                tagHtmlList.find("#owl-carousel-recommeded").closest(".row").css({"display": "flex"});
                $("#owl-carousel-recommeded").owlCarousel({
                    stopOnHover : true,
                    navigation:true,
                    pagination:true,
                    items : 2,
                    itemsDesktop: [1199, 2],
                    itemsDesktopSmall: [979, 2],
                    itemsTablet: [767, 2],
                    itemsMobile: [479, 2]
                });
            }
        }
    }

    // featured product
    if($(".js-best-seller-product-list").length > 0){
        let tagHtmlList = $(".js-best-seller-product-list");
        let productBoxHtml = $(".js-best-seller-product-list").find('.js-list').html()
        let productSlug = $(".js-best-seller-product-list").attr("data-slug")
        let replaceProductBox = ''
        if(productSlug != ""){
            let replaceProductBox = await tagProductList("tag_slug="+productSlug,productBoxHtml)
            if(replaceProductBox != ''){
                tagHtmlList.find('.js-list').html(replaceProductBox)
                tagHtmlList.removeClass('hide')
                tagHtmlList.find("#owl-carousel-best-seller").closest(".row").css({"display": "flex"});
                $("#owl-carousel-best-seller").owlCarousel({
                    stopOnHover : true,
                    navigation:true,
                    pagination:true,
                    items : 2,
                    itemsDesktop: [1199, 2],
                    itemsDesktopSmall: [979, 2],
                    itemsTablet: [767, 2],
                    itemsMobile: [479, 2]
                });
            }
        }
    }

    // Awards
    $(".owl-brand").closest(".row").css({"display": "flex"});
    $(".owl-brand").owlCarousel({
        stopOnHover : true,
        navigation:true,
        items : 7,
        itemsDesktop: [1199, 7],
        itemsDesktopSmall: [979, 7],
        itemsTablet: [767, 2],
        itemsMobile: [479, 2]
    });

})

let tagProductList = function(tagObj,productBoxHtml) {
    return new Promise(async (resolve , reject ) => {
          let responseTag = await getTagListByObj(tagObj)
          let replaceProductBox = ''
          // console.log("responseTag",tagObj,responseTag);
          if(responseTag != null){
              let productResponse = await fetchProductsByTagId(responseTag[0].id)
              if(productResponse.length > 0){
                  for(let [key,value] of productResponse.entries()){
                          let productRes = await getProductDetailById(value.product_id)
                          productBoxHtml1 = productBoxHtml.replace(/#data.id#/g,value.product_id)
                          productBoxHtml1 = productBoxHtml1.replace(/#data.product_link#/g,'productdetail.html?locale='+project_settings.default_culture+'&pid='+value.product_id)
                          ProductImage = 'https://res.cloudinary.com/flowz/image/upload/v1531481668/websites/images/no-image.png';
                          if(productRes.images != undefined)  {
                              ProductImage = productRes.images[0].images[0].secure_url;
                          }

                          productBoxHtml1 = productBoxHtml1.replace('#data.image#',ProductImage)
                          productBoxHtml1 = productBoxHtml1.replace('#data.sku#',productRes.sku)
                          productBoxHtml1 = productBoxHtml1.replace('#data.currency#','$')
                          productBoxHtml1 = productBoxHtml1.replace('#data.price#',productRes.min_price.toFixed(project_settings.price_decimal))
                          productBoxHtml1 = productBoxHtml1.replace('#data.title#',productRes.product_name)
                          productBoxHtml1 = productBoxHtml1.replace(/#data.tagSlug#/g,responseTag[0].tag_slug)
                          productBoxHtml1 = productBoxHtml1.replace(/#data.tagColor#/g,responseTag[0].tag_color)
                          productBoxHtml1 = productBoxHtml1.replace(/#data.tagName#/g,responseTag[0].tag_name)
                          replaceProductBox += productBoxHtml1
                  }
                  resolve(replaceProductBox)
              }
          }
    })
}

async function fetchProductsByTagId(tagId){
    let returnData = null;
    await axios({
        method: 'GET',
        url: project_settings.tag_products_api_url+"?website="+ website_settings['projectID']+"&tag_id="+tagId,
    })
    .then(response => {
      // console.log("returnData",response);
        if(response.data.data.length > 0){
            returnData = response.data.data;
        }
        return returnData
    })
    .catch(function (error) {
        console.log("error",error.response);
    });
    return returnData;
}

async function getTagCategoryByName(catName) {
      let returnData = null;
    	await axios({
    			method: 'GET',
    			url: project_settings.tags_cat_api_url+"?website="+ website_settings['projectID']+"&status=true&tc_name="+catName,
    	})
    	.then(response => {
        // console.log("returnData",response);
          if(response.data.data.length > 0){
              returnData = response.data.data[0];
          }
          return returnData
    	})
      .catch(function (error) {
          console.log("error",error.response);
      });
    	return returnData;
}

async function getTagListByObj(obj) {
      let returnData = null;
    	await axios({
    			method: 'GET',
    			url: project_settings.tag_api_url+"?website="+ website_settings['projectID']+"&tag_status=true&"+obj,
    	})
    	.then(response => {
        // console.log("returnData",response);
          if(response.data.data.length > 0){
              returnData = response.data.data;
          }
          return returnData
    	})
      .catch(function (error) {
          // console.log("error",error.response);
      });
    	return returnData;
}

// var tagInfo = function () {
//     var tmp = null;
//     $.ajax({
//         'async': false,
//         'type': "GET",
//         'global': false,
//         'url': project_settings.tag_products_api_url + "?website=" + website_settings['projectID'],
//         'success': function (res) {
//             tmp = res.data;
//         }
//     });
//     return tmp;
// }();

//
//
// if(tagInfo.length > 0) {
//     let tagHtml = "";
//     let tagByCatHtml = $(".js-tag-listing").html()
//     $.each( tagInfo, function( key, tagArray ) {
//         tagHtml += '<div class="in-box-cont"><div class="right-part"><a href="productTags.html?locale=en_us&tid='+tagArray.id+'"><img width="134" height="118" class="lazyLoad" data-src="'+tagArray.tag_icon+'" alt=""></a></div><div class="left-part"><div class="pro-title"><a href="javascript:;">'+tagArray.tag_name+'</a></div><div class="pro-btn"><a href="productTags.html?locale=en_us&tid='+tagArray.id+'">See All</a></div></div></div>';
//     });
//     $('.js-tag-listing').html(tagHtml);
//     $('.js-product-tags').removeClass('hide');
// }
