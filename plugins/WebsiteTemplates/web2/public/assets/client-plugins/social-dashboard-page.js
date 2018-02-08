if(getCookie('loginTokenKey') != null) {
	// let wishlistKey = decide_localStorage_key(1);
	// if (localStorage.getItem(wishlistKey) != null) {
	// 	wishlist_values = JSON.parse(localStorage.getItem("savedWishlist"));
	// 	for (item in wishlist_values){
	// 		dataSaveToDatabase(wishlist_values[item]['type'],wishlist_values[item]['product_id'],user_id,false);
	// 	}
	// }

	// let compareKey = decide_localStorage_key(3);
	// if (localStorage.getItem(compareKey) != null) {
	// 	compare_values = JSON.parse(localStorage.getItem("savedCompared"));
	// 	for (item in compare_values){
	// 		dataSaveToDatabase(compare_values[item]['type'],compare_values[item]['product_id'],user_id,false);
	// 	}
	// }

	window.location = "index.html";
}

$('.email-submit').on('click',function(){
	//var ob_id = $_GET('ob_id');
	var ob_id = getParameterByName('ob_id');
	var social_email = $("#social_email").val();

	var socialDetails = {"email":social_email,"id":ob_id};
	$.ajax({
		type: 'POST',
		url: project_settings.social_process_api,
		async: false,
		data:  JSON.stringify(socialDetails),
		dataType: 'json',
		headers: { 'Content-Type': 'application/json' },
		success: function (result) {
			if(!$( ".login-show" ).hasClass( "hide" )) {
				$(".login-show").addClass('hide');
			}
			$(".logout-show").removeClass('hide');
			$('.username-text').text('Welcome');

			document.cookie = "loginTokenKey=" + result.logintoken;

			var user_details = function () {
				var tmp = null;
				$.ajax({
					'async': false,
					'type': "POST",
					'url': project_settings.user_detail_api,
					'headers': {"Authorization": result.logintoken},
					'success': function (res) {
						tmp = res.data;
						user_id = tmp._id;
					}
				});
				return tmp;
			}();

			// let wishlistKey = decide_localStorage_key(1);
			// if (localStorage.getItem(wishlistKey) != null) {
			//   for (item in wishlist_values){
			// 	dataSaveToDatabase(wishlist_values[item]['type'],wishlist_values[item]['product_id'],user_id,false);
			//   }
			// }

			// let compareKey = decide_localStorage_key(3);
			// if (localStorage.getItem(compareKey) != null) {
			//   for (item in compare_values){
			// 	dataSaveToDatabase(compare_values[item]['type'],compare_values[item]['product_id'],user_id,false);
			//   }
			// }

			//redirect to previous page.
			if(document.referrer.trim() != '') {
				if (document.referrer.indexOf(project_settings.base_url) >= 0)
				{
					window.location = document.referrer;
				}
				else{
					window.location = "index.html";
				}
			}
			else {
				window.location = "index.html";
			}
		},
		error: function(err) {
			console.log("social login error = ", err);
		}
	});
});
