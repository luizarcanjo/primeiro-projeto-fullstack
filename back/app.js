// App principal do backend - [Seu Nome]
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var app = express();

// CORS - [Seu Nome]
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Importar rotas - [Seu Nome]
var indexRouter = require('./routes/index');
var customersRouter = require('./routes/customers');
var petsRouter = require('./routes/pets');
var authRouter = require('./routes/auth');
var servicosRouter = require('./routes/servicos');
var agendamentosRouter = require('./routes/agendamentos');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Registrar rotas - [Seu Nome]
app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/pets', petsRouter);
app.use('/auth', authRouter);
app.use('/servicos', servicosRouter);
app.use('/agendamentos', agendamentosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({erro:'not found'});
});

module.exports = app;