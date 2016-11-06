/**** Users Routes ****/
var express = require('express');
var app = express.Router();
var products = require('../controllers/users/product_list');

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'shezpower.com' });
});
// Product List
app.post('/listProducts', function(req, res){
    products.getList(req.body.category, function(err, products){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error"});
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", "Products" : products });
      }
    });
});
// Product Details
app.post('/productDetails', function(req, res){
  products.getDetails(req.body, function(err, details){
    if(err){
      res.json({ "http_code":500, "http_message":"Internal server error"});
    }
    else{
      res.json({ "http_code":200, "http_message":"Ok, Success", "Details" : details });
    }
  });
});
// Featured List Home page products..
app.post('/featuredProducts', function(req, res){
  products.featuredList(function(err, products){
    if(err){
      res.json({ "http_code":500, "http_message":"Internal server error"});
    }
    else{
      res.json({ "http_code":200, "http_message":"Ok, Success", "Products" : products });
    }
  });
});
module.exports = app;
