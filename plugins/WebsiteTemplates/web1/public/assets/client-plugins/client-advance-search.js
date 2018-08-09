let optionsAsCategory = '';
// let optionsAsBrand = '';
let CategoryArr = [];
let ResultCategory = [];
// let BrandArr = [];
// let ResultBrand = [];
// let CheckCategoryValue = [];
// let selectedCategories = '';
let MinPriceVal = '';
let MaxPriceVal = '';
let KeywordTextVal  = '';
let SkuTextVal = '';

if(getParameterByName("MinPrice")){
    MinPriceVal = getParameterByName("MinPrice")
    // console.log("MinPriceVal",MinPriceVal);
}
if(getParameterByName("MaxPrice")){
    MaxPriceVal = getParameterByName("MaxPrice")
   // console.log("MaxPriceVal",MaxPriceVal);
}

if(getParameterByName("KeywordSensor")){
    KeywordTextVal = getParameterByName("KeywordSensor")
   // console.log("KeywordTextVal",KeywordTextVal);
}

if(getParameterByName("SkuSensor")){
    SkuTextVal = getParameterByName("SkuSensor")
   // console.log("SkuTextVal",SkuTextVal);
}

$(document).ready(function(){
if($("#min_price").length > 0){
    $("#min_price").val(MinPriceVal)
}
if($("#max_price").length > 0){
    $("#max_price").val(MaxPriceVal)
}
if($("#KeywordSensor").length > 0){
    $("#KeywordSensor").val(KeywordTextVal)
}
if($("#SkuSensor").length > 0){
    $("#SkuSensor").val(SkuTextVal)
}

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
        "url": project_settings.search_api_url + '?from=0&size='+total_hits_CategoryFilter,
        "method": "POST",
        "headers": {
            "Authorization" : "Basic " + btoa(website_settings.Projectvid.esUser + ':' + website_settings.Projectvid.password)
        }
    }
      $.ajax(CategoryFilter2).done(function (data) {
          $.each(data.hits.hits,  function( index1, value1 ) {
           // BrandArr.push(value1._source.linename);
           // ResultBrand = _.uniq(BrandArr);
           // ResultBrand.sort();
            $.each(value1._source.categories,  function( index2, value2 ) {
               CategoryArr.push(value2);
               ResultCategory = _.uniq(CategoryArr);
               ResultCategory.sort();
               
            });
         });
        //  $.each(ResultBrand,  function( index4, value4 ) {
        //     optionsAsBrand += "<option value='" + value4 + "'>" + value4 + "</option>"; 
        //  });
         $.each(ResultCategory,  function( index3, value3 ) {
            optionsAsCategory += "<option value='" + value3 + "'>" + value3 + "</option>"; 
         });
        $( 'select#CategorySensor' ).append( optionsAsCategory ); 
       // $( 'select#BrandSensor' ).append( optionsAsBrand );         
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
             let KeywordVal = $('#KeywordSensor').val();
             let SkuVal = $('#SkuSensor').val();
             let CategoryVal = $('#CategorySensor').val();
             let BrandVal = $('#BrandSensor').val();
             MinPriceVal = $('#min_price').val();
             MaxPriceVal = $('#max_price').val();
             window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+KeywordVal+'&'+'CategorySensor='+CategoryVal+'&'+'SkuSensor='+SkuVal+'&'+'MinPrice='+MinPriceVal+'&'+'MaxPrice='+MaxPriceVal;

           // let formData = $("#"+formId).serialize();
           // let formData = $("#"+formId).serializeArray();
           // console.log("formData",formData)
            return false;
        })
      });
});

// $(document).on("keypress",'input[name="KeywordSensor"]',function() {
//     if(event.which==13){
//         $('.search-button').trigger( "click" );
//         //   return false;
//         // if($.trim($('input[name="KeywordSensor"]').val()) != '') {
//         //     window.location.href = website_settings.BaseURL+'search.html?KeywordSensor='+$('input[name="KeywordSensor"]').val()
//         //   }
//         }  
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


