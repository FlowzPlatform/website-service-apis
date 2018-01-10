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

var finalcode = '<div> <div> <div id="shopping_cart"> <div class="container"> <table id="cart" class="table table-hover table-condensed"> <thead> <tr> <th style="width:50%">Product</th> <th style="width:10%">Price</th> <th style="width:8%">Quantity</th> <th style="width:22%" class="text-center">Subtotal</th> <th style="width:10%"></th> </tr> </thead> <tbody> <tr class="js-replace-products"> <td data-th="Product"> <div class="row"> <div class="col-sm-2 hidden-xs"><img src="http://placehold.it/100x100" alt="..." class="img-responsive js-checkout-image" /></div> <div class="col-sm-10"> <h4 class="nomargin js-checkout-product-name">Product 1</h4> <p class="js-checkout-description">Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.</p> </div> </div> </td> <td data-th="Price" class="js-checkout-unit-price">$1.99</td> <td data-th="Quantity" class="js-checkout-qty"> <input type="text" readonly class="form-control text-center js-checkout-qty" value="1"> </td> <td data-th="Subtotal" class="text-center js-checkout-product-total">1.99</td> <td class="actions" data-th=""> <button class="btn btn-danger btn-sm js-checkout-delete-product"><i class="fa fa-trash-o"></i></button> </td> </tr> <tr class="visible-xs"> <td class="text-center"><strong class="js-checkout-grand-total">Total 1.99</strong></td> </tr> <tr> <td></td> <td colspan="2" class="hidden-xs"></td> <td class="hidden-xs text-center"><strong class="js-checkout-grand-total">Total $1.99</strong></td> <td></td> </tr> <tr> <td colspan="2" class="hidden-xs " style="border-top:none; float: right"></td> <td style="border-top:none; " id="btnPaypal"> <button id="paypal" class="btn btn-success" onclick="gatewaybtnclick(this.id)">PayPal</button> </td> <td style="border-top:none;" id="btnStripe"> <button id="stripe" class="btn btn-success" onclick="gatewaybtnclick(this.id)">Stripe</button> </td> <td style="border-top:none; " id="btnAuth"> <button id="auth" class="btn btn-success" onclick="gatewaybtnclick(this.id)">AuthorizeDotNet</button> </td> </tr> </tbody> </table> </div> </div> <div class="container" id="payment_detail" style="display: none"> <div class="row"> <div class="col-xs-12 col-md-4"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title"> Payment Details </h3> </div> <div class="panel-body"> <form role="form"> <div class="form-group"> <select class="form-control" name="cardtype" id="cardType" style="margin-bottom: 15px"> <option name="" value="0">Select Card Type</option> <option name="Visa" value="Visa">Visa</option> <option name="MasterCard" value="MasterCard">MasterCard</option> <option name="RuPay" value="RuPay">RuPay</option> <option name="Maestro" value="Maestro">Maestro</option> <option name="American Express" value="American Express">American Express</option> </select> </div> <div class="form-group"> CARD NUMBER <div> <input type="text" class="form-control" id="cardNumber" placeholder="Valid Card Number" required autofocus/> </div> </div> <div class="row"> <div class="col-xs-7 col-md-7"> <div class="form-group"> EXPIRY DATE <div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expiryMonth" placeholder="MM" required/> </div> <div class="col-xs-6 col-lg-6 pl-ziro"> <input type="text" class="form-control" id="expiryYear" placeholder="YY" required/> </div> </div> </div> <div class="col-xs-5 col-md-5 pull-right"> <div class="form-group"> CV CODE <input type="password" class="form-control" id="cvCode" placeholder="CV" required/> </div> </div> </div> </form> </div> </div> <ul class="nav nav-pills nav-stacked"> <li class="active"><a href="#"><span class="badge pull-right js-checkout-grand-total"><span class="glyphicon glyphicon-usd"></span>4200</span> Final Payment</a> </li> </ul> <br/> <div> <button class="btn btn-success col-md-5 col-lg-5" onclick="backtocart()">Back</button> <div class="col-md-2 col-lg-2"></div> <button class="btn btn-success col-md-5 col-lg-5" onclick="paynow()">Pay Now</button> </div> </div> </div> </div> </div>';
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
	let cardType = $("#cardType").val();
	let cardNumber = $("#cardNumber").val();
	let expiryMonth = $("#expiryMonth").val();
	let expiryYear = $("#expiryYear").val();
	let cvCode = $("#cvCode").val();
	let invoice = await addInvoice();
	console.log("Invoice response",invoice)

  	await axios({
	   method: 'post',
	   url: 'http://api.flowz.com/crm/payment',
	   data : {
			   "settingId" : "ddc62653-6854-408d-9fd5-e56c63cb7ecf",
			   "gateway": "stripe",
			   "id" : invoice.data.InvoiceID,
			   "amount" :50,		
			   "Name" : "Dweep1",
			   "type": cardType,						//change
			   "cardNumber": cardNumber,				//change
			   "expMonth": expiryMonth,					//change
			   "expYear": expiryYear,					//change
			   "cvc": cvCode							//change
		   }
   })
   .then(function (response) {
	 console.log("Payment response",response);
	 resp = response;
   })
   .catch(function (error) {
	 console.log("error",error);
   });
 return resp;
}

async function addInvoice() {
	var resp;
	await axios({
		  method: 'post',
		  url: 'http://api.flowz.com/crm/invoice',
		  data: {
			settingId : "ddc62653-6854-408d-9fd5-e56c63cb7ecf",
			user : "janydoe@email.com",
			Name : "Dweep1",
			EmailAddress : "janydoe@email.com",
			"products" : [{
				"description" : "Sales Invoice",
				"qty" : total_qty,
				"amount" : grand_total
			}]
			}
	  })
	.then(function (response) {
	  console.log("Invoice response",response);
	  resp = response;
	})
	.catch(function (error) {
	  console.log("error",error);
	});
	return resp;
  }

