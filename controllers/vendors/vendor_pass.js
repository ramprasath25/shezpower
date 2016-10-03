/*** Vendor Login ***/
var mongodb = require('../../helpers/mongodb');
var crypto = require('crypto');

exports.changePass = function (data, callback){
      var encyptPass = crypto.createHash('md5').update(data.password).digest("hex");
      mongodb.get().collection('login').update(
        { vendorId : data.vendorId },
        {$set : { password : encyptPass }}, function(err, result){
            if(err){
              callback(true, err);
            }
            else{
              callback(false, result);
            }
        });
};
