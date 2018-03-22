if (user_id == null ) {
  window.location.href = 'login.html';
}

$(document).ready(function(){
  listRequestQuote()
});


function listRequestQuote(){
  let callApiUrl = project_settings.request_quote_api_url;
  var quoteHtml = $("#request-quote-list tr:eq(1)").wrap('<tr/>').html();
  var quoteHtml = $("#request-quote-list tr:eq(1)").unwrap().html();
  var quoteHtml = $("#request-quote-list tr:eq(1)").wrap('<tbody/>').html();
  $("#request-quote-list tr:eq(1)").remove();
  // console.log("url", callApiUrl+'?user_id='+user_id+'&website_id='+website_settings['projectID']);
  showPageAjaxLoading()
  axios({
      method: 'GET',
      url : callApiUrl+'?user_id='+user_id+'&website_id='+website_settings['projectID'],
    })
  .then(response_data => {
    let quote_datas = response_data.data.data;
    if (quote_datas!= "") {
      for (var key in quote_datas) {
        var listHtmlReplace = quoteHtml.replace(/#data.index#/g, key+1);
      //  var listHtmlReplace = listHtmlReplace.replace(/#data.totalComment#/g, 0);
        var listHtmlReplace = listHtmlReplace.replace(/#data.itemName#/g, quote_datas[key].product_description.product_name);
        var listHtmlReplace = listHtmlReplace.replace(/#data.date#/g, formatDate(quote_datas[key].created_at,project_settings.format_date));
        var listHtmlReplace = listHtmlReplace.replace(/#data.id#/, quote_datas[key].id);
        $("#request-quote-list > tbody").prepend(listHtmlReplace);
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
