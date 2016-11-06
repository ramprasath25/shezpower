/*** Adding products ***/
var mongodb = require('../../helpers/mongodb');
var fs = require('file-system');
var async = require('async');

exports.addProduct = function (data, callback){ 
   // Generate Product ID...
  var productId = 'pro'+ Math.floor(100000000 + Math.random() * 900000000);
      // Creating Doc to insert
      var doc = {   
              "p_id" : productId, 
              "vendor_id" : data.body.vendor_id,
              "category" : data.body.category,
              "sub_category" : data.body.sub_category,
              "title" : data.body.title,
              "short_description" : data.body.short_description, 
              "description" : data.body.description,     
              "images" : {
                    "thumbnail_img" : "", 
                    "detail_img" : ""
              },
              "priceDetails" : {
                "marketPrice" : data.body.marketPrice,
                "discountPrice" : data.body.discountPrice,
                "discount" : data.body.discount,
                "discountEndDate" : data.body.discountEndDate,
                "currency" : data.body.currency
              },     
              "unitOfMeasurement" : data.body.unitOfMeasurement,
              "specification" : {
                
              },
              "stocksLeft" : data.body.stocksLeft,
              "shippingDetail" : data.body.shippingDetail,
              "active" : true,
              "created_ts" : new Date(), 
              "updated_ts" : ""
            }
  /// Async series..
  async.series([
    function(dirCallback){
      // Creating Directory to Image upload
      createDirectory(data.body.vendor_id, function(err){
        if(err){
          dirCallback(true);
        }
        else{
          dirCallback(false);
        }
      });
    },
    function(detailImgCallback){
      var detail_img = data.files.detail_img;
      var detailFilepath = 'Images/'+ data.body.vendor_id +'/'+ detail_img.name;
      ///Moving Product detail Image
      detail_img.mv(detailFilepath, function(err) {
          if(err){
            detailImgCallback(true);
          }
          else{
            doc.images.detail_img = detailFilepath;
            detailImgCallback(false);
          }
      });
    },
    function(thumbImgCallback){
      var thumbnail_img = data.files.thumbnail_img;  
      var thumbnailFilepath = 'Images/'+ data.body.vendor_id +'/'+ thumbnail_img.name;  
      //Moving Thumbnail Image
      thumbnail_img.mv(thumbnailFilepath, function(err) {
          if(err){
            thumbImgCallback(true);
          }
          else{
            doc.images.thumbnail_img = thumbnailFilepath;
            thumbImgCallback(false);
          }
      });
    },
    function(insertCallback){     
      ///Inserting the Product document into Mongodb
      insertProduct(doc, function(error){
        if(error){
          insertCallback(true);
        }
        else{
          insertCallback(false);
        }
      });
    }
    ], function(err){
        if(err){
          callback(true, "Error.. please try later..");
        }
        else{
          callback(false, "Added successful");
        }
    });      
};
/// Creating Directory under Image folder
function createDirectory (dirName, callback){
  //Check whether Directory exists
  fs.exists('Images'+dirName, function(e, status){
      if(e){
        callback(true);
      }
      else{
        // Make directory with the Vendor id...
        fs.mkdir('Images/'+dirName, function(err, result){
            if(err){
              callback(true);
            }
            else{
              callback(false);
            }
        });
      }
  });
};

// Insert function to insert product details
function insertProduct (data, callback){
  mongodb.get().collection('product_details').insert(data, function(err, status){
        if(err){
          callback(true);
        }
        else{
          callback(false);
        }
    });
};

/*** Get Product list for Vendor ****/
exports.getProduct = function(vendor_id, callback){
  mongodb.get().collection('product_details').find(
              {"vendor_id" : vendor_id},
              {"_id" : 0, "title": 1, "p_id" : 1,
              "stocksLeft" : 1, "active" : 1}).toArray(function(err, result){
                    if(err){
                      callback(true, result);
                    }
                    else{
                      callback(false, result);
                    }
              });
}
/*** Get Product Details ****/
exports.productDetails = function(req, callback){
  mongodb.get().collection('product_details').findOne(
              {"vendor_id" : req.vendor_id, "p_id" : req.p_id},
              {"_id" : 0}, function(err, result){
                    if(err){
                      callback(true, result);
                    }
                    else{
                      callback(false, result);
                    }
              });
};
/*** Get Category List ***/
exports.getCategoryList = function(req, callback){
  mongodb.get().collection('menu_category').find({"category" : req, "active" : true},{ "active" : 0}).toArray(function(err, result){
      if(err){
        callback(true, result);
      }
      else{
        callback(false, result);
      }
  })
}

