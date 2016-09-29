/*** Product List ***/
var mongodb = require('../../helpers/mongodb');

exports.getList = function (callback){
    mongodb.get().collection('login').find({ active : false },{ _id : 0, password : 0}).toArray( function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
};

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
