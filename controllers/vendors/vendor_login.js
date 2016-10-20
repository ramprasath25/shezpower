/*** Vendor Login ***/
var mongodb = require('../../helpers/mongodb');
var crypto = require('crypto');

/** Vendor Login ***/
exports.login = function (data, callback){
      var encyptPass = crypto.createHash('md5').update(data.password).digest("hex");
      mongodb.get().collection('login').findOne( {$and : [{ "password": encyptPass },
        { $or: [ { "email": data.username }, { "mobileNo": data.username } ] }, {"approved" : true }]},
        { "_id": 0, "vendor_id" : 1, "last_login_ts" : 1 },
       function(err, result){
          if(err){
            callback(true, err);
          }
          else{            
              if(result === null){
                callback(true, 0);
              }
              else{
                /// Getting Vendor Details...
                getDetails(result, function(error, details){
                  if(error){
                    callback(true, details);
                  }
                  else{
                    callback(false, details);
                  }
                });                
              }
          }
      });
};
// Getting Vendor Details..
function getDetails(data, callback){  
  mongodb.get().collection('vendor_details').findOne({ "vendor_id" : data.vendor_id }, { "_id" : 0 , "companyInfo" : 0}, function(err, result){
    if(err){
      callback(true, err);
    }
    else{
      result.lastLogin = data.last_login_ts;
      /**** Update Lastlogin with new date ****/
      mongodb.get().collection('login').update({ "vendor_id" : data.vendor_id }, 
        {$set : { "last_login_ts" : new Date() }}, function(error, status){
            if(error){
              callback(true, status);
            }
            else{
              callback(false, result);
            }
        });      
    }
  });  
};

/*** Change vendor Password ***/
exports.changePass = function(req, callback){
  var encyptPass = crypto.createHash('md5').update(req.password).digest("hex");
  var coll = mongodb.get().collection('login');
  coll.update({"vendor_id" : req.vendor_id}, {$set : {"password" : encyptPass}}, function(err, status){
      if(err){
        callback(true, result);
      }
      else{
        console.log(status.result)
        if(status.result.nModified === 0){
          callback(true, "Vendor Id doesnot exists...");
        }
        else{
          callback(false, "Password updated successful");
        }
      }
  });
}
