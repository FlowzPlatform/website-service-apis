console.log("Inside shop cart");

var paypal_Check = $('ShoppingCart').attr('Paypal');
var x_api_token_paypal = $('ShoppingCart').attr('x_api_token_paypal');
var x_api_login_paypal = $('ShoppingCart').attr('x_api_login_paypal');

var stripe_Check = $('ShoppingCart').attr('Stripe');
var x_api_token_stripe = $('ShoppingCart').attr('x_api_token_stripe');

var auth_Check = $('ShoppingCart').attr('AuthorizeDotNet');
var x_api_token_authdotnet = $('ShoppingCart').attr('x_api_token_authdotnet');
var x_api_login_authdotnet = $('ShoppingCart').attr('x_api_login_authdotnet');


console.log("Checkbox selected", paypal_Check, stripe_Check, auth_Check)
// var xmlhttp = new XMLHttpRequest();
var btnId;

// var finalcode = '<div><div class="container"> <div class="row"> <div id="paypal" class="col-lg-1 col-md-1 col-sm-2"> <button type="button" class="btn btn-primary" onclick="paypal_fun()">Paypal</button> </div><div id="stripe" class="col-lg-1 col-md-1 col-sm-2"> <button type="button" class="btn btn-success" onclick="stripe_fun()">Stripe</button> </div><div id="Authorize_Dot_Net" class="col-lg-1 col-md-1 col-sm-2"> <button type="button" class="btn btn-warning" onclick="auth_fun()">Authorize Dot Net</button> </div></div></div></div>';

// var finalcode = '<div><div id="shopping_cart"><div class="container"> <table id="cart" class="table table-hover table-condensed"> <thead> <tr> <th style="width:50%">Product</th> <th style="width:10%">Price</th> <th style="width:8%">Quantity</th> <th style="width:22%" class="text-center">Subtotal</th> <th style="width:10%"></th> </tr></thead> <tbody> <tr> <td data-th="Product"> <div class="row"> <div class="col-sm-2 hidden-xs"><img src="http://placehold.it/100x100" alt="..." class="img-responsive"/></div><div class="col-sm-10"> <h4 class="nomargin">Product 1</h4> <p>Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.</p></div></div></td><td data-th="Price">$1.99</td><td data-th="Quantity"> <input type="number" class="form-control text-center" value="1"> </td><td data-th="Subtotal" class="text-center">1.99</td><td class="actions" data-th=""> <button class="btn btn-info btn-sm"><i class="fa fa-refresh"></i></button> <button class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button> </td></tr></tbody> <tfoot> <tr class="visible-xs"> <td class="text-center"><strong>Total 1.99</strong></td></tr><tr> <td></td><td colspan="2" class="hidden-xs"></td><td class="hidden-xs text-center"><strong>Total $1.99</strong></td><td><button class="btn btn-success" onclick="pay_now()">Pay Now</button></td></tr></tfoot> </table> </div></div> <div class="container" id="payment_detail" style="display: none"> <div class="row"> <div class="col-xs-12 col-md-4"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title"> Payment Details </h3> </div><div class="panel-body"> <form role="form"> <div class="form-group"> <select class="form-control" name="gateway"> <option name="" value="0">Select Gateway</option> <option name="Stripe" value="Stripe">Stripe</option> <option name="AuthorizeDotNet" value="AuthorizeDotNet">Authorize DotNet</option> <option name="PayPal" value="PayPal">PayPal</option> </select> </div><div class="form-group"> CARD NUMBER <div> <input type="text" class="form-control" id="cardNumber" placeholder="Valid Card Number" required autofocus/> </div></div><div class="row"> <div class="col-xs-7 col-md-7"> <div class="form-group"> EXPIRY DATE <div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expityMonth" placeholder="MM" required/> </div><div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expityYear" placeholder="YY" required/> </div></div></div><div class="col-xs-5 col-md-5 pull-right"> <div class="form-group"> CV CODE <input type="password" class="form-control" id="cvCode" placeholder="CV" required/> </div></div></div></form> </div></div><ul class="nav nav-pills nav-stacked"> <li class="active"><a href="#"><span class="badge pull-right"><span class="glyphicon glyphicon-usd"></span>4200</span> Final Payment</a> </li></ul> <br/> <div> <button class="btn btn-success col-md-5 col-lg-5" onclick="backtocart()">Back</button> <div class="col-md-2 col-lg-2"></div><button class="btn btn-success col-md-5 col-lg-5">Pay Now</button> </div> </div></div></div>';


var finalcode = '<div><div> <div id="shopping_cart"> <div class="container"> <table id="cart" class="table table-hover table-condensed"> <thead> <tr> <th style="width:50%">Product</th> <th style="width:10%">Price</th> <th style="width:8%">Quantity</th> <th style="width:22%" class="text-center">Subtotal</th> <th style="width:10%"></th> </tr></thead> <tbody> <tr> <td data-th="Product"> <div class="row"> <div class="col-sm-2 hidden-xs"><img src="http://placehold.it/100x100" alt="..." class="img-responsive"/></div><div class="col-sm-10"> <h4 class="nomargin">Product 1</h4> <p>Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.</p></div></div></td><td data-th="Price">$1.99</td><td data-th="Quantity"> <input type="number" class="form-control text-center" value="1"> </td><td data-th="Subtotal" class="text-center">1.99</td><td class="actions" data-th=""> <button class="btn btn-info btn-sm"><i class="fa fa-refresh"></i></button> <button class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button> </td></tr><tr class="visible-xs"> <td class="text-center"><strong>Total 1.99</strong></td></tr><tr> <td></td><td colspan="2" class="hidden-xs"></td><td class="hidden-xs text-center"><strong>Total $1.99</strong></td><td></td></tr><tr> <td colspan="2" class="hidden-xs "style="border-top:none; float: right"></td><td style="border-top:none; " id="btnPaypal"> <button id="paypal" class="btn btn-success" onclick="gatewaybtnclick(this.id)">PayPal</button> </td><td style="border-top:none;" id="btnStripe"> <button id="stripe" class="btn btn-success" onclick="gatewaybtnclick(this.id)">Stripe</button> </td><td style="border-top:none; " id="btnAuth"> <button id="auth" class="btn btn-success" onclick="gatewaybtnclick(this.id)">AuthorizeDotNet</button> </td></tr></tbody> </table> </div></div><div class="container" id="payment_detail" style="display: none"> <div class="row"> <div class="col-xs-12 col-md-4"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title"> Payment Details </h3> </div><div class="panel-body"> <form role="form"> <div class="form-group"> <select class="form-control" name="cardtype" id="cardType" style="margin-bottom: 15px"> <option name="" value="0">Select Card Type</option> <option name="Visa" value="Visa">Visa</option> <option name="MasterCard" value="MasterCard">MasterCard</option> <option name="RuPay" value="RuPay">RuPay</option> <option name="Maestro" value="Maestro">Maestro</option> <option name="American Express" value="American Express">American Express</option> </select> </div><div class="form-group"> CARD NUMBER <div> <input type="text" class="form-control" id="cardNumber" placeholder="Valid Card Number" required autofocus/> </div></div><div class="row"> <div class="col-xs-7 col-md-7"> <div class="form-group"> EXPIRY DATE <div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expiryMonth" placeholder="MM" required/> </div><div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expiryYear" placeholder="YY" required/> </div></div></div><div class="col-xs-5 col-md-5 pull-right"> <div class="form-group"> CV CODE <input type="password" class="form-control" id="cvCode" placeholder="CV" required/> </div></div></div></form> </div></div><ul class="nav nav-pills nav-stacked"> <li class="active"><a href="#"><span class="badge pull-right"><span class="glyphicon glyphicon-usd"></span>4200</span> Final Payment</a> </li></ul> <br/> <div> <button class="btn btn-success col-md-5 col-lg-5" onclick="backtocart()">Back</button> <div class="col-md-2 col-lg-2"></div><button class="btn btn-success col-md-5 col-lg-5" onclick="paynow()">Pay Now</button> </div></div></div></div></div>';
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
	console.log("Inside auth")
	document.getElementById('btnAuth').style = "display:none"
}

// document.getElementById("ShoppingCart_append").innerHTML = finalcode;     

	// if(x_api_token_paypal == undefined || x_api_login_paypal == undefined) {
	// 	document.getElementById('paypal').style = "display: none"
	// }          

	// if(x_api_token_stripe == undefined) {
	// 	document.getElementById('stripe').style = "display: none"
	// }

	// if(x_api_token_authdotnet == undefined || x_api_login_authdotnet == undefined) {
	// 	document.getElementById('Authorize_Dot_Net').style = "display: none"
	// } 

	// function paypal_fun() {
	//   console.log("paypal button click");
	  
	// }

	// function stripe_fun() {
	//   console.log("stripe button click");
	// }

	// function auth_fun() {
	//   console.log("auth button click");
	// }


	// function pay_now() {
	// 	console.log("Pay now button click function");
	// 	document.getElementById('shopping_cart').style = "display: none"
	// 	document.getElementById('payment_detail').style = "display: block"
	// }

function backtocart() {
	document.getElementById('shopping_cart').style = "display: block"
	document.getElementById('payment_detail').style = "display: none"
}


function gatewaybtnclick(clicked_id) {
	btnId = clicked_id;
	console.log("Clicked gateway id",clicked_id);
	document.getElementById('shopping_cart').style = "display: none"
	document.getElementById('payment_detail').style = "display: block"
}

async function paynow() {

	console.log("Inside Pay now function");
	console.log("Gateway Id",btnId);

	var invoice = await addInvoice();
	console.log("########New Invoice created###",invoice)

	await $.ajax({
		type: 'POST',
		url: "http://172.16.230.88:3001/api/xero/payment/"+btnId,
		async: true,
		dataType: 'json',
		data : {
			"amount" : invoice.data.AmountDue,
			"InvoiceID" : invoice.data.InvoiceID,
			"type" : document.getElementById('cardType').value,
			"cardNumber" : document.getElementById('cardNumber').value,
			"expMonth" : document.getElementById('expiryMonth').value,
			"expYear" : document.getElementById('expiryYear').value,
			"cvc" : document.getElementById('cvCode').value
		},
	  success: function (data) {
	    console.log("Payment done###",data);
	    $('ShoppingCart').html(data);
	  },error: function(err) {
	  	console.log("Error")
	  }
	});
}

async function addInvoice() {
	//To create new invoice
	var body_option = {
		"accname":"Krishna",
		"appname": "Private Demo Company",
		"name": "Cust5",
		"description": "Sales Invoice",
		"quantity": 1	,
		"unitAmount": 200
    };

    var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://172.16.230.88:3001/api/xero/invoice/save",
		"method": "POST",
		"headers": {
			"content-type": "application/json",
			"cache-control": "no-cache"
		},
		"processData": false,
		"data": JSON.stringify(body_option)
	};

	await $.ajax(settings).done(function (response) {	
		resp = response;
		console.log("ajax response",response.data);
	});	
	return resp;
}


// de50ab2d-8cdf-4fa9-8ec3-b5ff2fcd10b8

// 97b4bc36-7ab7-4730-829f-742edda8d376