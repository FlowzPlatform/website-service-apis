/* Add your custom JavaScript/jQuery functions here. It will be automatically included in every page. */
var project_settings = function () {
  var tmp = null;
  $.ajax({
      async: false,
      type: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: '../assets/project_settings.json',
      success: function (data) {
          tmp = data.project_settings;
      },
      error: function(err){
          console.log(err);
      }
  });
  return tmp;
}();

Y({
  db: {
  name: 'indexeddb'
  },
  connector: {
  name: 'webrtc',
  room: 'wishList-example'
  },
  sourceDir: null,
  share: {
      wishList: 'Array',
      compareList: 'Array',
      wishListRegister: 'Array',
      compareListRegister: 'Array'
  }
  }).then(function (y) {
  window.yList = y
  // whenever content changes, make sure to reflect the changes in the DOM
  y.share.wishList.observe(function (event) {
      // if (event.type === 'insert') {
      //     console.log('y.share.wishList',y.share.wishList._content.length);
      //     console.log('y.share.wishList._content[0].val.product_id',y.share.wishList._content[0].val.product_id);

      //     let wishCount = JSON.parse(localStorage.getItem("savedWishlist"))
      //     if(wishCount != null)
      //     {
      //         document.getElementById("wishlistCount").innerHTML = wishCount.length ;
      //     }
      //     showWishList();
      // } else if (event.type === 'delete') {

      //     // if(localStorage.getItem("savedWishlistDelete") != null)
      //     // {
      //     //     let savedWishlistDelete = JSON.parse(localStorage.getItem("savedWishlistDelete"));
      //     //     console.log("savedWishlistDelete",savedWishlistDelete)
      //     //     console.log("savedWishlistDelete",savedWishlistDelete.product_id)
      //     //     $("#myWishList .listing .product-"+savedWishlistDelete.product_id).remove();
      //     // }

      //     if(localStorage.getItem("savedWishlist") != null)
      //     {
      //         let wishCount = JSON.parse(localStorage.getItem("savedWishlist"))
      //         if(wishCount != null)
      //         {
      //             document.getElementById("wishlistCount").innerHTML = wishCount.length ;
      //         }
      //     }
      //     else
      //     {
      //         document.getElementById("wishlistCount").innerHTML = 0 ;
      //         // $('#myWishList .listing').html('No records found.');
      //     }

      //     showWishList();
      // }
      if (event.type === 'insert') {
        showWishList();
      } else if (event.type === 'delete') {
        showWishList();
      }
  })
  y.share.wishListRegister.observe(function (event) {
    if (event.type === 'insert') {
      showWishList();
    } else if (event.type === 'delete') {
      showWishList();
    }
  })

  y.share.compareListRegister.observe(function (event) {
    if (event.type === 'insert') {
      showCompareList();
    } else if (event.type === 'delete') {
      showCompareList();
    }
  })

  y.share.compareList.observe(function (event) {
      // if (event.type === 'insert') {

      //     let compareCount = JSON.parse(localStorage.getItem("savedCompared"))
      //     if(compareCount != null)
      //     {
      //         document.getElementById("comparedCount").innerHTML = compareCount.length ;
      //     }
      //     showCompareList();
      // } else if (event.type === 'delete') {

      //     // if(localStorage.getItem("savedComparedDelete") != null)
      //     // {
      //     //     let savedComparedDelete = JSON.parse(localStorage.getItem("savedComparedDelete"));
      //     //     console.log("savedComparedDelete",savedComparedDelete)
      //     //     console.log("savedComparedDelete",savedComparedDelete.product_id)
      //     //     $("#myCompareList #listing .product-"+savedComparedDelete.product_id).remove();
      //     // }

      //     if(localStorage.getItem("savedCompared") != null)
      //     {
      //         let compareCount = JSON.parse(localStorage.getItem("savedCompared"))
      //         if(compareCount != null)
      //         {
      //             document.getElementById("comparedCount").innerHTML = compareCount.length ;
      //         }
      //     }
      //     else
      //     {
      //         document.getElementById("comparedCount").innerHTML = 0;
      //         $("#myCompareList #listing div:first").addClass("hide");
      //         if($('#myCompareList #listing .js-no-records').length == 0)
      //         {
      //             $('#myCompareList #listing').append('<span class="js-no-records">No records found.</span>')
      //         }
      //         else{
      //             $('#myCompareList #listing .js-no-records').html('No records found.')
      //         }
      //     }

      //     showCompareList();
      // }
      if (event.type === 'insert') {
        showCompareList();
      } else if (event.type === 'delete') {
        showCompareList();
      }
  })

  $(document).ready(function() {
    init();
  })
})

if(getParameterByName('token')) {
  document.cookie = "loginTokenKey="+getParameterByName('token');
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function validateEmail(sEmail) {
 var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
 if (filter.test(sEmail)) {
   return true;
 }
 else {
   return false;
 }
}

function getCookie(name) {
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

let user_id = user_details = null;
let userToken = getCookie('loginTokenKey');
if(userToken != null) {
    var user_details = function () {
      var tmp = null;
      $.ajax({
          'async': false,
          'type': "POST",
          'url': project_settings.user_detail_api,
          'headers': {"Authorization": userToken},
          'success': function (res) {
              tmp = res.data;
              user_id = tmp._id;
          }
      });
      return tmp;
    }();
}

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  }
  else {
    return false;
  }
}

let wishlist_values = "";

let compare_values = "";


$(document).on("click", ".smooth-scroll", function(event){event.preventDefault(); $("html, body").animate({scrollTop: $($.attr(this, "href")).offset().top}, 500);});
/*JS code for custom gform building*/


var init = function() {
  if(user_details != null)
  {
    if(window.yList.share.wishListRegister._content.length == 0)
    {
      wishlist_values = function () {
          var tmp = null;
          $.ajax({
              'async': false,
              'type': "GET",
              'global': false,
              'dataType': 'json',
              'url': project_settings.shopping_api_url+"?type=1&user_id="+user_id,
              'success': function (data) {
                  tmp = data;
              }
          });
          return tmp;
        }();
        // console.log('wishlist_values.length',wishlist_values.length)
        // console.log('wishlist_values',wishlist_values)
        for(let item in wishlist_values)
        {
          // console.log('wishlist_values[item]',wishlist_values[item])
          var recentAddedInWishlist = [];
          recentAddedInWishlist.push(wishlist_values[item]);
          window.yList.share.wishListRegister.push(recentAddedInWishlist);
        }
        // console.log('window.yList.share.wishListRegister',window.yList.share.wishListRegister)
      }

    if(window.yList.share.compareListRegister._content.length == 0)
    {
      compare_values = function () {
        var tmp = null;
        $.ajax({
            'async': false,
            'type': "GET",
            'global': false,
            'dataType': 'json',
            'url': project_settings.shopping_api_url+"?type=3&user_id="+user_id,
            'success': function (data) {
                tmp = data;
            }
        });
        return tmp;
      }();
      // console.log('compare_values.length',compare_values.length)
      // console.log('compare_values',compare_values)
      for(let item in compare_values)
      {
        // console.log('compare_values[item]',compare_values[item])
        var recentAddedInComparelist = [];
        recentAddedInComparelist.push(compare_values[item]);
        window.yList.share.compareListRegister.push(recentAddedInComparelist);
      }
      // console.log('window.yList.share.compareListRegister',window.yList.share.compareListRegister)
    }
  }

  showWishList();
  showCompareList();
  let type;
  // login-logout start
  if(user_details != null){
   $(".logout-show").removeClass('hide');
   $('.username-text').text('welcome '+user_details.fullname);
 }
 else {
   document.cookie = 'loginTokenKey=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   $(".login-show").removeClass('hide');
   $('.username-text').text('');
 }

 $('.login-text-check').on('click',function() {
   document.cookie = 'loginTokenKey=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   location.reload();
 });
  // login-logout end

  // Compare, whishlist and cart count in header
  if(window.yList.share.compareList._content != null && user_id == null){
    document.getElementById("comparedCount").innerHTML =  window.yList.share.compareList._content.length ;;//JSON.parse(localStorage.getItem("savedCompared")).length;
  }

  if(window.yList.share.compareListRegister._content != null && user_id != null){
    document.getElementById("comparedCount").innerHTML =  window.yList.share.compareListRegister._content.length ;;//JSON.parse(localStorage.getItem("savedCompared")).length;
  }

  if(window.yList.share.wishList._content != null && user_id == null){
    document.getElementById("wishlistCount").innerHTML = window.yList.share.wishList._content.length ;
  }

  if(window.yList.share.wishListRegister._content != null && user_id != null){
    document.getElementById("wishlistCount").innerHTML = window.yList.share.wishListRegister._content.length ;
  }

  if(localStorage.getItem("savedCart") != null && user_id != null){
    document.getElementById("cartCount").innerHTML = JSON.parse(localStorage.getItem("savedCart")).length ;
  }

  // Auto sugession for search in header
  $('input[name="search"]').autocomplete({
      source: function( request, response ) {
        var settings = {
              "async": true,
              "crossDomain": true,
              "url": project_settings.search_api_url,
              "method": "POST",
              "headers": {
                "authorization": project_settings.search_api_auth_token,
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "0fe82014-49ea-eca8-1432-1f3b9fffc910"
              },
              "data": " {\n  \"query\": {\n    \"bool\": {\n      \"must\": {\n        \"match_all\": {\n         \n        }\n      },\n      \"filter\": {\n        						\"match\": {\n          \"product_name\": \" "+ request.term +" \"\n        }\n      }\n    }\n  }\n}\u0001"
            }

            $.ajax(settings).done(function (data) {
              //console.log(data);
              response(data.hits.hits)
            });

      },
      select: function( event, ui ) {
        // console.log('ui.item', ui.item._source.product_name)
        $('input[name="search"]').val(ui.item._source.product_name);
        return false;
      }
    }).autocomplete("instance" )._renderItem = function( ul, item ) {
      	return $( "<li>" )
          .append( "<div>" + item._source.product_name + "</div>" )
          .appendTo( ul );
    };

  	$('.header-search-col').find('.btn-search').click(function(){
      if($.trim($('input[name="search"]').val()) != '') {
               window.location.href = project_settings.base_url+'public/search.html?SearchSensor=' + $('input[name="search"]').val()
      }
      else {
        window.location.href = project_settings.base_url+'public/search.html';
      }
      return false;
    })
}

//add in to Compare, Wishlist and Cart
$(document).on('click', '.js-add-to-wishlist', function(e) {
  e.preventDefault();
  let product_id = $(this).data('id');
  addInTransaction(1,product_id); // 1 for WishList
});

$(document).on('click', '.js-add-to-cart', function(e) {
  e.preventDefault();
  let product_id = $(this).data('id');
  location.href = project_settings.base_url+'/public/productdetail.html?locale='+project_settings.default_culture+'&pid='+product_id; // 2 for Cart
});

$(document).on('click', '.js-add-to-compare', function(e) {
  e.preventDefault();
  let product_id = $(this).data('id');
  addInTransaction(3,product_id); // 3 for Compare
});

$(document).on('click', '.js-add-to-transaction', function(e) {
    e.preventDefault();
    let product_id = $(this).data('id');

    if (e.target.classList.contains("ecomm-cart")) {
      type=1;
    }else if(e.target.classList.contains("ecomm-wishlist")) {
      type=2;
    }else if(e.target.classList.contains("ecomm-compare")) {
      type=3;
    }
    addInTransaction(type,product_id)
})

function addInTransaction(type,product_id){
  if (user_id == null ) {
    dataSaveToLocal(type,product_id)
  } else {
    dataSaveToDatabase(type,product_id,user_id)
  }
}

function dataSaveToLocal(type,product_id,show_msg=true){
  let decideLocalStorageKey = decide_localStorage_key(type)
  if (localStorage.getItem(decideLocalStorageKey) != null) {
    let values = JSON.parse(localStorage.getItem(decideLocalStorageKey));
    let wishlistDataSaveToLocalhost = checkIfExist(type, product_id, values, decideLocalStorageKey,show_msg); // pass all the params and the last one is the array
    // localStorage.setItem(decideLocalStorageKey , JSON.stringify(wishlistDataSaveToLocalhost))
    if(show_msg != false) {
      // updateShoppingLocalCount(values.length , type);
    }

  }else{
    var data = [];
    data.push({ 'type': type,'product_id': product_id });
    localStorage.setItem(decideLocalStorageKey , JSON.stringify(data))

    var recentAddedInWishlist = [];
    recentAddedInWishlist.push({ 'type': type,'product_id': product_id });
    // localStorage.setItem(decideLocalStorageKey+'Recent' , JSON.stringify(recentAddedInWishlist))

    if(decideLocalStorageKey == "savedCompared")
    {
      window.yList.share.compareList.push(recentAddedInWishlist)
    }
    else{
      window.yList.share.wishList.push(recentAddedInWishlist)
    }

    if(show_msg != false) {
      // updateShoppingLocalCount(JSON.parse(localStorage.getItem(decideLocalStorageKey)).length , type);
      showSuccessMessage("item successfully added");
    }
  }
}

function deleteFromLocal(type,product_id){
  if(type == 1) {
    let values = window.yList.share.wishList._content;
    // console.log('values',values)
    for (i in values){
      if(window.yList.share.wishList._content[i].val.product_id == product_id)
      {
        // console.log("----------values[i]-----------",values[i])
        // localStorage.setItem("savedWishlistDelete" , JSON.stringify(values[i]))
        // values.splice(i, 1);
        window.yList.share.wishList.delete(parseInt(i))
        $(".product-"+product_id).remove();
      }
    }
    // localStorage.setItem("savedWishlist" , JSON.stringify(values))

    if(window.yList.share.wishList._content != null && window.yList.share.wishList._content.length == 0)
    {
      // localStorage.removeItem('savedWishlist');
      // window.yList.share.wishList.delete(0)
      $('#myWishList .listing').html('No records found.');
      // location.reload();
    }
    else
    {
      document.getElementById("wishlistCount").innerHTML =  window.yList.share.wishList._content.length;
      // window.yList.share.wishList.delete(0)
    }
  }
  if(type == 3) {
    let values = window.yList.share.compareList._content; // JSON.parse(localStorage.getItem("savedCompared"));

    for (i in values){
      if(window.yList.share.compareList._content[i].val.product_id == product_id)
      {
        // console.log("----------values[i]-----------",values[i])
        // localStorage.setItem("savedWishlistDelete" , JSON.stringify(values[i]))
        // values.splice(i, 1);
        window.yList.share.compareList.delete(parseInt(i))
        $(".product-"+product_id).remove();
      }
    }

    // localStorage.setItem("savedCompared" , JSON.stringify(values))

    if(window.yList.share.compareList._content != null && window.yList.share.compareList._content.length == 0)
    {
      // localStorage.removeItem('savedCompared');
      // window.yList.share.compareList.delete(0)
      $("#myCompareList #listing div:first").addClass("hide");
      if($('#myCompareList #listing .js-no-records').length == 0)
      {
          $('#myCompareList #listing').append('<span class="js-no-records">No records found.</span>')
      }
      else{
          $('#myCompareList #listing .js-no-records').html('No records found.')
      }
      // location.reload();
    }
    else
    {
      if(window.yList.share.compareList._content.length>4)
      {
        $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*window.yList.share.compareList._content.length+'px')
      }
      else{
        $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*5+'px')
      }
      // window.yList.share.compareList.delete(0)
      document.getElementById("comparedCount").innerHTML =  window.yList.share.compareList._content.length;
    }
  }
}

function dataSaveToDatabase(type,product_id,user_id,show_msg=true){
  var data = { 'type': type,'product_id': product_id,'user_id' : user_id };
  $.ajax({
    type : 'POST',
    url : project_settings.shopping_api_url,
    data : data,
    dataType : 'json',
    success : function(response_data) {
      if(response_data.status == 200) {
        if(show_msg != false) {
          updateShoppingDatabaseCount(type,'+');
        }

        var recentAddedInWishlist = [];
        recentAddedInWishlist.push(data);

        if(type == 1)
        {
          // localStorage.setItem('savedWishlistRecent' , JSON.stringify(recentAddedInWishlist))
          window.yList.share.wishListRegister.push(recentAddedInWishlist)
        }
        else if(type == 3)
        {
          // localStorage.setItem('savedComparedRecent' , JSON.stringify(recentAddedInWishlist))
          window.yList.share.compareListRegister.push(recentAddedInWishlist)
        }
      }
      if(show_msg != false) {
        showSuccessMessage(response_data.message)
      }
    }
  })
}

function deleteFromDatabase(type,product_id,user_id){
  var data = { 'type': type,'product_id': product_id,'user_id' : user_id };
  $.ajax({
    type : 'DELETE',
    url : project_settings.shopping_api_url+"?type="+type+"&product_id="+product_id+"&user_id="+user_id,
    data : data,
    dataType : 'json',
    success : function(response_data) {
      if(response_data.status == 200) {
        updateShoppingDatabaseCount(type,'-');

        var recentAddedInWishlist = data;
        // recentAddedInWishlist.push(data);
        // localStorage.removeItem('savedWishlistRecent');
        if(type == 1)
        {
          // localStorage.setItem('savedWishlistDelete' , JSON.stringify(recentAddedInWishlist))
          let values = window.yList.share.wishListRegister._content;
          // console.log('values',values)
          for (i in values){
            if(window.yList.share.wishListRegister._content[i].val.product_id == product_id)
            {
              // console.log("----------values[i]-----------",values[i])
              // localStorage.setItem("savedWishlistDelete" , JSON.stringify(values[i]))
              // values.splice(i, 1);
              window.yList.share.wishListRegister.delete(parseInt(i))
              $(".product-"+product_id).remove();
            }
          }
        }
        else if(type == 3)
        {
          // localStorage.setItem('savedComparedDelete' , JSON.stringify(recentAddedInWishlist))
          let values = window.yList.share.compareListRegister._content;
          // console.log('values',values)
          for (i in values){
            if(window.yList.share.compareListRegister._content[i].val.product_id == product_id)
            {
              // console.log("----------values[i]-----------",values[i])
              // localStorage.setItem("savedWishlistDelete" , JSON.stringify(values[i]))
              // values.splice(i, 1);
              window.yList.share.compareListRegister.delete(parseInt(i))
              $(".product-"+product_id).remove();
            }
          }
        }

      }
      $(".product-"+product_id).remove();
    }
  })
}

$(document).on('click', '.js-remove-wishlist', function(e) {
  e.preventDefault();
  var confirmation = confirm("Are you sure want to delete?");
  if(confirmation)
  {
      let product_id = $(this).data('id');
      if (user_id == null ) {
        deleteFromLocal(1,product_id);
      }
      else {
        deleteFromDatabase(1,product_id,user_id)
      }
  }
});

$(document).on('click', '.js-remove-compare', function(e) {
  e.preventDefault();
  var confirmation = confirm("Are you sure want to delete?");
  if(confirmation)
  {
    let product_id = $(this).data('id');
    if (user_id == null ) {
      deleteFromLocal(3,product_id);
    }
    else {
      deleteFromDatabase(3,product_id,user_id)
    }
  }
});

function updateShoppingLocalCount(count , type) {
  if (type == 1) {
    document.getElementById("wishlistCount").innerHTML = count;
  }
  if(type == 2){
    document.getElementById("cartCount").innerHTML = count;
  }
  if(type == 3){
    document.getElementById("comparedCount").innerHTML = count;
  }
}

function updateShoppingDatabaseCount(type, operation) {
  if (type == 1) {
    document.getElementById("wishlistCount").innerHTML = eval(parseInt(document.getElementById("wishlistCount").innerHTML)+operation+1);
  }
  if(type == 2){
    document.getElementById("cartCount").innerHTML = eval(parseInt(document.getElementById("cartCount").innerHTML)+operation+1);
  }
  if(type == 3){
    document.getElementById("comparedCount").innerHTML = eval(parseInt(document.getElementById("comparedCount").innerHTML)+operation+1);
  }
}

function decide_localStorage_key(type){
  if (type == 1) {
    return "savedWishlist"
  }else if(type == 2){
    return  "savedCart"
  }else if(type ==3){
    return "savedCompared"
  }
}


function checkIfExist(type ,product_id ,array, decideLocalStorageKey, show_msg=true) {  // The last one is array
  // var count = array.length + 1;

  if(user_details != null){
    if(type == 1)
      {
        var found = window.yList.share.wishListRegister._content.some(function (el) {
          return el.val.product_id == product_id;
        });
      }
      else if(type == 3)
      {
        var found = window.yList.share.compareListRegister._content.some(function (el) {
          return el.val.product_id == product_id;
        });
      }
  }
  else{
    if(type == 1)
    {
      var found = window.yList.share.wishList._content.some(function (el) {
        return el.val.product_id == product_id;
      });
    }
    else if(type == 3)
    {
      var found = window.yList.share.compareList._content.some(function (el) {
        return el.val.product_id == product_id;
      });
    }
  }

  // var found = array.some(function (el) {
  //   return el.product_id == product_id;
  // });

  if (!found)
  {
    array.push({ type: type , 'product_id': product_id  });

    var recentAddedInWishlist = [];
    recentAddedInWishlist.push({ 'type': type,'product_id': product_id });
    // localStorage.removeItem(decideLocalStorageKey+'Recent');
    // localStorage.setItem(decideLocalStorageKey+'Recent' , JSON.stringify(recentAddedInWishlist))

    if(type == 1)
    {
      window.yList.share.wishList.push(recentAddedInWishlist)
    }
    else{
      window.yList.share.compareList.push(recentAddedInWishlist)
    }

    if(show_msg != false) {
      showSuccessMessage("Item added successfully");
    }
  }else{
    if(show_msg != false) {
      showErrorMessage("Item already exist");
    }
  }
  return array
}


function getProductDetailBysku(sku){
      var settings = {
        "crossDomain": true,
        "url": "https://ae3f5d08fa1ec79613b0b307dadb0834.us-east-1.aws.found.io:9243/pdm1/_search",
        "method": "POST",
        "headers": {
          "authorization": "Basic YWFrcm9uOjEyMzQ1Ng==",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "postman-token": "be0d1ef5-f2d5-dec4-2000-2fe2c0625233"
        },
        "data": " {\n  \"query\": {\n    \"bool\": {\n      \"filter\": {\n        \"match_phrase\": {\n          \"sku\": \"80-68730\"\n        }\n      }\n    }\n  					}\n}\u0001"
      }

      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

function showErrorMessage(error_message) {
	if ($('.alert-success').length){
		$( ".alert-success").remove();
	}
	if ($('.alert-danger').length) {
		$('.alert-danger').animate({marginTop: "-=50"}, 100, null, function() {
			$('.alert-danger span').html(error_message);
			$(this).animate({marginTop: "+=50"}, 100, null)
		});
	} else {
    $('body').prepend('<div class="container"><div class="alert alert-danger" style="margin-top:-50px;"><a data-dismiss="alert" class="close" href="javascript:void(0)">&times;</a><strong>Alert!</strong> <span>'+ error_message+'</span></div><div class="clr"></div></div>');
		$('.alert-danger').animate({marginTop: "+=50"}, 100, null);
	}
	setTimeout("hideAlertBar();", 15000);
}

function showSuccessMessage(success_message,url=null) {
	if($('.alert-danger').length) {
		$( ".alert-danger").remove();
	}
	if($('.alert-success').length) {
		$('.alert-success').animate({marginTop: "-=50"}, 100, null, function() {
			$('.alert-success span').html(success_message);
			$(this).animate({marginTop: "+=50"}, 100, null);
		});
	}
	else {
		if( $('#modal-table').is(":visible") && $('#modal-table .modal-content').length>0 ){
			$('body').prepend('<div class="container"><div class="alert alert-success" style="margin-top:-50px;"><a data-dismiss="alert" class="close" type="button">&times;</a><strong>Success!</strong> <span>'+ success_message+'</span></div><div class="clr"></div></div>');
		} else {
			$('body').prepend('<div class="container"><div class="alert alert-success" style="margin-top:-50px;"><a data-dismiss="alert" class="close" type="button">&times;</a><strong>Success!</strong> <span>'+ success_message+'</span></div><div class="clr"></div></div>');
		}
		$('.alert-success').animate({marginTop: "+=50"}, 100, null);
	}
  if(url == null){
      setTimeout("hideAlertBar();", 20000);
  }else{
      setTimeout("location.href = '"+url+"';",1500);
  }
}

function hideAlertBar(){
	$(".alert-success, .alert-warning,  .alert-danger, .alert-info").animate({marginTop: "-=50"}, 600, function() {$(this).parent().remove();});
}
function showPageAjaxLoading(){
	if (!$('.widget-box-overlay').length) {
		$('body').prepend('<div class="widget-box-overlay" style="display: block;"><img alt="" src="'+project_settings.base_url+'assets/preloader.gif"></div>');
	}
}
function hidePageAjaxLoading(){
	$('.widget-box-overlay').remove();
}


function showWishList(recetAdded=false)
{
  var listHtml = $('#myWishList .js-list').html()

  if(user_details != null){
    if(recetAdded) {
      $("#myWishList .listing .js-no-records").remove();
      var wishlist_values = JSON.parse(localStorage.getItem("savedWishlistRecent"));
    }
    else {
      $('#myWishList .listing').html('');
      // wishlist_values = function () {
      //   var tmp = null;
      //   $.ajax({
      //       'async': false,
      //       'type': "GET",
      //       'global': false,
      //       'dataType': 'json',
      //       'url': project_settings.shopping_api_url+"?type=1&user_id="+user_id,
      //       'success': function (data) {
      //           tmp = data;
      //       }
      //   });
      //   return tmp;
      // }();
      var wishlist_values = window.yList.share.wishListRegister._content;

      // if(wishlist_values.length != null)
      // {
      //   document.getElementById("wishlistCount").innerHTML = wishlist_values.length;
      // }
    }
  }
  else {
    if(recetAdded) {
      $("#myWishList .listing .js-no-records").remove();
      var wishlist_values = window.yList.share.wishList._content;
      // var wishlist_values = JSON.parse(localStorage.getItem("savedWishlistRecent"));
    }
    else {
      $('#myWishList .listing').html('');
      var wishlist_values = window.yList.share.wishList._content;
      // wishlist_values = JSON.parse(localStorage.getItem("savedWishlist"));
    }
  }
  if(wishlist_values != "")
  {
    document.getElementById("wishlistCount").innerHTML = wishlist_values.length;
  }
  else{
    document.getElementById("wishlistCount").innerHTML = 0;
  }

  var productHtml='';
  var productData;

  if($("#myWishList").length > 0)
  {
    if (typeof(Storage) !== "undefined" && typeof(listHtml) !== "undefined" && wishlist_values != "" ) {
        for (item in wishlist_values){
          if(user_details != null){
            var prodId = window.yList.share.wishListRegister._content[item].val.product_id;
          }
          else{
            if(recetAdded) {
              var prodId = window.yList.share.wishList._content[item].val.product_id;
            }
            else{
              var prodId = window.yList.share.wishList._content[item].val.product_id;
              // var prodId = wishlist_values[item]['product_id'];
            }
          }

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

                let listHtml1 = listHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
                listHtml1 = listHtml1.replace(/#data.id#/g,prodId);
                listHtml1 = listHtml1.replace('#data.title#',productData[0]._source.product_name);
                listHtml1 = listHtml1.replace('#data.sku#',productData[0]._source.sku);
                listHtml1 = listHtml1.replace('#data.price#',productData[0]._source.price_1);
                listHtml1 = listHtml1.replace('#data.currency#',productData[0]._source.currency);

                listHtml1 = listHtml1.replace('#data.description#',productData[0]._source.description);

                if(recetAdded)
                {
                  $('#myWishList .js-add-products').append(listHtml1);
                }
                else if($('#myWishList .listing .product-'+prodId).length == 0)
                {
                  $('#myWishList .listing').append(listHtml1);
                }
                // productHtml += listHtml1;
              }
            });
          }
        }
    } else {
      $('#myWishList .listing').html('<span class="js-no-records">No records found.</span>');
    }

    $('#myWishList .listing').removeClass('hide');
  }
}

function showCompareList(recetAdded=false)
{
  var apiUrl = project_settings.product_api_url;
  var compareHtml = $('#myCompareList #listing')

  if(user_details != null){
    var compare_values = window.yList.share.compareListRegister._content;

    // if(compare_values.length != null)
    // {
    //   document.getElementById("comparedCount").innerHTML = compare_values.length;
    // }

    // console.log("window.yList.share.compareListRegister",window.yList.share.compareListRegister._content)
    // console.log("compare_values",compare_values)

   }
   else {
    if(recetAdded) {
      var compare_values = window.yList.share.compareList._content;
      // var compare_values = JSON.parse(localStorage.getItem("savedComparedRecent"));
    }
    else {
      var compare_values = window.yList.share.compareList._content;
    }
   }

  if(compare_values != "")
  {
    document.getElementById("comparedCount").innerHTML = compare_values.length;
  }
  else{
    document.getElementById("comparedCount").innerHTML = 0;
  }
  if($("#myCompareList").length > 0)
  {
    var productHtml=itemSkuHtml=activeSummaryHtml=itemFeaturesHtml='';
    var productData;
    var itemTitleHtml='';
    let html = $('.js-list #item_title_price').html();
    let item_sku = $('.js-list #item_sku').html();
    let activeSummary = $('.js-list #item_summary').html();
    let item_features = $('.js-list #item_features').html();

    // if (typeof(compareHtml.html()) !== "undefined" && compare_values != null) {
    if (typeof(compareHtml.html()) !== "undefined" && compare_values != null && compare_values.length > 0) {
      // if(localStorage.getItem("savedCompared") != null){
      //     if(JSON.parse(localStorage.getItem("savedCompared")).length>4)
      //     {
      //        $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*JSON.parse(localStorage.getItem("savedCompared")).length+'px')
      //     }
      //     else{
      //       $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*5+'px')
      //     }
      //   }
      //   else{
      //     if(compare_values.length>4)
      //       {
      //          $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*compare_values.length+'px')
      //       }
      //       else{
      //         $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*5+'px')
      //       }
      //   }
          if(compare_values.length>4)
          {
            $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*compare_values.length+'px')
          }
          else{
            $('#myCompareList #listing .ob-product-compare .compare-block').css('width',225*5+'px')
          }

          for (item in compare_values){
            if(user_details != null){
              var prodId = window.yList.share.compareListRegister._content[item].val.product_id;
            }
            else{
              var prodId = window.yList.share.compareList._content[item].val.product_id;
            }

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

              var itemTitleHtml = html;
              var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,prodId);
              var itemTitleHtml = itemTitleHtml.replace('#data.image#',project_settings.product_api_image_url+productData[0]._source.default_image);
              var itemTitleHtml = itemTitleHtml.replace('#data.title#',productData[0]._source.product_name);
              var itemTitleHtml = itemTitleHtml.replace('#data.price#',productData[0]._source.currency+" "+productData[0]._source.price_1);

              productHtml = itemTitleHtml;

              var itemTitleHtml = item_sku;
              var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,prodId);
              var itemTitleHtml = itemTitleHtml.replace('#data.sku#',productData[0]._source.sku);
              itemSkuHtml = itemTitleHtml;

              var itemTitleHtml = activeSummary;
              var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,prodId);
              var itemTitleHtml = itemTitleHtml.replace('#data.summary#',productData[0]._source.description);
              activeSummaryHtml = itemTitleHtml;

              var itemTitleHtml = item_features;
              var fetureList = '';
              for (let [i, features] of productData[0]._source.features.entries() ) {
                fetureList += features.key+": "+features.value+"<br>";
              }
              var itemTitleHtml = itemTitleHtml.replace(/#data.id#/g,prodId);
              var itemTitleHtml = itemTitleHtml.replace('#data.features#',fetureList);
              itemFeaturesHtml = itemTitleHtml;

              if(recetAdded)
              {
                $("#myCompareList #listing .js-no-records").remove();
                $("#myCompareList #listing div:first").removeClass("hide");

                if(JSON.parse(localStorage.getItem("savedCompared")).length == 1)
                {
                  // console.log('compareHtml.find("#item_title_price1").html', compareHtml.find("#item_title_price1").html());
                  compareHtml.find("#item_title_price1").html("<td></td>"+productHtml)
                  compareHtml.find("#item_sku1").html("<td><strong>ITEM NUMBER</strong></td>"+itemSkuHtml)
                  compareHtml.find("#item_summary1").html("<td><strong>SUMMARY</strong></td>"+activeSummaryHtml)
                  compareHtml.find("#item_features1").html("<td><strong>FEATURES</strong></td>"+itemFeaturesHtml)
                  $('#myCompareList #listing').html(compareHtml.html());
                }
                else
                {
                  $("tr#item_title_price1").append(productHtml)
                  $("tr#item_sku1").append(itemSkuHtml)
                  $("tr#item_summary1").append(activeSummaryHtml)
                  $("tr#item_features1").append(itemFeaturesHtml)
                }
              }
              else if(item == 0)
              {
                $("#myCompareList #listing .js-no-records").remove();
                $("#myCompareList #listing div:first").removeClass("hide");

                compareHtml.find("#item_title_price1").html("<td></td>"+productHtml)
                compareHtml.find("#item_sku1").html("<td><strong>ITEM NUMBER</strong></td>"+itemSkuHtml)
                compareHtml.find("#item_summary1").html("<td><strong>SUMMARY</strong></td>"+activeSummaryHtml)
                compareHtml.find("#item_features1").html("<td><strong>FEATURES</strong></td>"+itemFeaturesHtml)
                $('#myCompareList #listing').html(compareHtml.html());
              }
              else{
                compareHtml.find("#item_title_price1").append(productHtml)
                compareHtml.find("#item_sku1").append(itemSkuHtml)
                compareHtml.find("#item_summary1").append(activeSummaryHtml)
                compareHtml.find("#item_features1").append(itemFeaturesHtml)
                // console.log('compareHtml.html()',compareHtml.html());
                $('#myCompareList #listing').html(compareHtml.html());
              }

            }
          });
        }
    } else {
      $("#myCompareList #listing div:first").addClass("hide");
      compareHtml.append('<span class="js-no-records">No records found.</span>')
    }

    $('#myCompareList #listing').removeClass('hide');
  }
}

function submitNewsLetterForm()
{
  let data = {"email":$('input[name="subscribe_email"]').val()}
  $.ajax{
    type : 'POST',
    url : project_settings.email_subscribe_api_url,
    dataType : 'json',
    data: data,
    success : function(response_data) {
      if (response_data!= "") {
        if(response_data.status == 400) {
          showErrorMessage(response_data.message)
        }
        else{
          showSuccessMessage("The email has successfully been registered for the newsletter")
          $('input[name="subscribe_email"]').val('')
        }
      }
    }
  })
  return false;
}
