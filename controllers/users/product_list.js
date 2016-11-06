/*** Product List ***/
var mongodb = require('../../helpers/mongodb');
/** Getting product list for users **/
exports.getList = function (category, callback){
    mongodb.get().collection('product_details').find(
            { "sub_category" : category, "active" : true },
            { "_id" : 0, "p_id" : 1, "vendor_id" : 1, "title" : 1,
            "short_description" : 1, "images.thumbnail_img" : 1,
            "priceDetails" : 1, "unitOfMeasurement" : 1}).toArray( function(err, result){
      if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
    });
};

/*** Getting product Details ***/
exports.getDetails = function(req, callback){
  mongodb.get().collection('product_details').findOne({"p_id" : req.p_id, "active" : true}, {"_id" : 0}, function(err, result){
    if(err){
        callback(true, err);
      }
      else{
        callback(false, result);
      }
  });
};
/*** Featured product list ***/
exports.featuredList = function(callback){
  
}