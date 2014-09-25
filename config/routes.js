var mongoose = require('mongoose'),
	fs = require('fs'),
	User = mongoose.model('User');
	// session_data = {};

module.exports = function Route(app) {

	app.get('/', function(req, res) {
  		res.render('intro', { title: 'Welcome' });
  	});
  	app.get('/index', function(req, res) {
  		if (typeof req.session.current_user !== "undefined") {
  			res.render('index', { title: 'Nodular', me: req.session.current_user });
  		}
  		else {
  			res.redirect('/');
  		};
  	});

	// app.get('/myprofile', function(req, res) {
	// 	res.render('profile', { title: 'Profile', user: req.session.current_user });
	// });

	app.io.route('/users/create', function(req) {
		var new_user = req.data;
		var email_address = req.data.email;
		User.find({email: email_address}, function(err, results) {
			if (results.length > 0) {
				req.io.emit('registration_error', {reg_error: "There is already an account with that email."});
			}
			else {
				var a = new User(new_user);
				a.save(function(err, a) {
					if (err) {
						console.log("There was an error trying to register this new user: ", err);
					}
					else {
						req.io.emit('notice', {msg: "You have successfully registered.  Please sign in."});
					}
				});
			}
		});
	});
	app.io.route('/sessions/create', function(req) {
	    var mail = req.data.email;
	    var pwd = req.data.password;
	    User.find({email: mail, password: pwd}, function(err, results) {
	        if (results.length == 0) {
	            req.io.emit('error', {error_msg: "There is no user registered with that email and password."});
	        }
	        else {
	        	var found_user = results[0];
	            req.session.current_user = found_user;
	            req.session.sessionID = req.sessionID;
	            req.session.save(function() {
	                // session_data[req.session.sessionID] = found_user;
	                req.io.emit('user_authenticated');
	            });
	        };
	    });
	});
	app.io.route("initialize_connection", function(req) {
		var current_id = req.session.current_user._id;

		User.find({_id: current_id}, function (err, results) {
			var my_record = results[0];
			User
			.find({})
			.where('_id')
			.nin([my_record._id])
			.select("first_name last_name pic")
			.exec(function(err, result) {
				if (err) return handleError(err);
				req.io.emit("initializing", {my_record: my_record, other_users: result});
			});
		});
	});
	app.io.route("/users/edit", function (req, res) {
		var newInfo = req.data;
		User.findOne({_id: req.session.current_user._id }, 
					function(err, result) {
						if (err) {
							req.io.emit('incoming_error', err);
						}
						else {
							result.first_name = newInfo.first_name;
							result.last_name = newInfo.last_name;
							result.work = newInfo.work;
							result.hometown = newInfo.hometown;
							result.updated_at = new Date();
							result.save(function(err) {
								if (err) {
									req.io.emit('incoming_error', err);
								}
								else {
									req.io.emit('incoming_msg', "You have successfully updated your profile information.");
								}
							});
						}
		});
	});
	app.post('/pictures/create', function (req, res, next) {
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
										return res.redirect('/index');
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
										return res.redirect('/index');
									}
								});
							}
						}
					)
				}
			})
		});
	});
	app.io.route("/statuses/create", function(req) {
		User.findOne({_id: req.session.current_user._id },
			function(err, result) {
				if (err) {
					return handleError(err);
				}
				else {
					result.status = req.data;
					result.save(function(err) {
						if (err) {
							return handleError(err);
						}
						else {
							req.io.emit("status_updated", {status: req.data});
						}
					});
				}
			}
		);
	});
	app.get("/signout", function (req, res) {
		var target_id = req.session.sessionID;
		req.session.destroy(function() {
			// delete session_data[target_id];
			res.redirect('/');
		});
	});

// ------------------- for debugging purposes ---------------
	app.get('/test', function(req, res) {		// this api call displays 
		User.find({}, function(err, results) {  // all users in the database
			res.send(results);					
		});
	});
	// app.get('/session', function(req, res) {	// this api call displays the
	// 	res.send(session_data);				// server's saved session data
	// });
};