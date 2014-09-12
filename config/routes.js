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
	})
}