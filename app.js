var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var session = require('express-session');
mongoose.connect("mongodb://"+ 'admin' +":"+ 'admin' +"@"+ 'ds127129.mlab.com' +":"+ '27129' +"/"+ 'kitchendisplay', function (err, data) {

});
var app = express();
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

require('./controllers/DishesController')(app);
require('./controllers/OrdersController')(app);
/*require('./controllers/banners')(app);
require('./controllers/upload')(app);
require('./controllers/products')(app);
require('./controllers/user')(app);*/
require('./controllers/HomeController')(app);

/*app.get('/*', function(req, res) {
    res.render('index', { title: 'Express' });
    //res.sendFile(req.app.get('views')+"/index.html");
});*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
