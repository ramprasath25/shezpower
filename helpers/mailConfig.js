var api_key = 'key-9f75a680645d2e94c8790e5d9f195d0c';
var domain = 'www.shezpower.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = mailgun;