// section cart count

document.addEventListener("DOMContentLoaded", function(event){
    if (user_id != null ) {
        if(websiteConfiguration.transaction.place_order.cart_list.parent_status == 0 && websiteConfiguration.transaction.place_order.cart_list.status == 0){
            let html = 'Access Denied';
            $('.main-shopping-cart-block').html(html);
            return false;
        }
    }
  
    $("#js-cart_data").addClass("hide");
  
    if(user_details != null && $('#js-cart_data').length > 0) {
        showCart();
    }
    else if(user_details != null) {
        $.ajax({
            type : 'GET',
            url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
            dataType : 'json',
            success : function(response_data) {
                if (response_data!= "") {
                    $("#cartCount").html(response_data.length);
                }
            }
        })
    }
    else {
        $('#js-cart_data').html("<div class='col-sm-12 col-md-12 col-lg-12 col-xs-12'><div class='col-sm-6 col-md-6 col-lg-6 col-xs-12'>No records found.</div></div>")    
        $("#js-cart_data").removeClass('hide');
    }
});



// section advance search

// let optionsAsCategory = '';
// let CategoryArr = [];
// let ResultCategory = [];
// let MinPriceVal = '';
// let MaxPriceVal = '';
// let KeywordTextVal  = '';
// let SkuTextVal = '';

// if(getParameterByName("MinPrice")){
//     MinPriceVal = getParameterByName("MinPrice")
// }
// if(getParameterByName("MaxPrice")){
//     MaxPriceVal = getParameterByName("MaxPrice")
// }

// if(getParameterByName("KeywordSensor")){
//     KeywordTextVal = getParameterByName("KeywordSensor")
// }

// if(getParameterByName("SkuSensor")){
//     SkuTextVal = getParameterByName("SkuSensor")
// }

// $(document).ready(function(){
//     if($("#min_price").length > 0){
//         $("#min_price").val(MinPriceVal)
//     }
//     if($("#max_price").length > 0){
//         $("#max_price").val(MaxPriceVal)
//     }
//     if($("#KeywordSensor").length > 0){
//         $("#KeywordSensor").val(KeywordTextVal)
//     }
//     if($("#SkuSensor").length > 0){
//         $("#SkuSensor").val(SkuTextVal)
//     }

//     let CategoryFilter1 = {
//         "async": true,
//         "crossDomain": true,
//         "url": project_settings.search_api_url + '?size=0',
//         "method": "POST",
//         "headers": {
//             "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
//         }
//     }

//     $.ajax(CategoryFilter1).done(function (data) {
//         let total_hits_CategoryFilter = data.hits.total;
//         let CategoryFilter2 = {
//             "async": true,
//             "crossDomain": true,
//             "url": project_settings.search_api_url + '?from=0&size='+total_hits_CategoryFilter,
//             "method": "POST",
//             "headers": {
//                 "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
//             }
//         }
//         $.ajax(CategoryFilter2).done(function (data) {
//             $.each(data.hits.hits,  function( index1, value1 ) {
//                 $.each(value1._source.categories,  function( index2, value2 ) {
//                 CategoryArr.push(value2);
//                 ResultCategory = _.uniq(CategoryArr);
//                 ResultCategory.sort();
                
//                 });
//             });
//             $.each(ResultCategory,  function( index3, value3 ) {
//                 optionsAsCategory += "<option value='" + value3 + "'>" + value3 + "</option>"; 
//             });
//             $( 'select#CategorySensor' ).append( optionsAsCategory ); 
//             $(".multi_category").multiselect({

//             });
//         });        
//     });

//     $( ".search-button" ).on( "click", function() {
//         let formId = $(this).closest('form').attr("id")
//         $("#"+formId).submit(function(e){
//             e.stopImmediatePropagation()
//              let KeywordVal = $('#KeywordSensor').val();
//              let SkuVal = $('#SkuSensor').val();
//              let CategoryVal = $('#CategorySensor').val();
//              let BrandVal = $('#BrandSensor').val();
//              MinPriceVal = $('#min_price').val();
//              MaxPriceVal = $('#max_price').val();
//              window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+KeywordVal+'&'+'CategorySensor='+CategoryVal+'&'+'SkuSensor='+SkuVal+'&'+'MinPrice='+MinPriceVal+'&'+'MaxPrice='+MaxPriceVal;
//             return false;
//         })
//     });
// });





///////////////////////  updated advance-search  ////////////////////


let optionsAsCategory = '';
let optionsAsBrand = '';
let optionsAsColor = '';
let CategoryArr = [];
let ResultCategory = [];
let BrandArr = [];
let ResultBrand = [];
let ColorArr = [];
let ResultColor =[];
let MinPriceVal = '';
let MaxPriceVal = '';
let KeywordTextVal  = '';
let SkuTextVal = '';
// let CheckCategoryValue = [];
// let selectedCategories = '';

$(document).ready(function(){
    // if($("#min_price").length > 0){
    //     if(getParameterByName("MinPrice")){
    //         MinPriceVal = getParameterByName("MinPrice")
    //     }
    //      $("#min_price").val(MinPriceVal)
    // }

    // if($("#max_price").length > 0){
    //     if(getParameterByName("MaxPrice")){
    //         MaxPriceVal = getParameterByName("MaxPrice")
    //     }
    //     $("#max_price").val(MaxPriceVal);
    // }
    
    
    if(getParameterByName("Keyword")){
        KeywordTextVal = getParameterByName("Keyword")
        $('input[name="Keyword"]').val(KeywordTextVal)
    }
    
    if(getParameterByName("Sku")){
        SkuTextVal = getParameterByName("Sku")
       // console.log("SkuTextVal",SkuTextVal);
        $('input[name="Sku"]').val(SkuTextVal)
    }
    
    
// if($("#KeywordSensor").length > 0){
//     console.log("***************",$("#KeywordSensor").length)
//     $("#KeywordSensor").val(KeywordTextVal)
// }
    // if($("#SkuSensor").length > 0){
    //     $("#SkuSensor").val(SkuTextVal)
    // }

    let CategoryFilter1 = {
        "async": true,
        "crossDomain": true,
        "url": project_settings.search_api_url + '?size=0',
        "method": "POST",
        "headers": {
        "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
        }
    }
    $.ajax(CategoryFilter1).done(function (data) {
        let total_hits_CategoryFilter = data.hits.total;
        let CategoryFilter2 = {
            "async": true,
            "crossDomain": true,
            "url": website_settings.project_settings.search_api_url + '?from=0&size='+total_hits_CategoryFilter,
            "method": "POST",
            "headers": {
                "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
            }
        }
      $.ajax(CategoryFilter2).done(function (data) {
          $.each(data.hits.hits,  function( index1, value1 ) {
            $.each(value1._source.attributes.colors, function( ColorIndex, ColorVal ) {
                  ColorArr.push(ColorVal);
                  ResultColor = _.uniq(ColorArr);
                  ResultColor.sort();
                  
            });
                BrandArr.push(value1._source.linename);
                ResultBrand = _.uniq(BrandArr);
                ResultBrand.sort();
            $.each(value1._source.categories, function( CategoryIndex, CategoryVal ) {
               CategoryArr.push(CategoryVal);
                ResultCategory = _.uniq(CategoryArr);
                ResultCategory.sort();
                
                });
            });

            $.each(ResultColor, function(index, value){
                optionsAsColor += "<option value='" + value + "'>" + value + "</option>";
            });

            $.each(ResultBrand,  function( BrandIndex, BrandVal ) {
                optionsAsBrand += "<option value='" + BrandVal + "'>" + BrandVal + "</option>"; 
            });
            $.each(ResultCategory,  function( index3, value3 ) {
                optionsAsCategory += "<option value='" + value3 + "'>" + value3 + "</option>"; 
            });
                $( 'select#Category' ).append( optionsAsCategory ); 
                $( 'select#Brand' ).append( optionsAsBrand );
                $( 'select#Color' ).append( optionsAsColor );
                $(".multi_category").multiselect({
                //  onChange:function(element,checked){
                //      let categories = $("#CategorySensor option:selected");
                //      let selected= [];
                //      $(categories).each(function(index,cat){
                //          selected.push($(this).val());
                //      })
                //      selectedCategories = selected
                //     //  console.log("selected",selected)
                //  }
            });
        });        
    });

    $( ".search-button" ).on( "click", function() {
        let formId = $(this).closest('form').attr("id")
        $("#"+formId).submit(function(e){
            e.stopImmediatePropagation()
             let KeywordVal = $('#Keyword').val();
             let SkuVal = $('#Sku').val();    
             let CategoryVal = $('#Category').val();    
             let BrandVal = $('#Brand').val();       
             let ColorVal = $('#Color').val();          
             MinPriceVal = $('#min_price').val();          
             MaxPriceVal = $('#max_price').val();
            
             let url = website_settings.BaseURL+'search.html?Keyword='+KeywordVal+'&'+'Sku='+SkuVal+'&'+'MinPrice='+MinPriceVal+'&'+'MaxPrice='+MaxPriceVal
             if(CategoryVal.length != 0){
                url += '&Categorylist='+CategoryVal
             }
             if(BrandVal.length != 0){
                url += '&Brand='+BrandVal
             }
             if(ColorVal.length != 0){
                url += '&Color='+ColorVal
             }
            
             window.location.href = url;
             
           // window.location.href = website_settings.BaseURL+'search.html?Keyword='+KeywordVal+'&'+'Categorylist='+CategoryVal+'&'+'Sku='+SkuVal+'&'+'MinPrice='+MinPriceVal+'&'+'MaxPrice='+MaxPriceVal+'&'+'Brand='+BrandVal+'&'+'Color='+ColorVal;
          
          // let formData = $("form#"+formId).serialize();
           // let formData = $("#"+formId).serializeArray();
          // console.log("formData",formData);
       
          //    let url = '';
        //    for (let input in formData) {
        //         if (formData[input]['value'] != '') {
        //             url += (formData[input]['name'] + '=' + formData[input]['value'])
        //         }
        //    }
        //    console.log("url--------------",url)
            return false;
        })
      });
    //   $("#advance_search_reset").on("click",function(){
    //     $("#top_advance_search_form")[0].reset();
    //   });

});

// $(document).on("keypress",'input[name="KeywordSensor"]',function() {
//     if(event.which==13){
//       //  $('.search-button').trigger( "click" );
//         $("#top_advance_search_form").submit(); 
//         //   return false;
//         // if($.trim($('input[name="KeywordSensor"]').val()) != '') {
//         //     window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+$('input[name="KeywordSensor"]').val()
//         //   }
//         }  
// });


// $('#KeywordSensor').keypress(function(event){
	
// 	var keycode = (event.keyCode ? event.keyCode : event.which);
// 	if(keycode == '13'){
//       //  alert('You pressed a "enter" key in textbox');	
//         $("#top_advance_search_form").submit(); 
        
// 	}
// 	event.stopPropagation();
// });

// $(document).keypress(function(event){
// 	var keycode = (event.keyCode ? event.keyCode : event.which);
// 	if(keycode == '13'){
//         $("#top_advance_search_form").submit(); 
// 	}	
// });

// $(document).on("keypress",'input[name="SkuSensor"]',function() {
//     if(event.which==13){
//         $('.search-button').trigger( "click" );
//         //   return false;
//         // if($.trim($('input[name="sku"]').val()) != '') {
//         //     window.location.href = website_settings.BaseURL+'search.html?SkuSensor='+$('input[name="sku"]').val()
//         //   }
//         }  
// });

// $(document).on("click",".search-button",function() {
  
//       CheckCategoryValue = [];
//     $(".multiselect-container input:checked").each(function() {
//         // console.log("($(this).val())",($(this).val()));
//          CheckCategoryValue.push($(this).val());
//         // CheckCategoryValue.toString();
//         // console.log("CheckCategoryValue",CheckCategoryValue);        
//          window.location.href = website_settings.BaseURL+'search.html?CategorySensor='+CheckCategoryValue;
//      });
  
//     if($.trim($('input[name="KeywordSensor"]').val()) != '' && $.trim($('input[name="SkuSensor"]').val()) == '') {
//         console.log("keyword Only...................");
//         window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+$('input[name="KeywordSensor"]').val()
//       }

//     if($.trim($('input[name="SkuSensor"]').val()) != '' && $.trim($('input[name="KeywordSensor"]').val()) == '') {
//         console.log("Sku Only......................");
//     window.location.href = website_settings.BaseURL+'search.html?SkuSensor='+$('input[name="SkuSensor"]').val()
//     } 

//     if($.trim($('input[name="KeywordSensor"]').val()) != '' && $.trim($('input[name="SkuSensor"]').val()) != '') {
//         console.log("Both.................");
//     window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+$('input[name="KeywordSensor"]').val()+'&'+'SkuSensor='+$('input[name="SkuSensor"]').val()
//     }     
//     return false;
// })


