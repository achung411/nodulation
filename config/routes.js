var mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function Route(app) {

	app.get('/', function(req, res) {
  		res.render('welcome', { title: 'Welcome' });
  	})
  	app.get('/welcome', function(req, res) {
  		res.render('welcome', { title: 'Welcome'});
	});
	app.get('/register', function(req, res) {
		res.render('register', { title: 'Registration'});
	});
	app.get('/main', function(req, res) {
		res.render('main', { title: 'Main'});
	});
	app.post('/users/create', function(req, res) {
		// post data usually in req.body; here, post data was submitted inside
		// a user array
		var a = new User(req.body.user);
		a.save(function(err, a) {
			console.log(err, a);
			return res.redirect('/welcome');
		});
	});
	app.post('/sessions/create', function(req, res) {
		var email = req.body.user['email'];
		var pwd = req.body.user['password'];
		console.log("looking for " + email + " @ " + pwd);
		User.find({email: email, password: pwd}, function(err, results){
			var package = JSON.stringify(results);
			console.log("user: " + package);
		});
	});


// for testing purposes...  easy to check if mongo's working
	app.get('/test', function(req, res) {
		User.find({}, function(err, results) {
			res.send(results);
		});
	});

};