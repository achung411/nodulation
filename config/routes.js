var mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function Route(app) {

	app.get('/', function(req, res) {
  		res.render('welcome', { title: 'Welcome' });
  	})
  	app.get('/welcome', function(req, res) {
  		if (typeof req.session.notice !== "undefined") {
  			var notice = req.session.notice;
  			delete req.session.notice;
  		}
  		else if (typeof req.session.error !== "undefined") {
  			var error = req.session.error;
  			delete req.session.error;
  		};
  		res.render('welcome', { title: 'Welcome', notice: notice, error: error });
	});
	app.get('/register', function(req, res) {
		res.render('register', { title: 'Registration'});
	});
	app.get('/main', function(req, res) {
		if (typeof req.session.logged_user_id !== "undefined") {
			res.render('main', { title: 'Main', session_info: req.session });
		}
		else {
			req.session.notice = "Please log in.";
			req.session.save(function() {
				res.redirect('/welcome');
			})
		}
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
		var mail = req.body.user.email;
		var pwd = req.body.user.password;
		// console.log("searching for: " + email + " @ " + pwd);
		User.find({email: mail, password: pwd}, function(err, results) {
			if (results.length == 0) {
				req.session.error = "There is no user registered with that email and password.";
				req.session.save(function() {
					res.redirect('/welcome');
				})
			}
			else {
				// the results are returned in an array of objects
				var data = results[0];
				req.session.first_name = data.first_name;
				req.session.last_name = data.last_name;
				req.session.logged_user_id = data._id;
				req.session.sessionID = req.sessionID;
				req.session.save(function() {
					res.redirect('/main');
				})
				// res.send(results);
			};
		});
	});
	app.get('/signout', function(req, res) {
		req.session.destroy(function() {
			res.redirect('/welcome');
		});
	});



	app.get('/test', function(req, res) {		// for debugging purposes... i can
		User.find({}, function(err, results) {  // view all users in the database
			res.send(results);					// with this api call
		});
	});
};