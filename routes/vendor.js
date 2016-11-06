/**** Vendors Routes ****/
var express = require('express');
var app = express.Router();
var vendorRegister = require('../controllers/vendors/vendor_reg');
var vendorLogin = require('../controllers/vendors/vendor_login');
var vendorProduct = require('../controllers/vendors/products');

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
          res.json({ "http_code":400, "http_message":"Invalid username/ password" });
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
  vendorLogin.changePass(req.body, function(err, status){
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
  vendorProduct.addProduct(req, function(err, status){
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
  vendorProduct.getProduct(req.body.vendor_id, function(err, products){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error", "message":products });
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "productsList":products });
      }
  });
});

/*** Get Category List ***/
app.post('/getCategoryList', function(req, res){
  vendorProduct.getCategoryList(req.body.type, function(err, list){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error", "message":list });
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "CategoryList":list });
      }
  });
})
/** Getting Product Details **/
app.post('/getProductDetails', function(req, res){
  vendorProduct.productDetails(req.body, function(err, details){
    if(err){
        res.json({ "http_code":500, "http_message":"Internal server error", "message":details });
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "Detail":details });
      }
  });
});

module.exports = app;
