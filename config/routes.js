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
};