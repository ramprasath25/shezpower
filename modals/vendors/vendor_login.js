/*** Vendor Login ***/
var mongodb = require('../../helpers/mongodb');
var crypto = require('crypto');

exports.login = function (data, callback){
      mongodb.get().collection('login').findOne(          
          { $and : [{active : true},
            { $or : [{email : data.email },
            { mobileNo : data.mobileNo }]}
            ]},
       function(err, result){
          if(err){
            callback(true, err);
          }
          else{
              if(result === null){
                callback(true, 0);
              }
              else{
                // Check for the password
                loginCheck(data, result, function(error, status){
                    if(error){
                      callback(true, status);
                    }
                    else{
                      callback(false, status);
                    }
                });
              }
          }
      });
};

function loginCheck(data, result, callback){
  console.log(result.password);
  var encyptPass = crypto.createHash('md5').update(data.password).digest("hex");
  console.log(encyptPass);
  if(result.password == encyptPass){
    delete result["_id"];
    delete result["password"];
    callback(false, result);
  }
  else{
    callback(true, "Password doesnot match");
  }
};
