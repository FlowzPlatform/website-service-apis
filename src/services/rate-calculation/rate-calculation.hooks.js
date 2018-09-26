let errors = require('@feathersjs/errors') ;

//ups requirements
var Rating = require('./ups/rating');
var confirmShipment = new Rating('1CF36E0A07BE2146', 'officebeacon', 'XbbZC4DEaY9bpF');
confirmShipment.useSandbox(true);
confirmShipment.setJsonResponse(true);

//global variables
let cartonHeight = 0;
let cartonLength = 0;
let cartonWidth = 0;
let cartonWeight = 0;
let qtyPerCartoon = 0;
let noOfBox = 0;
let totalWeight = 0;
//global variables

//Rating.prototype.testRequest();
//ups requirements

//fedex requirements
// let soap = require('soap');
// let url = path.join(__dirname, 'wsdl', 'RateService_v16.wsdl');
// let url = require('./fedex/wsdl/RateService_v16.wsdl');
// let params = require('./fedex/params/rateRequest.js');
//fedex requirements

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hook => beforeCreate(hook)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
let rateJson = {
  customerContext: "Rating and Service",
  pickUpType: {
    code: "01",
    description: "Rate"
  },
  shipment: {
    description: "Rate Description",
    shipper: {
      address: {}
    },
    shipTo: {
      address: {}
    },
    shipFrom: {
      address: {}
    },
    service: {
      code: "03"
    },

    package: [],
    schedule: {
      pickUpDay: "02",
      method: "02"
    }
  }
};

async function beforeCreate(hook) {
  if (hook.data.shipToInfo.shippingType[0] == 'ups') {
    // console.log('hook inside rate calculate',hook.data)
    // hook.data.shipperInfo.fob_zip_code = '';
    await assignAddress(hook.data);
    // hook.data.shipperInfo.shipping_qty_per_carton = 0;
    await generatePackage(hook.data);
    // console.log('rateJson.shipment.shipper.address-------',rateJson.shipment.shipper.address)
    // console.log('rateJson.shipment.shipTo.address-------',rateJson.shipment.shipTo.address)
    // console.log('rateJson.shipment.shipFrom.address-------',rateJson.shipment.shipFrom.address)
    Rating.prototype.makeRequest(rateJson, function(err, data) {
      if (err) {
        // console.error('error--',err);
        hook.result = err;
      }

      if (data) {
        // console.log('data---',data);
        let response = {};
        response['packaging_info'] = {
          'qtyPerCartoon' : qtyPerCartoon,
          'cartonHeight' : cartonHeight,
          'cartonLength' : cartonLength,
          'cartonWidth' : cartonWidth,
          'cartonWeight' : cartonWeight,
          'totalCartons' : noOfBox,
          'totalWeight' : totalWeight
        };
        response['estimatorResponse'] = data;
        hook.result = response;
      }
    });
  }
  else {
    soap.createClient(url, function(err, client) {
        client.getRates(params, function(err, result) {
            hook.result = result;
        });
    });
  }
}

function assignAddress(data) {
  if ((data.shipperInfo.fob_state_code || data.shipperInfo.fob_state_code != '') && (data.shipperInfo.fob_zip_code || data.shipperInfo.fob_zip_code != '') && (data.shipperInfo.fob_country_code || data.shipperInfo.fob_country_code != '')) {
    rateJson.shipment.shipper.address['StateProvinceCode'] = data.shipperInfo.fob_state_code
    rateJson.shipment.shipFrom.address['stateProvinceCode'] = data.shipperInfo.fob_state_code
    rateJson.shipment.shipper.address['PostalCode'] = data.shipperInfo.fob_zip_code
    rateJson.shipment.shipFrom.address['postalCode'] = data.shipperInfo.fob_zip_code
    rateJson.shipment.shipper.address['countryCode'] = data.shipperInfo.fob_country_code
    rateJson.shipment.shipFrom.address['countryCode'] = data.shipperInfo.fob_country_code
    // rateJson.shipment.shipFrom.address['countryCode'] = 'ny'
  }
  else {
    throw new errors.NotAcceptable('fob details are not available');
  }

  rateJson.shipment.shipTo.address['postalCode'] = data.shipToInfo.zip_code
  rateJson.shipment.shipTo.address['countryCode'] = data.shipToInfo.country
}

function generatePackage(data) {
  cartonHeight = 0;
  cartonLength = 0;
  cartonWidth = 0;
  cartonWeight = 0;
  qtyPerCartoon = 0;
  let productWeight = 0;
  let weightArray = [];

  if (data.shipperInfo.shipping_qty_per_carton) {
    qtyPerCartoon = Number(data.shipperInfo.shipping_qty_per_carton)
  }
  else {
    throw new errors.NotAcceptable('Details are not available');
  }

  cartonHeight = Number(data.shipperInfo.carton_height)
  cartonLength = Number(data.shipperInfo.carton_length)
  cartonWidth = Number(data.shipperInfo.product_width)
  cartonWeight = Number(data.shipperInfo.carton_weight)

  if(data.shipperInfo.product_weight && (data.shipperInfo.product_weight!= '' || data.shipperInfo.product_weight !=0)) {
    productWeight = Number(data.shipperInfo.product_weight)
  }
  else {
    throw new errors.NotAcceptable('Details are not available');
  }

  let qty = Number(data.shipToInfo.qty)
  console.log('qty---',qty);
  let qtyweight = (qty * productWeight);

  noOfBox = 0;
  totalWeight = 0;
  if (qtyPerCartoon != 0) {
    noOfBox = (Math.ceil(qty/qtyPerCartoon));
    totalWeight = qtyweight;
  }
  else {
    noOfBox = (Math.ceil(qty/70));
    totalWeight = qtyweight;
  }

  console.log('noOfBox',noOfBox);
  if (noOfBox > 1) {
    let pack = [];
    let totalQty = qty;
    let k = 0;
    console.log('totalQty',typeof totalQty)
    while(totalQty != 0) {
      if (totalQty <= qtyPerCartoon) {
        pack[k] = totalQty;
        weightArray[k] = totalQty * productWeight;
        totalQty = 0;
      }
      else {
        pack[k] = qtyPerCartoon;
        weightArray[k] = qtyPerCartoon * productWeight;
        totalQty = totalQty - qtyPerCartoon;
      }
      k++;
    }

  }
  else {
    weightArray[0] = totalWeight;
  }


  rateJson.shipment.package = [];
  weightArray.forEach((weight) => {
    let packageJson = {
      code: "02",
      weight: weight
    };
    rateJson.shipment.package.push(packageJson);
  })

}
