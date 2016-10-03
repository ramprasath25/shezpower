/*** Adding products ***/
var mongodb = require('../../helpers/mongodb');
//Generate Product Id..
function randomValue(len){
  return crypto.randomBytes(Math.cell(len/2)).toString('hex').slice(0, len);
};
exports.createProduct = function (data, callback){  
  data.p_id = 'product'+randomValue(12);
  data.active = false;
  data.approval = false;
  data.updatedTime = new Date();
  insertProduct(data, function(error, status){
      if(error){
        callback(true, status);
      }
      else{
        callback(false, status);
      }
  });
};

function insertProduct (data, callback){
  mongodb.get().collection('product_details').insert(data, function(err, status){
        if(err){
          callback(true, err);
        }
        else{
          callback(false, "product added successful");
        }
      });
};
