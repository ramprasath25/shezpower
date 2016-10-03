/*** Product List ***/
var mongodb = require('../../helpers/mongodb');


exports.getList = function (cat_id, callback){
  var query  =  [];
    mongodb.get().collection('product_details').find({$and :[{ cat_id : cat_id	},{"active":true},{"approval":true}]},{
      "_id":0,
      "category":0,
      "sub_category":0,
      "specs":0,
      "updatedTime":0,
      "active":0,
      "approval":0
    }).toArray(function(err, result){
      if(err){
        console.log(err);
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
};
exports.getDetails = function (p_id, callback){  
  mongodb.get().collection('product_details').find({ p_id : p_id },{ _id : 0}).toArray( function(err, result){
    if(err){
      callback(true, err);
    }
    else{
      callback(false, result);
    }
  });
};
