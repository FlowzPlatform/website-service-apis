var https = require('https');
var qs = require('querystring');

var SANDBOX_API = 'wwwcie.ups.com';
var LIVE_API = 'onlinetools.ups.com';

let errors = require('@feathersjs/errors') ;
let axios=require('axios')
// let parseString = require('xml2js').parseString;
let date=new Date();
let apidate=''+date.getFullYear()+date.getMonth()+date.getDate();
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~apidate:',apidate)
const X2JS = require('x2js')

var USE_JSON = false;
//var Rating;
var Rating = function (licenseId, userId, password) {

	this.licenseId = licenseId;
	this.userId = userId;
	this.password = password;

	this.sandbox = true;
};

//Use UPS sandbox
Rating.prototype.useSandbox = function(bool) {
  	this.sandbox = (bool == true);
};

Rating.prototype.setJsonResponse = function(bool) {
	USE_JSON = (bool == true);
};



//Make a shipAccept request
Rating.prototype.makeRequest = function(options, callback) {

	//set account credentials
	options['licenseId'] = '9D54B58179E4C9B5';
	options['userId'] = 'poshx';
	options['password'] = 'Posh1234';
	// console.log('options:',JSON.stringify(options))
	var requestData = buildRequestData(options);

	var command = '/usr/bin/curl -k -d "'+(requestData)+'" https://onlinetools.ups.com/ups.app/xml/Rate ';
	var shell_exec = require('shell_exec').shell_exec;
	var responseData = shell_exec(command);

	// var parser = require('xml2json');
 	// var xmltojson = parser.toJson(responseData);
	 // var json= JSON.parse(xmltojson);

	// let json;
	// await parseString(responseData, function (err, result) {
	// 	console.dir('result------------',result)
	// 	json = result;
	// });
	let timetransitapi='{ "Security": { "UsernameToken": { "Username": "poshx", "Password": "Posh1234" }, "UPSServiceAccessToken": { "AccessLicenseNumber": "9D54B58179E4C9B5" } }, "TimeInTransitRequest": { "Request": { "RequestOption": "TNT", "TransactionReference": { "CustomerContext": "", "TransactionIdentifier": "" } }, "ShipFrom": { "Address": { "StateProvinceCode": "'+options.shipment.shipper.address.StateProvinceCode+'", "CountryCode": "'+options.shipment.shipper.address.countryCode+'", "PostalCode": "'+options.shipment.shipper.address.PostalCode+'" } }, "ShipTo": { "Address": { "CountryCode": "'+options.shipment.shipTo.address.countryCode+'", "PostalCode": "'+options.shipment.shipTo.address.postalCode+'" } }, "Pickup": { "Date": "'+apidate+'" }, "ShipmentWeight": { "UnitOfMeasurement": { "Code": "LBS", "Description": "" }, "Weight": "'+options.shipment.package[0].weight+'" }, "MaximumListSize": "10" } }'
	let timedatacommand="curl -H 'Content-Type: application/json' -X POST -d '"+timetransitapi+"' https://onlinetools.ups.com/rest/TimeInTransit"
	let timedata=shell_exec(timedatacommand);
	timedata=JSON.parse(timedata)
	let days
	// console.log('@@@@@@@@@@@@@@@@',JSON.parse(timedata))
	if(timedata.TimeInTransitResponse.TransitResponse!=undefined){
	for(let i in timedata.TimeInTransitResponse.TransitResponse.ServiceSummary){
		// console.log('!!!!!!!!!!!!!!!!i',timedata.TimeInTransitResponse.TransitResponse.ServiceSummary[i].Service)
		if(timedata.TimeInTransitResponse.TransitResponse.ServiceSummary[i].Service.Code=='GND'){
			days=timedata.TimeInTransitResponse.TransitResponse.ServiceSummary[i].EstimatedArrival.BusinessDaysInTransit
			
		}
	}	
	}
	else if(timedata.TimeInTransitResponse.CandidateResponse){
		days=undefined
	}
	// axios.post('https://onlinetools.ups.com/rest/TimeInTransit',timetransitapi,{})
	// .then((res)=>{
	// 	days=res.data.TimeInTransitResponse.TransitResponse.ServiceSummary[6].EstimatedArrival.BusinessDaysInTransit
	// })
	// console.log('days',days)
	let x2js = new X2JS()
	let json = x2js.xml2js(responseData)
	// console.log(JSON.stringify(json))
	var rate = 	{};
	if(json.RatingServiceSelectionResponse.Response.ResponseStatusCode == 1)
	{
		for(var i=0;i<json.RatingServiceSelectionResponse.RatedShipment.length ; i++)
		{
			  var quote = json.RatingServiceSelectionResponse.RatedShipment[i];
				var code = quote.Service.Code;
			//var negoprice = quote.NegotiatedRates.NetSummaryCharges.GrandTotal.MonetaryValue;
				var price = Number(quote.TotalCharges.MonetaryValue);
				// console.log('price without markup', price);
				// let markUpPer = 5;
				// let markUpValue = (price * markUpPer)/100;
				// console.log('markUpValue', markUpValue)
				// price = (price + markUpValue).toFixed(2);
				// console.log('price with markup',price);
				switch (code)
				{
					case '03':
						// console.log('GuaranteedDaysToDelivery for ups Ground',Number(quote.GuaranteedDaysToDelivery))
						
						rate['UPS Ground'] = [price,Number(days)];
						// rate['UPS Ground Transit Days']=Number(days);
						break;
					case '12':
						rate['UPS 3 Day Select'] = price;
						break;
					case '02':
						rate['UPS 2nd Day Air'] = price;
						break;
					case '01':
						rate['Next Day Air'] = price;
						break;
					case '59':
						rate['2nd Day Air AM'] = price;
						break;
					case '13':
						rate['Next Day Air Saver'] = price;
						break;
					case '14':
						rate['UPS Next Day Air Early AM'] = price;
						break;
					case '07':
						rate['UPS Worldwide Express'] = price;
						break;
					case '08':
						rate['UPS Worldwide Expedited'] = price;
						break;
					case '11':
						rate['UPS Standard'] = price;
						break;


				}
				// console.log(code+'\t$'+price)
				// rate.push({[code]:price})

			//	rate[code] = price;
				// console.log("++++++++++ss",rate);
		}
		//console.log("rate",rate)
		callback('',rate);
	}
	else
	{
		console.log('response---------',json.RatingServiceSelectionResponse.Response.Error);
			// callback('',json.RatingServiceSelectionResponse.Response.Error);
			throw new errors.NotAcceptable(json.RatingServiceSelectionResponse.Response.Error.ErrorDescription)
	}

};

function buildRequestData(data) {

	var response = "", err = false;

    response += "<?xml version='1.0' encoding='utf-8'?>";
    response += "<AccessRequest xml:lang='en-US'>";

    response += "<AccessLicenseNumber>" + data.licenseId + "</AccessLicenseNumber>";
    response += "<UserId>" + data.userId + "</UserId>";
    response += "<Password>" + data.password + "</Password>";
    response += "</AccessRequest>";

	response += "<?xml version='1.0' encoding='utf-8'?>";
	response += "	<RatingServiceSelectionRequest xml:lang='en-US'>";
	response += "	  <Request>";
	response += "	    <TransactionReference>";

	if (!data.customerContext) return { success: false, error: 'Missing Customer Context'};

	response += "	      <CustomerContext>Bare Bones Rate Request</CustomerContext>";
	response += "	      <XpciVersion>1.0001</XpciVersion>";
	response += "	    </TransactionReference>";
	response += "		<RequestAction>Rate</RequestAction>";
	response += "		<RequestOption>Shop</RequestOption>";
	response += "	  </Request>";

	if (!data.pickUpType)  return { success: false, error: 'Missing Pickup Type' };
	var pickUpType = data.pickUpType;

	response += "	    <PickupType>";
	response += "	  	<Code>" + pickUpType.code + "</Code>";
	response += "	  	<Description>" + pickUpType.description + "</Description>";
	response += "	    </PickupType>";
	response += "		<CustomerClassification><Code>03</Code></CustomerClassification>";


	if (!data.shipment) return { success: false, error: 'Missing Shipment'};
	var shipment = data.shipment;

	response += "	  <Shipment>";
	response += "	    	<Description>" + shipment.description + "</Description>";
	response += "	    <Shipper>";

	if (!data.shipment.shipper.address) return { success: false, error: 'Missing shipment address' };
	var shipperAddress = data.shipment.shipper.address;

	response += "	      <Address>";

	response += "	        <StateProvinceCode>" + shipperAddress.StateProvinceCode + "</StateProvinceCode>";
	response += "	        <PostalCode>" + shipperAddress.PostalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipperAddress.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </Shipper>";

	if (!data.shipment.shipTo) return { success: false, error: 'Missing ShipTo' };
	var shipTo = data.shipment.shipTo;

	response += "	    <ShipTo>";

	response += "	      <Address>";
	response += "	        <PostalCode>" + shipTo.address.postalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipTo.address.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </ShipTo>";

	if (!data.shipment.shipFrom) return { success: false, error: 'Missing shipFrom' };
	var shipFrom = data.shipment.shipFrom;

	response += "	    <ShipFrom>";
	response += "	      <Address>";
	response += "	        <StateProvinceCode>" + shipFrom.address.stateProvinceCode + "</StateProvinceCode>";
	response += "	        <PostalCode>" + shipFrom.address.postalCode + "</PostalCode>";
	response += "	        <CountryCode>" + shipFrom.address.countryCode + "</CountryCode>";
	response += "	      </Address>";
	response += "	    </ShipFrom>";

	if (!data.shipment.service) return { success: false, error: 'Missing shipment service' };
	var service = data.shipment.service;

	response += "	  	<Service>";
	response += "	    		<Code>" + service.code + "</Code>";
	response += "	  	</Service>";

/*	if (!data.shipment.paymentInformation) return { success: false, error: 'Missing Payment Information' };
	var paymentInformation = data.shipment.paymentInformation;

	response += "	  	<PaymentInformation>";
	response += "		      	<Prepaid>";
	response += "	        		<BillShipper>";
	response += "	          			<AccountNumber>" + paymentInformation.accountNumber + "</AccountNumber>";
	response += "	        		</BillShipper>";
	response += "	      		</Prepaid>";
	response += "	  	</PaymentInformation>";*/

	if(!data.shipment.package)  return { success: false, error: 'Missing Shipment Packages' };


	data.shipment.package.forEach(function(val) {
		response += "<Package>";
		insert = buildPackageInternals(val);
		if(insert) response += insert;
		else err = 'Bad Package Internals';
		response += "</Package>";
	});

	if (!data.shipment.schedule) return { success: false, error: 'Missing Shipment Schedule'};

	var schedule = data.shipment.schedule;

	/*response += "	    <ShipmentServiceOptions>";
	response += "	      <OnCallAir>";
	response += "			<Schedule>";
	response += "				<PickupDay>" + schedule.pickUpDay + "</PickupDay>";
	response += "				<Method>" + schedule.method + "</Method>";
	response += "			</Schedule>";
	response += "	      </OnCallAir>";
	response += "	    </ShipmentServiceOptions>";*/
	response += "	  </Shipment>";
	response += "	</RatingServiceSelectionRequest>";
	// console.log('###############################:',response)
	return  response;

};

var buildPackageInternals = function(val) {
	var response = '';

	if(val.description) {
		response += "<Description>";
		response += val.description;
		response += "</Description>";
	}

	response += "<PackagingType>";
		response += "<Code>";
			response += val.code || '02';
		response += "</Code>";
	response += "</PackagingType>";

	response += "<PackageWeight>";
		response += "<Weight>";
		response += val.weight || '1';
		response += "</Weight>";
	response += "</PackageWeight>";

	//TODO: Insurance
	if(val.insurance) {
		response += "<PackageServiceOptions>";
			response += "<InsuredValue>";
			response += buildInsurance(val.insurance);
			response += "</InsuredValue>";
		response += "</PackageServiceOptions>";
	}
	return response;
};

module.exports = Rating;
