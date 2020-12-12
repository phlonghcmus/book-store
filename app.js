const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');

const flash = require('connect-flash');
const session = require("express-session"),
  bodyParser = require("body-parser");

const passport = require('./middleware/passport/passport');
// Routes variables
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

// Api routes variables
const userApiRouter = require('./routes/api/users');
const app = express();
require('./database/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/')));

// Login

app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
  res.locals.user=req.user;
  next();
})
//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);


//api routes
app.use('/api/users', userApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const paginate = require('handlebars-paginate');

hbs.handlebars.registerHelper('paginate', paginate);
hbs.registerHelper('json', function (context) {
  return JSON.stringify(context);
});
module.exports = app;
