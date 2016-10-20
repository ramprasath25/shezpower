/*** Product List ***/
var mongodb = require('../../helpers/mongodb');

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
   mongodb.get().collection('login').update(
    { vendorId : vendorId },
    {$set : { active : true }}, function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
};
