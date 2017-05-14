var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var index = require('./routes/index');
var content = require('./routes/content');
var register=require('./routes/register');
var sendEmail=require('./toclient/SendEmail');
var registHelper=require('./dao/RegistHelper');
var url=require('url')
var http=require('http');
var server=http.createServer(app);
var io=require('socket.io').listen(server);
server.listen(process.env.PORT||4000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use('/', index);
app.use('/content', content);
app.use('/register',register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.sockets.on('connection',function (socket) {
   socket.on('getcheck',function (address) {
     console.log("getcheck",address);
     var randomnum=parseInt(Math.random()*8999+1000);
     registHelper.insertToRegisterTable(address,randomnum);
     sendEmail('app注册验证码','您的注册验证码为：'+randomnum+'   请妥善保管谨防泄露',address);
   });
   socket.on('register',function (address, pwd, check) {

   })
});


module.exports = app;
