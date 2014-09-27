var mongoose = require('mongoose'),
	fs = require('fs'),
	User = mongoose.model('User');

module.exports = function Route(app) {

	function isInArray (value, array) {
		return array.indexOf(value) > -1;
	};

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
		if (typeof req.session.current_user == "undefined") {
			req.io.emit("reset");
		}
		else {
			var current_id = req.session.current_user._id;

			User
			.find({_id: current_id})
			.select("first_name last_name email hometown work pic cover status friends")
			.exec(function (err, results) {
				if (err) {
					return handleError(err);
				}
				else {
					var my_record = results[0];		// refreshes user settings

					User 							// gets other users in db
					.find({})
					.where('_id')
					.nin([my_record._id])
					.select("first_name last_name pic")
					.exec(function (err, result) {
						if (err) {
							return handleError(err);
						}
						else {
							req.io.emit("initializing", {my_record: my_record, other_users: result});
							var my_friends = my_record.friends;
							var numfriends = my_record.friends.length;
							for (var i=0; i < numfriends; i++) {
								User
								.find({_id: my_friends[i]})
								.select("first_name last_name pic")
								.exec(function (err, returned_info) {
									if (err) {
										return handleError(err);
									}
									else {
										req.io.emit("friend_packet", returned_info[0]);
									}
								});
							};
						}
					});
				}
			});
		}
	});
	app.io.route("initialize_visit", function(req) {
		if (typeof req.session.current_user == "undefined") {
			res.redirect('/');
		}
		else {
			var current_id = req.session.current_user._id;
			var visitee_id = req.data;

			User.find({_id: current_id}, function (err, results) {
				var my_record = results[0];						// refreshes user settings
				User.find({_id: visitee_id}, function (err, results) {	// gets visitor settings
					if (err) return handleError(err);
					var visitee_record = results[0];
					req.io.emit("visit_approved", {my_record: my_record, visitee_record: visitee_record});
				});
			});
		}
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
									req.io.emit('incoming_msg', "Your profile has been updated.");
								}
							});
						}
		});
	});
	app.post('/pictures/create', function (req, res) {
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
						}
					);
				}
			})
		});
	});
	app.post('/covers/create', function(req, res) {		
		var tmp_path = req.files.cover.path;
		var target_path = './public/images/pics/' + req.files.cover.name;
		fs.rename(tmp_path, target_path, function(err) {
			// if (err) throw err;
			if (err) {
				return handleError(err);
			}
			else {
				fs.unlink(tmp_path, function() {
					if (err) {
						// throw err;
						return handleError(err);
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
				});
			}
		});	
	});
	app.io.route("/statuses/create", function(req) {
		User.findOne({_id: req.session.current_user._id}, function(err, result) {
			if (err) {
				return handleError(err);
			}
			else {
				result.status = req.data;
				result.save(function(err) {
					if (err) {
						return handleError (err);
					}
					else {
						req.io.emit("status_updated", {status: req.data});
					}
				});
			};
		});
	});

	// ---------------------------- not done yet -----------------
	app.io.route("/friends/create", function (req, res) {
		var friend_id = req.data;
		var me = req.session.current_user;

		User.findOne({_id: friend_id}, function (err, result) {		// find friend
			if (err) {
				return handleError (err);
			}
			else if (isInArray(me._id, result.friends)) {
				console.log("Hey!  We're already friends!");
			}
			else {
				result.friends.push(me._id);
				// console.log("here are my results: ", result);
				// result.friends.push({_id: me._id, first_name: me.first_name, last_name: me.last_name, pic: me.pic });
				result.save(function (err) {
					if (err) {
						return handleError (err);
					}
					else {
						User.findOne({_id: me._id}, function (err, data) {
							if (err) {
								return handleError (err);
							}
							else if (isInArray(friend_id, data.friends)) {
								console.log("See?!??!  I told you we were already friends!");
							}
							else {
								data.friends.push(friend_id);
								data.save(function (err) {
									if (err) {
										return handleError (err);
									}
									else {
										console.log("we made a friend!");
										req.io.emit("friend_made");
									}
								});
							};
						});
					}
				});
			}
		});
	});
	app.get("/signout", function (req, res) {
		var target_id = req.session.sessionID;
		req.session.destroy(function() {
			res.redirect('/');
		});
	});

// ------------------- for debugging purposes ---------------
	app.get('/test', function(req, res) {		// this api call displays 
		User.find({}, function(err, results) {  // all users in the database
			res.send(results);					
		});
	});
};