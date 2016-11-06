/***** Vendor Registration ******/
var crypto = require('crypto');
var mongodb = require('../../helpers/mongodb');
var mailConfig = require('../../helpers/email');
var mailgun = require('../../helpers/mailConfig');

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
  mongodb.get().collection('login').findOne({ $or: [ { "email": data.email }, { "mobileNo": data.mobileNo } ] }, 
    function(err, result) {            
        if(err){
          callback(true, err);
        }
        else{         
            // If New User
            if(result === null){
              registerVendor (data, function(err, status){
                    if(err){
                      callback(true, status);
                    }
                    else{
                      callback(false, status);
                    }
                });
            }
            else{
              // IF already Registered
               callback(true, 0); 
            }
        }
    });
};

// Login Collection
var registerVendor = function (data, callback){
    /** Generating Vendor Id **/
    data.vendor_id = 'shez'+ Math.floor(100000000 + Math.random() * 900000000);
   //data.password
    var encryptPass = crypto.createHash('md5').update("welcome").digest("hex");
    var loginDetails = {
        "email" : data.email, 
        "mobileNo" : data.mobileNo, 
        "password" : encryptPass, 
        "vendor_id" : data.vendor_id,
        "last_login_ts" : "",
        "registration_ts" : new Date(),
        "approved" : false
    }
  /****  Login Collection *****/
  mongodb.get().collection('login').insert(loginDetails, function(err, status){
        if(err){
          callback(true, err);
        }
        else{
          // Register Vendor Details
            registerVendorDetails(data, function(err, status){
                if(err){
                  callback(true, status);
                }
                else{
                  callback(false, status);
                }
            });
        }
  });
};
/*** Vendor Details collection ****/
var registerVendorDetails = function (data, callback){
  var vendorDetails =   { 
        "vendor_id" : data.vendor_id,
        "businessType" : data.type,
        "verification" : {
          "emailVerified" : false,
          "emailVerified_ts" : "",
        },
        "vendorDetails" : {
          "firstName" : data.firstName, 
          "lastName" : data.lastName, 
          "mobileNo" : data.mobileNo, 
          "email" : data.email, 
          "address1" : data.address1, 
          "address2" : data.address2, 
          "city" : data.city, 
          "zipcode" : data.zipcode, 
          "state" : data.state
        },
        "companyInfo" : {
          "companyName" : data.companyName, 
          "establishment" : data.years, 
          "panNo" : data.panNo, 
          "tanNo" : data.panNo, 
          "website" : data.website, 
          "telephone" : data.telephone
        }    
    }
   /** Vendor collection***/
    mongodb.get().collection('vendor_details').insert(vendorDetails, function(err, status){
        if(err){
          callback(true, err);
        }
        else{
          /***  Sending mail to admin ****/          
          var data = {
            from: 'support@shezpower.com',
            to: 'ramprasath25@gmail.com',
            subject: 'New Registration',
            text: 'New Registration came for shezpower. Please activate the vendor using admin panel.'
          };
          mailgun.messages().send(data, function (error, body) {
              callback(false, "Registered Successful");
          });
        }
    });
};
