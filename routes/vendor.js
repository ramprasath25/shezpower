/**** Vendors Routes ****/
var express = require('express');
var app = express.Router();
var vendorRegister = require('../controllers/vendors/vendor_reg');
var vendorLogin = require('../controllers/vendors/vendor_login');
var product = require('../controllers/vendors/add_product');
var productList = require('../controllers/users/product_list');
var vendorPass = require('../controllers/vendors/vendor_pass');

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'shezpower.com vendor' });
});

/*** Vendor Register ***/
app.post('/register', function(req, res){
    vendorRegister.register(req.body, function(err, status){
        if(err){
            if(status == 0){
                res.status(202).json({ "status": 202, "http_message" : "Mobile no or mail id already registered" });
            }
            else{
                res.status(500).json({ "status": 500, "http_message":"Internal server error" });
            }
        }
        else{         
          res.status(200).json({ "status": 200, "http_message" : status });
        }
    });
});

/** Vendor Login **/
app.post('/login', function(req, res){
  vendorLogin.login(req.body, function(err, status){
      if(err){
        if(status == 0){
          res.json({ "http_code":400, "http_message":"Mobile no or mail id not registered" });
        }
        else{
            res.json({ "http_code":500, "http_message":"Internal server error", "message":status });
        }
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", details:status });
      }
  });
});

/** Change Password **/
app.post('/changePassword', function(req, res){
  vendorPass.changePass(req.body, function(err, status){
    if(err){
        res.status(500).json({ "http_code":500, "http_message":"Internal server error", "message":status });
      }
      else{
        res.status(200).json({ "http_code":200, "http_message":"Ok, Success" });
      }
  });
});

/** Adding Product **/
app.post('/addProduct', function(req, res){
  product.createProduct(req.body, function(err, status){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error", "message":status });
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "message":status });
      }
  });
});

/** Getting Product List **/
app.post('/getProductList', function(req, res){
  productList.getProduct(req.body, function(err, products){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error", "message":products });
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "Products":products });
      }
  });
});

app.post('/upload', function(req, res) {
    
    var file = req.files.detail_img;
    var filepath= './Images/'+ file.name;
    file.mv(filepath, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
    // if (!req.files) {
    //     res.send('No files were uploaded.');
    //     return;
    // }    
});
module.exports = app;
