var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var _ = require("underscore");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
    next();
});

app.use(morgan('dev'));
mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

var usersTypeCatalogRouter = require('./app/routes/catalogs')(app, express);
var usersRouter = require('./app/routes/users')(app, express);
var productsRouter = require('./app/routes/products')(app, express, _);
var salesRouter = require('./app/routes/sales')(app, express, _);
var clientRouter = require('./app/routes/clients')(app, express, _);
var creditRouter = require('./app/routes/credits')(app, express, _);
var devChangProd = require('./app/routes/devChangProd')(app, express, _);
var providerRouter = require('./app/routes/providers')(app, express, _);

app.use('/api', usersRouter);
app.use('/api', productsRouter);
app.use('/api', usersTypeCatalogRouter);
app.use('/api', salesRouter);
app.use('/api', clientRouter);
app.use('/api', creditRouter);
app.use('/api', devChangProd);
app.use('/api', providerRouter);

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
console.log('Magic happens on port ' + config.port);