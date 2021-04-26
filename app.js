const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const logger = require('./lib/logger').createLogger('app');
const path = require('path');

// configure Express
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// configure logging
app.use(morgan(process.env.MORGAN_FORMAT || 'short'));

// configure Handlebars
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  defaultLayout: 'main'
}));

// used by CSRF token processing
app.use(cookieParser());

// website

app.use(`/`, require('./website'));

// error handling

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  res.status(status);
  const message = status < 500 ? err.message : 'Something unexpected happened';

  if (status /*>= 500*/) {
    logger.error(err);
  }

  res.render('error', {
    layout: 'vanilla',
    title: 'Error',
    error_status: status || 'ERROR',
    message,
  });
});

module.exports = app;
