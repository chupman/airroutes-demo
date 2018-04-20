const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser')
const logger = require('morgan');
const indexRouter = require('./routes/index');
const routesRouter = require('./routes/routes');
const airportRouter = require('./routes/airport');

const config = require('./config');
//const Gremlin = require('gremlin');
//const client = Gremlin.createClient(config.port, config.host, {session: true});
//const gremlin = Gremlin.makeTemplateTag(client);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/routes', routesRouter);
app.use('/airport', airportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
