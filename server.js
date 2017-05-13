var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var _ = require("underscore");
var os = require('os');
var http = require('http');
var salesUtil = require('./app/Utils/SalesUtils.js');
var printer = require("node-thermal-printer");
var exec = require('child_process').exec;

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
var usersRouter = require('./app/routes/users')(app, express, __dirname);
var productsRouter = require('./app/routes/products')(app, express, _);
var salesRouter = require('./app/routes/sales')(app, express, _, exec);
var clientRouter = require('./app/routes/clients')(app, express, _);
var creditRouter = require('./app/routes/credits')(app, express, _, salesUtil);
var devChangProd = require('./app/routes/devChangProd')(app, express, _);
var providerRouter = require('./app/routes/providers')(app, express, _);
var paymentRouter = require('./app/routes/payments')(app, express, _);

/*app.use('/public',function(req,res){
    //res.sendfile(express.static(path.join(__dirname, '/public/app/jsapp/custome')));
    console.log(__dirname + '/public/app/views/index.html  test');
    res.sendFile(path.join(__dirname + '/public'));
  //res.sendFile(__dirname + '/public');
  //__dirname : It will resolve to your project folder.
});*/
app.use('/public', express.static(__dirname + '/public'));
app.use('/api', usersRouter);
app.use('/api', productsRouter);
app.use('/api', usersTypeCatalogRouter);
app.use('/api', salesRouter);
app.use('/api', clientRouter);
app.use('/api', creditRouter);
app.use('/api', devChangProd);
app.use('/api', providerRouter);
app.use('/api', paymentRouter);

//Start

/*var openConnections = [];
console.log("Aqui1");
app.get('/stats', function(req, res) {
 
    // set timeout as high as possible
    
    console.log("Aqui2");
    console.log(Infinity);
    req.socket.setTimeout(100);
    console.log("Aqui3");
    console.log(Infinity);
 
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
 
    // push this res object to our global variable
    openConnections.push(res);
 
    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j] == res) {
                toRemove =j;
                break;
            }
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
});
 
setInterval(function() {
    // we walk through each connection
    openConnections.forEach(function(resp) {
        var d = new Date();
        resp.write('id: ' + d.getMilliseconds() + '\n');
        resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
    });
 
}, 1000);
 
function createMsg() {
    msg = {};
 
    msg.hostname = os.hostname();
    msg.type = os.type();
    msg.platform = os.platform();
    msg.arch = os.arch();
    msg.release = os.release();
    msg.uptime = os.constants().sigio;
    msg.loadaverage = os.cpus()[0].times.user;//os.loadavg();
    msg.totalmem = os.totalmem();
    msg.freemem = os.freemem();
    msg.cpus = os.cpus()[0].times.user;
 
    console.log(JSON.stringify(msg));
    return JSON.stringify(msg);
}*/

//End

app.get('*', function(req, res){
    console.log(__dirname + '/public/app/views/index.html');
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
console.log('Magic happens on port ' + config.port);