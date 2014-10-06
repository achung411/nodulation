var express = require('express.io'),
    path = require('path'),
    http = require('http'),
    app = express().http().io(),
    config = require('./config/mongoose');
// configure environments
app.configure(function(){
 app.set('views', path.join(__dirname, '/public/js/partials/'));
 app.set('view engine', 'ejs');
 app.use(express.favicon());
 app.use(express.logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded());
 app.use(express.bodyParser({ uploaddir: __dirname + '/uploads',
    limit: 4000000,
    keepExtensions: true})); //to allow handling of POST data
 app.use(express.cookieParser()); //to allow session handling
 app.use(express.session({
 	secret: 'monkey',
 	key: 'whynode',
 	cookie: {
 		maxAge: 31*24*60*60*1000 // 31 days, in ms
 	}
 })); //for using sessions
 app.use(express.methodOverride());
 app.use(app.router);
 app.use(express.static(path.join(__dirname, 'public')));
})
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var server = app.listen(1111);

require('./config/routes')(app);
require('./config/events')(app);
console.log("Express server listening on port 1111");