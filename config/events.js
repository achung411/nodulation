var mongoose = require('mongoose')
  , fs = require('fs')
  ,	User = mongoose.model('User')
  ,	Post = mongoose.model('Post')
  ,	Comment = mongoose.model('Comment');

module.exports = function Event(app) {
	var current_user;

	function isInArray (value, array) {
		return array.indexOf(value) > -1;
	};
	function getAllPosts (wall_id, req) {
		Post
		.find({wall_id: wall_id})
		.limit(10)
		.sort('-created_at')
		.exec(function (err, results) {
			if (err) {
				return handleError(err);
			}
			else {
				req.io.emit("/posts/index", results);
			}
		});
	};
	function retrieveAuthor (req) {
 		User
		.findOne({_id: req.data})
		.select("first_name last_name pic")
		.exec(function (err, result) {
			if (err) {
				return handleError(err);
			}
			else {
				req.io.emit("retrieved_author", result);
			}
		});
	};
	function createNewPost (wall_id, req) {
		var new_post = req.data;
		var a = new Post(new_post);
		a.save(function (err, a) {
			if (err) {
				return handleError(err);
			}
			else {
				getAllPosts(wall_id, req);
			}
		});
	};
	function createNewComment (post_id, wall_id, req) {
		var new_comment = req.data;
		// console.log("Incoming new comment: ", new_comment);
		var a = new Comment(new_comment);
		a.save(function (err, a) {
			if (err) {
				return handleError(err);
			}
			else {
				console.log("We made a comment!");
				// getAllComments();
				getAllPosts(wall_id, req);
			}
		})
	};

	app.io.route('/users/create', function (req) {
		var new_user = req.data;
		var email_address = req.data.email;
		User.find({email: email_address}, function (err, results) {
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
	app.io.route('/sessions/create', function (req) {
	    var mail = req.data.email;
	    var pwd = req.data.password;
	    User.find({email: mail, password: pwd}, function (err, results) {
	        if (results.length == 0) {
	            req.io.emit('error', {error_msg: "There is no user registered with that email and password."});
	        }
	        else {
	        	var found_user = results[0];
	            req.session.current_user = found_user;
	            req.session.sessionID = req.sessionID;
	            req.session.save(function() {
	            	current_user = found_user;
	                req.io.emit('user_authenticated', found_user);
	            });
	        };
	    });
	});
	app.io.route("initialize_nav", function (req) {
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
							req.io.emit("initializing_nav", {my_record: my_record, other_users: result});
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
	app.io.route("initialize_visit", function (req) {
		if (typeof req.session.current_user == "undefined") {
			req.io.emit("reset");
		}
		else {
			var current_id = req.session.current_user._id;
			var visitee_id = req.data;
			User.find({_id: current_id}, function (err, results) {
				var my_record = results[0];								// refreshes user settings
				User.find({_id: visitee_id}, function (err, results) {	// gets visitor settings
					if (err) {
						return handleError(err);
					}
					else {
						var visitee_record = results[0];
						getAllPosts(visitee_id, req);
						req.io.emit("visit_approved", {my_record: my_record, visitee_record: visitee_record});
					}
				});
			});
		}
	});
	app.io.route("getMyPosts", function (req) {
		getAllPosts(current_user._id, req);
	});
	app.io.route("getYourPosts", function (req) {
		getAllPosts(req.data.target_id, req);
	});
	app.io.route("retrieve_author", function (req) {
		retrieveAuthor(req);
	});
	app.io.route("retrieve_comment", function (req) {
		Comment
		.find({post_id: req.data})
		.select("author_id post_id content")
		.exec(function (err, results) {
			var num_comments = results.length;
			if (err) {
				return handleError(err);
			}
			else if (num_comments > 0) {
				for (var i=0; i<num_comments; i++) {
					req.data = results[i].author_id;
					retrieveAuthor(req);
					req.io.emit("retrieved_comment", results[i]);
				}
			}
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
							req.io.emit('incoming_msg', "Your profile has been updated.");
						}
					});
				}
		});
	});
	app.io.route("/statuses/create", function (req) {
		User.findOne({_id: req.session.current_user._id}, function(err, result) {
			if (err) {
				return handleError(err);
			}
			else {
				result.status = req.data;
				result.updated_at = new Date();
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
	app.io.route("/friends/create", function (req, res) {
		var friend_id = req.data;
		var me = req.session.current_user;
		var my_id = req.session.current_user._id;
		User.findOne({_id: friend_id}, function (err, result) {		// find friend
			if (err) {
				return handleError (err);
			}
			else if (isInArray(my_id, result.friends)) {
				console.log("Hey!  We're already friends!");
			}
			else {
				result.friends.push(my_id);
				result.updated_at = new Date();
				result.save(function (err) {
					if (err) {
						return handleError (err);
					}
					else {
						User.findOne({_id: my_id}, function (err, data) {
							if (err) {
								return handleError (err);
							}
							else if (isInArray(friend_id, data.friends)) {
								console.log("See?!??!  I told you we were already friends!");
							}
							else {
								data.friends.push(friend_id);
								data.updated_at = new Date();
								data.save(function (err) {
									if (err) {
										return handleError (err);
									}
									else {
										User
										.find({_id: friend_id})
										.select("first_name last_name pic")
										.exec(function (err, returned_info) {
											if (err) {
												return handleError(err);
											}
											else {
												req.io.emit("made_a_friend", {new_friend: returned_info[0]});
											}
										});
									}
								});
							};
						});
					}
				});
			}
		});
	});
	app.io.route("/friends/destroy", function (req, res) {
		var friend_id = req.data;
		var my_id = req.session.current_user._id;
		var friendlist = [];
		User.findOne({_id: friend_id}, function (err, result) {		// find friend
			if (err) {
				return handleError(err);
			}
			else {
				var target_id = 0;									// remove me from friend's friend list
				for (var i=0; i<result.friends.length; i++) {
					if (result.friends[i] == my_id) {
						target_id = i;
					}
				}
				result.friends.splice(target_id, 1);
				result.updated_at = new Date();
				result.save(function (err) {
					if (err) {
						return handleError(err);
					}
					else {
						friendlist = result.friends;
						User.findOne({_id: my_id}, function (err, data) {	// find me
							if (err) {
								return handleError(err);
							}
							else {
								var new_target = 0;
								for (var j=0; j<data.friends.length; j++) {
									if (data.friends[j] == friend_id) {
										new_target = j;
									}
								}
								data.friends.splice(new_target, 1);
								data.updated_at = new Date();
								data.save(function (err) {
									if (err) {
										return handleError(err);
									}
									else {
										req.io.emit("unfriended", {dropped_friend: friend_id});
									}
								});
							}
						});
					}
				});
			}
		});
	});
	app.io.route("/posts/create", function (req, res) {
		createNewPost(req.data.wall_id, req);
	});
	app.io.route("/comments/create", function (req, res) {
		createNewComment(req.data.post_id, req.data.wall_id, req);
	});
};