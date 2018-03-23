if (user_id == null ) {
  window.location.href = 'login.html';
}

$(document).ready(function(){
  if( admin_role_flag == 1 ){
      $(".main-title").html('<i class="fa fa-user"></i> Received Inquiries List')
      $(".js_is_admin").removeClass("hide")
  }
  listRequestQuote()
});


function listRequestQuote(){
  var quoteHtml = $("#request-quote-list tr:eq(1)").wrap('<tr/>').html();
  var quoteHtml = $("#request-quote-list tr:eq(1)").unwrap().html();
  var quoteHtml = $("#request-quote-list tr:eq(1)").wrap('<tbody/>').html();
  $("#request-quote-list tr:eq(1)").remove();
  // console.log("url", callApiUrl+'?user_id='+user_id+'&website_id='+website_settings['projectID']);
  let callApiUrl = project_settings.request_quote_api_url+'?user_id='+user_id+'&website_id='+website_settings['projectID'];
  if( admin_role_flag == 1 ){
    callApiUrl = project_settings.request_quote_api_url+'?website_id='+website_settings['projectID'];
  }

  showPageAjaxLoading()
  axios({
      method: 'GET',
      url : callApiUrl,
    })
  .then(response_data => {
    let quote_datas = response_data.data.data;
    if (quote_datas!= "") {
      for (var key in quote_datas) {
        var listHtmlReplace = quoteHtml.replace(/#data.index#/g, key+1);
      //  var listHtmlReplace = listHtmlReplace.replace(/#data.totalComment#/g, 0);
        listHtmlReplace = listHtmlReplace.replace(/#data.itemName#/g, quote_datas[key].product_description.product_name);
        listHtmlReplace = listHtmlReplace.replace(/#data.date#/g, formatDate(quote_datas[key].created_at,project_settings.format_date));
        listHtmlReplace = listHtmlReplace.replace(/#data.id#/, quote_datas[key].id);
        if( admin_role_flag == 1 ){
            listHtmlReplace = listHtmlReplace.replace('#data.userName#',quote_datas[key].user_info.fullname);
            listHtmlReplace = listHtmlReplace.replace('#data.userEmail#',quote_datas[key].user_info.email);
        }
        $("#request-quote-list > tbody").append(listHtmlReplace);
        hidePageAjaxLoading()
      }
    }
    else if(response_data == '')
    {
    //  $('#js-cart_data').html("<hr> No records found.")
    //  $("#js-cart_data").removeClass('hide');
    }
    hidePageAjaxLoading()
  })
}
