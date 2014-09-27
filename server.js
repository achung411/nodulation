var fs = require('fs'),
    express = require('express.io'),
    path = require('path'),
    http = require('http'),
    app = express().http().io();

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.bodyParser({ uploaddir: __dirname + '/uploads',
        limit: 4000000,
        keepExtensions: true}))
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.session({secret: 'monkey'}));
    app.set('view engine', 'ejs');
    app.set('port', process.env.PORT || 1111);
    app.set('views', path.join(__dirname, 'public/partials'));
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);
});

var mongoose = require('./config/mongoose');
var routes = require('./config/routes')(app);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.listen(1111);
console.log('Express server listening on port ' + app.get('port'));