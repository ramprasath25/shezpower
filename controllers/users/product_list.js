/*** Product List ***/
var mongodb = require('../../helpers/mongodb');

exports.getProduct = function (data, callback){
if(data.cat_id != 'all'){
    mongodb.get().collection('product_details').find({ cat_id : data.cat_id },{ _id : 0}).toArray( function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
  }
  else{
    mongodb.get().collection('product_details').find().toArray( function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
  }
};
