if (user_id == null ) {
  window.location = 'login.html';
}

//$('.fullname-word').text(user_details.fullname);
let userName = 'user'
if(admin_role_flag == 1){
   userName = 'Admin'
}

if(user_details.fullname != undefined ) userName = user_details.fullname
$('.fullname-word').text(userName);


let orderApiUrl = project_settings.myorders_api_url+'?user_id='+user_id+"&website_id="+website_settings['projectID']
if( admin_role_flag == 1 ){
  orderApiUrl = project_settings.myorders_api_url+"?website_id="+website_settings['projectID']
}
$.ajax({
	type : 'GET',
	url : orderApiUrl,
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
