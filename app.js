var express = require('express.io');
var path = require('path');
var app = express().http().io();
var http = require('http');

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.session({secret: 'monkey'}));
    app.set('view engine', 'ejs');

    app.set('port', process.env.PORT || 1111);
    app.set('views', path.join(__dirname, 'views'));
    // app.use(express.logger('dev'));      // this line is preventing
                                            // socket.io.js from being served
    app.use(express.methodOverride());
    app.use(app.router);
});

// console.log("io = ", app.io);

// ---- from mongoose section's app.js ----
// app.set('port', process.env.PORT || 1111);
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.logger('dev'));
// app.use(express.methodOverride());
// app.use(app.router);
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var mongoose = require('./config/mongoose');
var routes = require('./config/routes')(app);
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
// ----------------------------------------


app.io.route('order_ice_cream', function(req) {
    console.log('received an event', req.data);
})