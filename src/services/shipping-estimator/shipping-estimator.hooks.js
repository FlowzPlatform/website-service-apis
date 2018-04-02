module.exports = {
  before: {
    all: [],
    find: [
      // hook => getUpsDetail(hook)
    ],
    get: [
    ],
    create: [
      hook => getShippingEstimator(hook)
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

// getUpsDetail = async hook => {
//   var shippo = require('shippo')('shippo_test_3be31f8493f2ad8630b07fdd688dc2324054d1bb');
//   let carrier = hook.params.query.carrier;

//   var carrierdata = function () {
//     var result = []
//         return new Promise((resolve, reject) => {
//           shippo.carrieraccount.list({ carrier: carrier }, function(err, response) {
//             hook.result = response.results;
//             resolve(hook.result);
//           });
//         }).then(content => {
//           return content;
//         }).catch(err=> {
//           return err;
//         })
//   }
//   var res = await (carrierdata())
//   hook.result = { data : res, status : 200}
// }

getShippingEstimator= async hook => {
  // console.log('hook.data',hook.data);

  var shippo = require('shippo')(hook.data.shipping_estimator_key);
  
  var quantity= hook.data.total_qty;

  var shipping_details = hook.data.shipping_details;
  
  var quantity_in_carton = shipping_details.shipping_qty_per_carton
  
  // console.log("quantity",quantity);
  // console.log("quantity_in_carton",quantity_in_carton);
  
  var unit_productWeight = shipping_details.product_weight; //     $shippingInformation["product"]["weight"]["param"];
  
  var cartonWeight= quantity_in_carton*unit_productWeight;//$shippingInformation["carton"]["weight"]["param"];
  // console.log("cartonWeight",cartonWeight);
  
  //var unit_productWeight = cartonWeight/quantity_in_carton;
  // console.log("unit_productWeight",unit_productWeight);
  
  var total_weight = quantity*unit_productWeight;
  // console.log("total_weight",total_weight);
  
  if(quantity_in_carton != 0)
  {
    var noOfBox = Math.ceil(quantity/quantity_in_carton);
  }
  
  // console.log('noOfBox',noOfBox);
  
  var totalWeightForShipping = 0;
  
  var instanceVal1 = [];
  
  var carton_length = 1;
  if (typeof shipping_details.carton_length !== typeof undefined && shipping_details.carton_length != "") 
  {
    carton_length = shipping_details.carton_length;
  }

  var carton_width = 1;
  if (typeof shipping_details.carton_width !== typeof undefined && shipping_details.carton_width != "") 
  {
    carton_width = shipping_details.carton_width;
  }

  var carton_height = 1;
  if (typeof shipping_details.carton_height !== typeof undefined && shipping_details.carton_height != "") 
  {
    carton_height = shipping_details.carton_height;
  }
  
  if(noOfBox < 51)
  {
    if(noOfBox>1)
    {
      total_quantity=quantity;
      k=0;
      while(total_quantity != 0)
      {
        var instanceVal = {};
        
        if (total_quantity <= quantity_in_carton) {
          weightArray = (total_quantity * unit_productWeight);
          totalWeightForShipping = weightArray + totalWeightForShipping;
          instanceVal['length'] = carton_length; //carton_length 
          instanceVal['width'] = carton_width; //carton_width
          instanceVal['height'] = carton_height; //carton_height
          instanceVal['distance_unit'] = shipping_details.carton_size_unit.substring(0, 2).toLowerCase(); //carton_size_unit - inches
          instanceVal['weight'] = weightArray; 
          instanceVal['mass_unit'] = shipping_details.carton_weight_unit.substring(0, 2).toLowerCase(); //carton_weight_unit - LBS
          instanceVal1.push(instanceVal)
          
          total_quantity = 0;
        } else {
          weightArray = cartonWeight;
          total_quantity = total_quantity - quantity_in_carton;
          instanceVal['length'] = carton_length; 
          instanceVal['width'] = carton_width; 
          instanceVal['height'] = carton_height; 
          instanceVal['distance_unit'] = shipping_details.carton_size_unit.substring(0, 2).toLowerCase(); //carton_size_unit - inches
          instanceVal['weight'] = weightArray; 
          instanceVal['mass_unit'] = shipping_details.carton_weight_unit.substring(0, 2).toLowerCase(); //carton_weight_unit - LBS
          instanceVal1.push(instanceVal)
        }
        k++;
      }
    }
    else
    {
      var instanceVal = {};
      weightArray =  quantity * unit_productWeight;
      totalWeightForShipping = weightArray;
      instanceVal['length'] = carton_length; 
      instanceVal['width'] = carton_width; 
      instanceVal['height'] = carton_height; 
      instanceVal['distance_unit'] = shipping_details.carton_size_unit.substring(0, 2).toLowerCase(); //carton_size_unit - inches
      instanceVal['weight'] = weightArray; 
      instanceVal['mass_unit'] = shipping_details.carton_weight_unit.substring(0, 2).toLowerCase(); //carton_weight_unit - LBS
      instanceVal1.push(instanceVal)
    }
  }
  
  // var addressFrom  = {
  //     // "name": "Shawn Ippotle",
  //     "street1": "215 Clayton St.",
  //     "city": "San Francisco",
  //     "state": "CA",
  //     "zip": "94117",
  //     "country": "US",
  //     // "phone": "+1 555 341 9393",//optional
  //     // "email": "shippotle@goshippo.com",//optional
  //     "validate": true//optional
  // };
  
  // var addressTo = {
  //     "name": "Mr Hippo",
  //     "street1": "Broadway 1",
  //     "city": "New York",
  //     "state": "NY",
  //     "zip": "10007",
  //     "country": "US",
  //     // "phone": "+1 555 341 9393",//optional
  //     // "email": "mrhippo@goshippo.com",//optional
  //     "validate": true//optional
  // };
  
//   var parcel = [
//   {
//       "length": "5",
//       "width": "5",
//       "height": "5",
//       "distance_unit": "in",
//       "weight": "2",
//       "mass_unit": "lb"
//   },
//   {
//             "length": "5",
//     "width": "3",
//     "height": "3",
//     "distance_unit": "in",
//     "weight": "1",
//     "mass_unit": "lb"
//   }
// ];
  // console.log('instanceVal1',instanceVal1)
  var carrierdata = function () {
    // if(hook.data.carrier == "ups")
    // {
    //   var setAddressFrom = hook.data.addressFrom;
    //   var setAddressTo = hook.data.addressTo;
    //   var setCarrierAccount = hook.data.carrier_account; 
    // }
    // else{
    //   var setAddressFrom = addressFrom;
    //   var setAddressTo = addressTo;
    //   var setCarrierAccount = "de32f747140c459f8b02dd6c0bfab0e8";
    // }
    var setAddressFrom = hook.data.addressFrom;
    var setAddressTo = hook.data.addressTo;
    var setCarrierAccount = hook.data.carrier_account; 
    // console.log("setAddressTo",setAddressTo)
        return new Promise((resolve, reject) => {
          shippo.shipment.create({
            "address_from": setAddressFrom,
            "address_to": setAddressTo,
            "parcels": instanceVal1, //parcel
          //"carrier_accounts": ['de32f747140c459f8b02dd6c0bfab0e8'],
          "carrier_accounts": [setCarrierAccount],
            "async": false
          }, function(err, shipment){
            // console.log("----------------------");
            // console.log(shipment);
            resolve(shipment);
          });
        }).then(content => {
          return content;
        }).catch(err=> {
          return err;
        })
  }
  var res = await (carrierdata())
  hook.result = { data : res, status : 200}
}
