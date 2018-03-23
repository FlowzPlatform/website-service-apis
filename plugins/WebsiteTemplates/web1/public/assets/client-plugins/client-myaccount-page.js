if (user_id == null ) {
  window.location = 'login.html';
}

$('.fullname-word').text(user_details.fullname);

$.ajax({
	type : 'GET',
	url : project_settings.myorders_api_url+'?user_id='+user_id+'&website_id='+website_settings['projectID'],
	success : function(response_data) {
		if (response_data!= "") {
			if (typeof response_data.total !== 'undefined') {
				$('.order-cnt').text(response_data.total);
			}
		}
	}
})


$.ajax({
	type : 'GET',
	url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=1&website_id='+website_settings['projectID'],
	dataType : 'json',
	success : function(response_data) {
		if (response_data!= "") {
		$('.wishlist-cnt').text(response_data.length);
		}
	}
})

$.ajax({
	type : 'GET',
	url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
	dataType : 'json',
	success : function(response_data) {
		if (response_data!= "") {
		$('.cartlist-cnt').text(response_data.length);
		}
	}
})

$.ajax({
	type : 'GET',
	url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=3&website_id='+website_settings['projectID'],
	dataType : 'json',
	success : function(response_data) {
		if (response_data!= "") {
		$('.compare-cnt').text(response_data.length);
		}
	}
})

$('.username-word').text(user_details.fullname);

$('.email-word').text(user_details.email);

$('.email-word').parent().attr('href',"mailto:"+user_details.email);
