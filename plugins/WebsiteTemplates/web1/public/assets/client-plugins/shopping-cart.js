// console.log("Inside shop cart");

var paypal_Check = $('ShoppingCart').attr('Paypal');
var x_api_token_paypal = $('ShoppingCart').attr('x_api_token_paypal');
var x_api_login_paypal = $('ShoppingCart').attr('x_api_login_paypal');

var stripe_Check = $('ShoppingCart').attr('Stripe');
var x_api_token_stripe = $('ShoppingCart').attr('x_api_token_stripe');

var auth_Check = $('ShoppingCart').attr('AuthorizeDotNet');
var x_api_token_authdotnet = $('ShoppingCart').attr('x_api_token_authdotnet');
var x_api_login_authdotnet = $('ShoppingCart').attr('x_api_login_authdotnet');


// console.log("Checkbox selected", paypal_Check, stripe_Check, auth_Check)
// var xmlhttp = new XMLHttpRequest();
var btnId;

var finalcode = '<div> <div id="shopping_cart" class="js-hide-div"> <div class="container"> <table id="cart" class="table table-hover table-condensed"> <thead> <tr> <th style="width:50%">Product</th> <th style="width:10%">Price</th> <th style="width:8%">Quantity</th> <th style="width:22%" class="text-center">Amount</th> </tr> </thead> <tbody> <tr class="js-replace-products"> <td data-th="Product"> <div class="row"> <div class="col-sm-2 hidden-xs"><img src="http://placehold.it/100x100" alt="..." class="img-responsive js-checkout-image" /></div> <div class="col-sm-10"> <h4 class="nomargin js-checkout-product-name">Product 1</h4> <p class="js-checkout-description">Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.</p> </div> </div> </td> <td data-th="Price" class="js-checkout-unit-price">$1.99</td> <td data-th="Quantity" class="js-checkout-qty"> <input type="text" readonly class="form-control text-center js-checkout-qty" value="1"> </td> <td data-th="Subtotal" class="text-center js-checkout-product-total">1.99</td> </tr> <tr class="visible-xs"> <td class="text-center"><strong class="js-checkout-grand-total">Total 1.99</strong></td> </tr> <tr> <td></td> <td class="hidden-xs" colspan="2"><strong>Total Amount<strong></td> <td class="hidden-xs text-center"><strong class="js-checkout-grand-total">Total $1.99</strong></td> </tr> <tr style="float:left;margin-top:30px;background: transparent;"> <td colspan="2" class="hidden-xs " style="border-top:none; float: right"></td> <td style="border-top:none; " id="btnPaypal"> <button id="paypal" class="no-image" onclick="gatewaybtnclick(this.id)"><img src="http://res.cloudinary.com/flowz/raw/upload/v1515763939/websites/images/paypal.png" title="Click here to do payment using PayPal"/></button> </td> <td style="border-top:none;" id="btnStripe"> <button id="stripe" class="no-image" onclick="gatewaybtnclick(this.id)"><img src="http://res.cloudinary.com/flowz/raw/upload/v1515763939/websites/images/stripe.png" title="Click here to do payment using Stripe"/></button> </td> <td style="border-top:none; " id="btnAuth"> <button id="auth" class="no-image" onclick="gatewaybtnclick(this.id)"><img src="http://res.cloudinary.com/flowz/raw/upload/v1515763939/websites/images/authorize.png" title="Click here to do payment using Authorize.Net"/></button> <input type="hidden" value="" id="payment-gateway"></td> </tr> </tbody> </table> </div> </div> <div class="container" id="payment_detail" style="display: none"> <form role="form" id="payForm" method="post"> <div class="row"> <div class="col-xs-12 col-md-4 col-lg-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title"> Payment Details </h3> </div> <div class="panel-body"> <div class="form-group"> SELECT CARD TYPE <i class="mandatory-field">*</i><select class="form-control" name="cardType" id="cardType" style="margin-bottom: 15px"> <option name="" value="">Select Card Type</option> <option name="Visa" value="Visa">Visa</option> <option name="MasterCard" value="MasterCard">MasterCard</option> <option name="RuPay" value="RuPay">RuPay</option> <option name="Maestro" value="Maestro">Maestro</option> <option name="American Express" value="American Express">American Express</option> </select> </div> <div class="form-group"> CARD NUMBER <i class="mandatory-field">*</i> <div> <input type="text" class="form-control" name="cardNumber" id="cardNumber" placeholder="Valid Card Number" required="true" autofocus/> </div> </div> <div class="row"> <div class="col-xs-7 col-md-7 pl-zero"> <div class="form-group"> <div>VALID THRU <i class="mandatory-field">*</i></div> <div class="col-xs-6 col-lg-6 pl-zero"> <input type="text" class="form-control" name="expiryMonth" id="expiryMonth" placeholder="MM" required="true"/> </div> <div class="col-xs-6 col-lg-6 pl-zero"> <input type="text" class="form-control" name="expiryYear" id="expiryYear" placeholder="YY" required="true"/> </div> </div> </div> <div class="col-xs-5 col-md-5 pull-right pr-zero"> <div class="form-group"> CVV CODE <i class="mandatory-field">*</i><input type="password" class="form-control" name="cvCode" id="cvCode" placeholder="CVV" aria-required="true" required="true"/> </div> </div> </div> </div> </div> <ul class="nav nav-pills nav-stacked"> <li class="active"><a href="#"><span class="badge pull-right js-checkout-grand-total"><span class="glyphicon glyphicon-usd"></span>4200</span> Final Payment</a> </li> </ul> <br/> <div> <input type="submit" class="btn btn-success col-md-5 col-lg-5 payment-btn" value="Pay Now" /><button class="btn btn-success col-md-5 col-lg-5 payment-btn" onclick="backtocart();return false;">Back</button> </div> </div> </div> </form> </div> </div>';
var resp;

// console.log(finalcode);
$('ShoppingCart').html(finalcode);

if (paypal_Check == "false" || paypal_Check == undefined) {
	document.getElementById('btnPaypal').style = "display:none"
}

if (stripe_Check == "false" || stripe_Check == undefined) {
	document.getElementById('btnStripe').style = "display:none"
}

if (auth_Check == "false" || auth_Check == undefined) {
	// console.log("Inside auth")
	document.getElementById('btnAuth').style = "display:none"
}


function backtocart() {
	document.getElementById('shopping_cart').style = "display: block"
	document.getElementById('payment_detail').style = "display: none"
	return false;
}


function gatewaybtnclick(clicked_id) {
	btnId = clicked_id;
	// console.log("Clicked gateway id",clicked_id);
	document.getElementById('shopping_cart').style = "display: none"
	document.getElementById('payment_detail').style = "display: block"
	$("#payment-gateway").val(clicked_id)
}

$('form#payForm').validate({
	rules: {
"cardType":"required",
"cardNumber":"required",
"expiryMonth":"required",
"expiryYear":"required",
"cvCode":"required",
	},
	messages: {
	},
errorElement: "li",
errorPlacement: function(error, element) {
error.appendTo(element.closest("div"));
$(element).closest('div').find('ul').addClass('red')
},
errorLabelContainer: "#errors",
wrapper: "ul",
submitHandler: function(form) {
	paynow();
},
});

async function paynow() {
	showPageAjaxLoading()
	let cardType = $("#cardType").val();
	let cardNumber = $("#cardNumber").val();
	let expiryMonth = $("#expiryMonth").val();
	let expiryYear = $("#expiryYear").val();
	let cvCode = $("#cvCode").val();
	let paymentGatewayId = $("#payment-gateway").val()

	let billing_info = await fetchDefaultBillingInfo()
	 if(billing_info == null || billing_info == ''){
		 	hidePageAjaxLoading();
		 	showErrorMessage("Please add billing address")
			return false;
	 }

	let invoice = await addInvoice();
	// console.log("Invoice response",invoice)

  	await axios({
	   method: 'post',
	   url: project_settings.crm_payment_url,
	   data : {
			   "settingId" : website_settings.CrmSettingId,
			   "gateway": paymentGatewayId,					//auth //paypal
			   "id" : invoice.data.InvoiceID,
			   "amount" : parseFloat(grand_total),
			   "Name" : user_details.fullname,
			   "type": cardType,						//change
			   "cardNumber": cardNumber,//cardNumber,				//change
			   "expMonth": expiryMonth,					//change
			   "expYear": expiryYear,					//change
			   "cvc": cvCode							//change
		   }
   })
   .then(async function (response) {
		if ( $( "#payForm .js-error-msg" ).length ) {
			$("#payForm .js-error-msg").html('');
		}
		 	 resp = response;
			 let transaction_id;

			 if(paymentGatewayId == "stripe" || paymentGatewayId == "paypal"){
				 	transaction_id = response.data.paymentGateway.id
			 }else if (paymentGatewayId == "auth") {
				 	transaction_id = response.data.paymentAccounting.id
			 }

				let product_response = await getCartProductDataByUser()
				 if (product_response.data!= "") {
					 var newHtml = "";

					 	// console.log('product_response:: ', product_response)

					 	// if Tax found than authorized that cart
					 	for (let items of product_response) {
					 		console.log('items', items)
							if (items.taxcloud != 'undefined') {
							 	let taxcloudurl = project_settings.taxcloud_url;
								if (typeof TaxCloud != 'undefined' && TaxCloud.apiKey != '' && TaxCloud.apiId != '') {
									let taxid = TaxCloud.apiId
									let taxkey = TaxCloud.apiKey
								 	if (items.taxcloud.type == 'split') {
								 		for (let item of items.taxcloud.subtax) {
											let date = new Date().toISOString();
											date = date.split('T');
									 		let mdata = {
											  customerID: user_details['fullname'] + ' ' + user_details['_id'],
											  apiLoginID: taxid,
											  apiKey: taxkey,
											  cartID: item.tax_id,
											  orderID: item.tax_id,
											  dateAuthorized: date[0],
											  dateCaptured: date[0]
											};
								 			await axios({
												method: 'POST',
												url: taxcloudurl + '/AuthorizedWithCapture',
												data: mdata
											}).then(resp => {
												console.log('TAX Authorized')
											}).catch(err => {
												console.log('Tax Authorized Failed')
											})
								 		}
								 	} else {
								 		let date = new Date().toISOString();
								 		date = date.split('T');
								 		console.log('Date:: ', date, taxcloudurl)
								 		let mdata = {
										  customerID: user_details['fullname'] + ' ' + user_details['_id'],
										  apiLoginID: taxid,
										  apiKey: taxkey,
										  cartID: items.taxcloud.tax_id,
										  orderID: items.taxcloud.tax_id,
										  dateAuthorized: date[0],
										  dateCaptured: date[0]
										};
										console.log('mdata', mdata)
										await axios({
											method: 'POST',
											url: taxcloudurl + '/AuthorizedWithCapture',
											data: mdata
										}).then(resp => {
											console.log('Tax Authorized')
										}).catch(err => {
											console.log('Tax Authorized Failed')
										})
								 	}
								}
							 }
					 	}
						 let user_info = {};
						 user_info['id'] = user_details['_id']
						 user_info['email'] = user_details['email']
						 user_info['fullname'] = user_details['fullname']

						 let userDetails = {"subscription_id":website_settings.subscriptionId,"distributor_email":website_settings.projectOwner,"total":grand_total ,"quantity":total_qty,"user_id":user_id,"website_id":website_settings['projectID'],"websiteName":website_settings['websiteName'],"owner_id":website_settings['UserID'],"setting_id": website_settings.CrmSettingId,"products":product_response,'user_type':"registered",'user_info':user_info,'transaction_id':transaction_id,"invoice_number":invoice.data.InvoiceNumber,"user_billing_info":billing_info,"payment_via":paymentGatewayId,"billing_details":invoice};
						//  console.log("userDetails",userDetails);
						 axios({
								method: 'POST',
								url : project_settings.myorders_api_url,
								data:userDetails
							})
						.then(async response_data => {
									// console.log("response_data",response_data);
									let deletedData = await deleteCartDataByUser()
									hidePageAjaxLoading();
									showSuccessMessage("Your order is placed successfully.")
									window.location = "orderSuccess.html";
									return false;
						})
						.catch(function(err){
								// console.log("err" , err);
								hidePageAjaxLoading();
								$('.error-message').removeClass('hide');
						})
					}
			//  })
   })
   .catch(function (error) {
	if ( $( "#payForm .js-error-msg" ).length ) {
		$("#payForm .js-error-msg").html('');
	}
	if (typeof error.response != 'undefined') {
		if(typeof error.response.data.message != "undefined" && error.response.data.message!='')
		{
			$(".panel-body").append("<ul class='js-error-msg'><li style='color: red;'>"+error.response.data.message+"</li></ul>");
		}
	}
	hidePageAjaxLoading();
	// 	console.log("error+++",error);
   });
 return resp;
}

async function deleteCartDataByUser(){
		return await axios({
			 method: 'DELETE',
			 // url : project_settings.shopping_api_url+"?user_id="+user_id+"&type=2"
			 url : project_settings.shopping_api_url+"?user_id="+user_id+"&type=2&website_id="+website_settings['projectID']
		 })
		 .then(response_data => {
				// 	console.log("response_data",response_data);
				return response_data
		 }).catch({

		 })
}

async function getCartProductDataByUser(){
		return await axios({
				method: 'GET',
				url : project_settings.shopping_api_url+'?user_id='+user_id+'&type=2&website_id='+website_settings['projectID'],
			})
		.then(async response_data => {
				if(response_data.data !=""){
					return await returnCartData(response_data.data)
				}
		})
		.catch(function (error) {
 			// 	console.log("error+++",error);
    });
}


async function addInvoice() {
	let cart_data = await getCartProductDataByUser()

	let productData = []
	$.each(cart_data,function(key,product_detail){
			let data = {}
			data['sku'] = product_detail.product_description.sku
			data['title'] = product_detail.product_description.product_name
			data['description'] = product_detail.product_description.description
			data['qty'] = product_detail.total_qty
			let charges=0;
			let shipping_charges = 0
			if(typeof product_detail.charges != "undefined")
			{
				for(let charge_list in product_detail.charges)
				{
					charges = charges + parseFloat(product_detail.charges[charge_list]);
				}
			}

			if(product_detail.shipping_method.shipping_detail != undefined ){
					$.each(product_detail.shipping_method.shipping_detail,function( ship_key , ship_val ){
							if(ship_val.shipping_detail.shipping_charge != ""){
									shipping_charges += parseFloat(ship_val.shipping_detail.shipping_charge)
							}
					})
			}
			data['additional_charges'] = charges
			data['shipping_charges'] = shipping_charges
			data['tax'] = 0
			if (typeof product_detail.taxcloud != "undefined") {
				data['tax'] = product_detail.taxcloud.tax_amount
			}
			// let total = parseFloat(product_detail.total_qty)*parseFloat(product_detail.unit_price)+charges;
			// total = total.toFixed(project_settings.price_decimal)
			data['amount'] = product_detail.unit_price
			productData.push(data)
	})

	let resp;
	await axios({
			  method: 'post',
			  url: project_settings.crm_invoice_url,
			  data: {
				"settingId" : website_settings.CrmSettingId,
				"user" : user_details.email,
				"Name" : user_details.fullname,
				"EmailAddress" : user_details.email,
				"products" : productData
			}
	  })
	.then(function (response) {
	  // console.log("Invoice response",response);
	  resp = response;
	})
	.catch(function (error) {
	  // console.log("error",error);
	});
	return resp;
}

let returnCartData = function(response_data) {
	return new Promise(async (resolve , reject ) => {
		for (let [key,productRes] of response_data.entries()) {
		//$.each(response_data,async function(key,productRes){
				let shipping_info_data = []
				for (let [key1,shipping_info] of productRes.shipping_method.shipping_detail.entries()) {
				//$.each(productRes.shipping_method.shipping_detail,async function(key1,shipping_info){
							let shipping_address = {}
							let addressInfo = await returnAddressBookDetailById(shipping_info.selected_address_id)
							shipping_address['address_type'] = addressInfo.address_type
							shipping_address['name'] = addressInfo.name
							shipping_address['city'] = await getCountryStateCityById(addressInfo.city,3)
							shipping_address['country'] = await getCountryStateCityById(addressInfo.country,1)
							shipping_address['state'] = await getCountryStateCityById(addressInfo.state,2)
							shipping_address['culture'] = addressInfo.culture
							shipping_address['email'] = addressInfo.email
							if(addressInfo.mobile != "") {shipping_address['mobile'] = addressInfo.mobile}
							shipping_address['phone'] = addressInfo.phone
							shipping_address['postalcode'] = addressInfo.postalcode
							shipping_address['street1'] = addressInfo.street1
							if(addressInfo.street2 != ""){shipping_address['street2'] = addressInfo.street2}
							shipping_info['shipping_address'] = shipping_address
							productRes.shipping_method.shipping_detail[key1] = shipping_info
				}

				let product_description = await getProductDetailById(productRes.product_id)
				productRes['product_description'] = product_description;
				response_data[key] = productRes
		}
		resolve(response_data)
	})

}

async function fetchDefaultBillingInfo(id) {
      let returnData = null;
    	await axios({
    			method: 'GET',
    			url: project_settings.address_book_api_url+'?website_id='+website_settings['projectID']+'&user_id='+user_id+'&deleted_at=false&is_address=1&billing_default=1',
    		})
    	.then(async response => {
					let billing_address = {}
					if(response.data.data.length > 0){
					 addressInfo  = response.data.data[0]
					 billing_address['address_type'] = addressInfo.address_type
					 billing_address['name'] = addressInfo.name
					 billing_address['city'] = await getCountryStateCityById(addressInfo.city,3)
					 billing_address['country'] = await getCountryStateCityById(addressInfo.country,1)
					 billing_address['state'] = await getCountryStateCityById(addressInfo.state,2)
					 billing_address['culture'] = addressInfo.culture
					 billing_address['email'] = addressInfo.email
					 if(addressInfo.mobile != "") {billing_address['mobile'] = addressInfo.mobile}
					 billing_address['phone'] = addressInfo.phone
					 billing_address['postalcode'] = addressInfo.postalcode
					 billing_address['street1'] = addressInfo.street1
					 if(addressInfo.street2 != ""){billing_address['street2'] = addressInfo.street2}
					 returnData = billing_address
					 return returnData
				  }
    	})
    	.catch({
    	})
    	return returnData;
}
