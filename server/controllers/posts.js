var mongoose = require('mongoose')
  , fs = require('fs')
  , User = mongoose.model('User')
  , Post = mongoose.model('Post')
  , Comment = mongoose.model('Comment');

module.exports = {
	create_picpost: function (req, res) {
		var tmp_path = req.files.new_post_pic.path;
		var target_path = "./public/images/posts/" + req.files.new_post_pic.name;
		var post_pic = req.body;
		fs.rename(tmp_path, target_path, function (err) {
			if (err) throw err;
			fs.unlink(tmp_path, function() {
				if (err) {
					throw err;
				}
				else {
					post_pic.pic = "/images/posts/" + req.files.new_post_pic.name;
					var a = new Post(post_pic);
					a.save(function (err, a) {
						if (err) {
							return handleError(err);
						}
						else {
							return res.redirect("/index");
						}
					});
				}
			});
		});
	// },

// ------------------- for debugging purposes ---------------
	// test: function (req, res) {                 // this api call displays 
 //    	Post.find({}, function (err, results) {    // all posts in the database
 //      		res.send(results);          
 //    	});
	}  
}