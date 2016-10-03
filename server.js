var express = require('express');
var app = express();
var http = require('http');
var path  = require('path');
var bodyParser = require('body-parser');
var config = require('./helpers/configuration');
var mongodb = require('./helpers/mongodb');
var fileUpload = require('express-fileupload');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
/** CROS-Request ***/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// Routes to user.js
app.use('/user', require('./routes/user.js'));
app.use('/vendor', require('./routes/vendor.js'));
app.use('/admin', require('./routes/admin.js'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});
//Creating Server
mongodb.connect('mongodb://127.0.0.1:27017/local', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1)
  }
  else {
        app.listen(config.port,function(){
        console.log('Connected to mongodb');
        console.log("Server is running on port : "+config.port);
      });
  }
});
