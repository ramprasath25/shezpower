var express = require('express');
var app = express.Router();
var vendorList = require('../modals/admin/vendor_list');

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'shezpower.com Admin' });
});

/*** Vendor Activation List ***/
app.get('/activationList', function(req, res){
    vendorList.getList(function(err, list){
        if(err){            
                res.status(500).json({ "status": 500, "http_message":"Internal server error" });            
        }
        else{
            //res.render('list', { list : list });
            res.status(200).json({ "status": 200, "VendorList" : list });
        }
    });
});

/*** Activate Vendor ***/
app.post('/activateVendor', function(req, res){
  vendorList.activate(req.body.vendorId, function(err, status){
        if(err){            
            res.status(500).json({ "status": 500, "http_message":"Internal server error" });            
        }
        else{           
            res.status(200).json({ "status": 200, "message" : "Ok, Successful." });
        }
  });
});

module.exports = app;