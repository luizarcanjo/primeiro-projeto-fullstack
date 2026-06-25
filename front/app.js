// App principal do frontend - [Seu Nome]
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importar rotas - [Seu Nome]
var indexRouter = require('./routes/index');
var customersRouter = require('./routes/customers');
var petsRouter = require('./routes/pets');
var servicosRouter = require('./routes/servicos');
var agendamentosRouter = require('./routes/agendamentos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Registrar rotas - [Seu Nome]
app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/pets', petsRouter);
app.use('/servicos', servicosRouter);
app.use('/agendamentos', agendamentosRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;