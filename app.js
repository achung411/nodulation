var express = require('express.io');
var path = require('path');
var app = express().http().io();

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.session({secret: 'monkey'}));
    app.set('view engine', 'ejs');
});


app.io.route('order_ice_cream', function(req) {
    console.log('received an event', req.data);
})







var routes = require('./routes/index')(app);
app.listen(1111);
console.log('Server running on port: 1111');