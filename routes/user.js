var express = require('express');
var app = express.Router();
var products = require('../modals/user_productlist');

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'shezpower.com' });
});

app.use('/listProducts', function(req, res){
    products.getList(req.body.cat_id, function(err, products){
      if(err){
        res.json({ "http_code":500, "http_message":"Internal server error"});
      }
      else{
        res.json({ "http_code":200, "http_message":"Ok, Success", products : products });
      }
    });
});

app.use('/productDetails', function(req, res){
  var p_id = parseInt(req.body.p_id)
  products.getDetails(p_id, function(err, details){
    if(err){
      res.json({ "http_code":500, "http_message":"Internal server error"});
    }
    else{
      res.json({ "http_code":200, "http_message":"Ok, Success", Details : details });
    }
  });
});

module.exports = app;
