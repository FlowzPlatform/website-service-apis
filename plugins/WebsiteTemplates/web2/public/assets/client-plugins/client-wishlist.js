var listHtml = $('#myWishList .listing').html();
var productHtml='';
var productData;

if (typeof(Storage) !== "undefined" && typeof(listHtml) !== "undefined" && wishlist_values != null ) {
    for (item in wishlist_values){
      var prodId = wishlist_values[item]['product_id'];

      if(wishlist_values[item] != null)
      {
        $.ajax({
          type: 'GET',
          url: project_settings.product_api_url+prodId,
          async: false,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
          },
          dataType: 'json',
          success: function (data) {
            rawData = data.hits.hits;
            productData = rawData;

            var listHtml1 = listHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
            var listHtml1 = listHtml1.replace(/#data.id#/g,wishlist_values[item]['product_id']);
            var listHtml1 = listHtml1.replace('#data.title#',productData[0]._source.product_name);
            var listHtml1 = listHtml1.replace('#data.sku#',productData[0]._source.sku);
            var listHtml1 = listHtml1.replace('#data.price#',productData[0]._source.price_1);
            var listHtml1 = listHtml1.replace('#data.currency#',productData[0]._source.currency);

            var listHtml1 = listHtml1.replace('#data.description#',productData[0]._source.description);

            productHtml += listHtml1;
          }
        });
      }
    }
} else {
  productHtml += 'No records found.';
}
$('#myWishList .listing').removeClass('hide');
$('#myWishList .listing').html(productHtml);


var compareHtml = $('#myCompareList #listing')
let values1 = JSON.parse(localStorage.getItem("savedCompared"));

var productHtml=itemSkuHtml=activeSummaryHtml=itemFeaturesHtml='';
var productData;
var itemTitleHtml='';
let html = $('#listing #item_title_price').html();
let item_sku = $('#listing #item_sku').html();
let activeSummary = $('#listing #item_summary').html();
let item_features = $('#listing #item_features').html();

if (typeof(Storage) !== "undefined" && typeof(compareHtml.html()) !== "undefined" && values1 != null) {
      if(JSON.parse(localStorage.getItem("savedCompared")).length>4)
       {
         $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*values1.length+'px')
       }
       else{
         $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*5+'px')
       }
      for (item in values1){
      $.ajax({
        type: 'GET',
        url: apiUrl+values1[item]['id'],
        async: false,
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", project_settings.product_api_token);
        },
        dataType: 'json',
        success: function (data) {
          rawData = data.hits.hits;
          productData = rawData;

          var itemTitleHtml = html;
          var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,values1[item]['id']);
          var itemTitleHtml = itemTitleHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
          var itemTitleHtml = itemTitleHtml.replace('#data.title#',productData[0]._source.product_name);
          var itemTitleHtml = itemTitleHtml.replace('#data.price#',productData[0]._source.currency+" "+productData[0]._source.price_1);

          productHtml += itemTitleHtml;

          var itemTitleHtml = item_sku;
          var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,values1[item]['id']);
          var itemTitleHtml = itemTitleHtml.replace('#data.sku#',productData[0]._source.sku);
          itemSkuHtml += itemTitleHtml;

          var itemTitleHtml = activeSummary;
          var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,values1[item]['id']);
          var itemTitleHtml = itemTitleHtml.replace('#data.summary#',productData[0]._source.description);
          activeSummaryHtml += itemTitleHtml;

          var itemTitleHtml = item_features;
          var fetureList = '';
          for (let [i, features] of productData[0]._source.features.entries() ) {
            fetureList += features.key+": "+features.value+"<br>";
          }
          var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,values1[item]['id']);
          var itemTitleHtml = itemTitleHtml.replace('#data.features#',fetureList);
          itemFeaturesHtml += itemTitleHtml;

        }
      });
    }
} else {
  compareHtml.html('No records found.')
}
compareHtml.find("#item_title_price").html("<td></td>"+productHtml)
compareHtml.find("#item_sku").html("<td><strong>ITEM NUMBER</strong></td>"+itemSkuHtml)
compareHtml.find("#item_summary").html("<td><strong>SUMMARY</strong></td>"+activeSummaryHtml)
compareHtml.find("#item_features").html("<td><strong>FEATURES</strong></td>"+itemFeaturesHtml)

$('#myCompareList #listing').removeClass('hide');
$('#myCompareList #listing .row').html(compareHtml.html());
