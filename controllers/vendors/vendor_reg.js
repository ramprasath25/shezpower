/***** Vendor Registration ******/
var crypto = require('crypto');
var mongodb = require('../../helpers/mongodb');
var mailConfig = require('../../helpers/email');

// Registration
exports.register = function(data, callback){     
    //Check wether vendor exists
    checkVendor(data, function(error,status){
        if(error){
          callback(true, status);
        }
        else{
          callback(false, status);
        }
    });
};

function checkVendor (data, callback){
  //Check count for mobile and email already registered
  mongodb.get().collection('login').find({$or : [{email : data.email}, {mobileNo : data.mobileNo}]}, function(err, coll) {
            coll.count (function(error, count) {
                if(error){
                  callback(true, error);
                }
                else{ 
                    // Already registerd throw status                 
                    if(count > 1){
                      callback(true, 0);
                    }
                    else{ 
                         //if not registered
                        registerVendor (data, function(err, status){
                        if(err){
                          callback(true, status);
                        }
                        else{
                          callback(false, status);
                        }
                      });
                    }
                }

            });
      });
};

// Login Table
var registerVendor = function (data, callback){
  data.vendor_id = 'shez'+crypto.randomBytes(12);
  var encryptPass = crypto.createHash('md5').update("welcome").digest("hex");

  var doc =   { 
                "vendor_id" : data.vendor_id,
                "businessType" : "product",
                "registration_ts" : "",
                "verification" : {
                  "emailVerified" : true,
                  "emailVerified_ts" : "",
                },
                "vendorDetails" : {
                  "firstName" : "Ram", 
                  "lastName" : "prasath", 
                  "mobileNo" : "9845566846", 
                  "email" : "ramprasath25@gmail.com", 
                  "address1" : "sakambari nagar", 
                  "address2" : "Banashankari", 
                  "city" : "Bangalore", 
                  "zipcode" : "560070", 
                  "state" : "Karnataka"
                },
                "companyInfo" : {
                  "companyName" : "rams pvt ltd", 
                  "establishment" : "2", 
                  "panNo" : "BEJPR4903L", 
                  "tanNo" : "KA15W4534", 
                  "website" : "www.shezpower.com", 
                  "telephone" : "080269764"
                }    
            }
            console.log(JSON.stringify(doc));
  // mongodb.get().collection('login').insert({
  //   "email"    : data.email,
  //   "mobileNo" : data.mobileNo,
  //   "password" : encryptPass,
  //   "vendorId" : data.vendor_id,
  //   "active"   : false
  //   }, function(err, status){
  //       if(err){
  //         callback(true, err);
  //       }
  //       else{
  //         // Register Vendor Details
  //           registerVendorDetails(data, function(err, status){
  //               if(err){
  //                 callback(true, status);
  //               }
  //               else{
  //                 callback(false, status);
  //               }
  //           });
  //       }
  // });
};
var registerVendorDetails = function (details, callback){
  //  delete details['password'];
    mongodb.get().collection('vendor_details').insert(details, function(err, status){
        if(err){
          callback(true, err);
        }
        else{
          var obj = details;
          var emailText = '';
          for(var prop in obj) {
              if(obj.hasOwnProperty(prop)){
                  emailText +=  prop + " : "+ obj[prop] + ", ";
                }                
          }
          //callback(false, "Registered Successful");
          mailConfig.sendEmail(emailText, function(error, status){
            if(error){
              callback(true, error);
            }
            else{
              callback(false, "Registered Successful");
            }
          });
        }
    });
};
