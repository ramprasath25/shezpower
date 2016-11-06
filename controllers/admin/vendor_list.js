/*** Product List ***/
var mongodb = require('../../helpers/mongodb');
var mailgun = require('../../helpers/mailConfig');

/** Get Vendors list unapproved (newly registered) **/
exports.getList = function (callback){
    mongodb.get().collection('login').find({ "approved" : false }, { "_id" : 0, "password" : 0}).toArray( function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
};

/*** To view details of Vendors ***/
exports.vendorDetails = function(req, callback){
   mongodb.get().collection('vendor_details').findOne({ "vendor_id" : req.vendor_id}, { "_id" : 0}, function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
   });
};

/*** To activate vendors ***/
exports.activate = function(vendorId, callback){
  mongodb.get().collection('login').findOne({"vendor_id" : vendorId}, function(err, details){
    if(err){
      callback(true, err);
    }
    else{
      /*** Update approved ***/
      mongodb.get().collection('login').update(
        { "vendor_id" : vendorId },
        {$set : { "active" : true, "approved" : true }}, function(error, result){
          if(err){
            callback(true, err);
          }
          else{
            sendUserMail(details, function(mErr, mStatus){
              if(mErr){
                callback(true, mStatus);
              }
              else{
                callback(false, mStatus);
              }
            });             
          }
        });
    }
  });   
};

/***  Sending mail to the user ****/       
var sendUserMail = function(details, callback){   
  var data = {
    from: 'support@shezpower.com',
    to: details.email,
    subject: 'Thanks for registering with us.',
    text: 'Please login with registered Email id or Mobile no. Password : welcome'
  };
  mailgun.messages().send(data, function (error, body) {
      callback(false, "Activated Successfully..");
  });
}
