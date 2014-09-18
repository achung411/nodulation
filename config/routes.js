var mongoose = require('mongoose'),
	fs = require('fs'),
	User = mongoose.model('User');

module.exports = function Route(app) {

	app.get('/', function(req, res) {
  		res.render('intro', { title: 'Welcome' });
  	});
  	app.get('/index', function(req, res) {
  		res.render('index', { title: 'Nodular', me: req.session.current_user });
  	});
 //  	app.get('/welcome', function(req, res) {
 //  		if (typeof req.session.notice !== "undefined") {
 //  			var notice = req.session.notice;
 //  			delete req.session.notice;
 //  		}
 //  		else if (typeof req.session.error !== "undefined") {
 //  			var error = req.session.error;
 //  			delete req.session.error;
 //  		};
 //  		res.render('welcome', { title: 'Welcome', notice: notice, error: error });
	// });
	// app.get('/register', function(req, res) {
	// 	res.render('register', { title: 'Registration'});
	// });
	// app.get('/main', function(req, res) {
	// 	if (typeof req.session.current_user !== "undefined") {
	// 		// console.log('req.session.current_user: ', req.session.current_user);
	// 		res.render('main', { title: 'Main', me: req.session.current_user });
	// 	}
	// 	else {
	// 		req.session.notice = "Please log in.";
	// 		req.session.save(function() {
	// 			res.redirect('/welcome');
	// 		})
	// 	};
	// });
	// app.get('/home', function(req, res) {
	// 	res.render('main', { title: 'Main', me: req.session.current_user });
	// });
	// app.get('/profile', function(req, res) {
	// 	res.render('profile', { title: 'Profile', user: req.session.current_user });
	// });
	// app.get('/myprofile', function(req, res) {
	// 	res.render('profile', { title: 'Profile', user: req.session.current_user });
	// });
	// app.get('/settings', function(req, res) {
	// 	if (typeof req.session.current_user !== "undefined") {
	// 		res.render('settings', { title: 'User Account Settings', me: req.session.current_user });
	// 	}
	// 	else {
	// 		req.session.notice = "Please log in.";
	// 		res.render('welcome', { title: 'Welcome' });
	// 	}
	// });
	app.post('/users/create', function(req, res) {
		// post data usually in req.body; here, post data was submitted inside
		// a user array
		var a = new User(req.body.user);
		a.save(function(err, a) {
			console.log(err, a);
			return res.redirect('/index');
		});
	});
	app.post('/users/edit', function(req, res) {
		var newInfo = req.body;
		User.findOne({_id: req.session.current_user._id }, 
					// {$set: {hometown: newInfo.hometown} }, 
					function(err, result) {
						if (err) {
							// return handleError(err);
							console.log("Houston, we've got a problem.");
						}
						else {
							result.first_name = newInfo.first_name;
							result.last_name = newInfo.last_name;
							result.work = newInfo.work;
							result.hometown = newInfo.hometown;
							result.updated_at = new Date();
							result.save(function(err) {
								if (err) {
									console.log("Mo problems: ", err);
								}
								else {
									return res.redirect('/settings');
								}
							});
						}
		});
	});
	app.post('/sessions/create', function(req, res) {
		var mail = req.body.user.email;
		var pwd = req.body.user.password;
		User.find({email: mail, password: pwd}, function(err, results) {
			if (results.length == 0) {
				req.session.error = "There is no user registered with that email and password.";
				req.session.save(function() {
					res.redirect('/intro');
				})
			}
			else {
				var data = results[0];		// the results are returned in an array of objects
				req.session.current_user = results[0];
				req.session.save(function() {
					res.redirect('/index');
				})
			};
		});
	});
	app.post('/pictures/create', function(req, res, next) {
		var tmp_path = req.files.picture.path;
		var target_path = './public/images/pics/' + req.files.picture.name;
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			fs.unlink(tmp_path, function() {
				if (err) {
					throw err;
				}
				else {
					User.findOne({_id: req.session.current_user._id }, 
						function(err, result) {
							if (err) {
								return handleError(err);
							}
							else {
								result.pic = '/images/pics/' + req.files.picture.name;
								result.updated_at = new Date();
								result.save(function(err) {
									if (err) {
										return handleError(err);
									}
									else {
										return res.redirect('/settings');
									}
								});
							}
					})
				}
			})
		});
	});
	app.post('/covers/create', function(req, res, next) {
		var tmp_path = req.files.cover.path;
		var target_path = './public/images/pics/' + req.files.cover.name;
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			fs.unlink(tmp_path, function() {
				if (err) {
					throw err;
				}
				else {
					User.findOne({_id: req.session.current_user._id }, 
						function(err, result) {
							if (err) {
								return handleError(err);
							}
							else {
								result.cover = '/images/pics/' + req.files.cover.name;
								result.updated_at = new Date();
								result.save(function(err) {
									if (err) {
										return handleError(err);
									}
									else {
										return res.redirect('/settings');
									}
								});
							}
					})
				}
			})
		});
	});
	app.post('/statuses/create', function(req, res) {
		User.findOne({_id: req.session.current_user._id },
			function(err, result) {
				if (err) {
					return handleError(err);
				}
				else {
					// console.log("New status: ", req.body.new_status);
					result.status = req.body.new_status;
					result.save(function(err) {
						if (err) {
							return handleError(err);
						}
						else {
							return res.redirect('/main');
						}
					})
				}
			})
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