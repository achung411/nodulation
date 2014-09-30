// var mongoose = require('mongoose'),
// 	fs = require('fs'),
	// User = mongoose.model('User'),
	// users = require('./../server/controllers/users.js');

var users = require('./../server/controllers/users.js');

module.exports = function Route(app) {

	app.get('/', function (req, res) { users.intro(req, res) });
	app.get('/index', function (req, res) { users.index(req, res) });
	app.post('/pictures/create', function (req, res) { users.create_picture(req, res) } );
	app.post('/covers/create', function (req, res) { users.create_cover(req, res) } );
	app.get("/signout", function (req, res) { users.signout(req, res) });
// ------------------- for debugging purposes ---------------
	app.get('/test', function(req, res) { users.test(req, res) });
};