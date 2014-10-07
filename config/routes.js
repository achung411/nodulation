var users = require('./../server/controllers/users.js')
  ,	posts = require('./../server/controllers/posts.js')
  , comments = require('./../server/controllers/comments.js');

module.exports = function Route(app) {

	app.get('/', function (req, res) { users.intro(req, res) });
	app.get('/index', function (req, res) { users.index(req, res) });
	app.post('/pictures/create', function (req, res) { users.create_picture(req, res) } );
	app.post('/covers/create', function (req, res) { users.create_cover(req, res) } );
	app.post('/picpost/create', function (req, res) { posts.create_picpost(req, res) } );
	app.get("/signout", function (req, res) { users.signout(req, res) });
// ------------------- for debugging purposes ---------------
	app.get('/test_users', function (req, res) { users.test(req, res) });
	app.get('/test_posts', function (req, res) { posts.test(req, res) });
	app.get('/test_comments', function (req, res) { comments.test(req, res) });
};