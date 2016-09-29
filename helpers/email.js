var nodemailer = require("nodemailer");
exports.sendEmail = function(emailBody, callback){  
  var smtpTransport = nodemailer.createTransport("SMTP",{
     service: "Gmail",  // sets automatically host, port and connection security settings
     auth: {
         user: "shezdiva2@gmail.com",
         pass: "shezpower"
     }
  });

  smtpTransport.sendMail({  //email options
     from: "support@shezpower.com",
     to: "ramprasath25@gmail.com",
     //to: "sng.rch@gmail.com", // receiver
     subject: "New Registration - shezpower", // subject
     text: emailBody // body
  }, function(error, response){  //callback
     if(error){  
         callback(true, error);
     }else{
         callback(false, response.message);
     }   
     //smtpTransport.close(); 
   });
}