portal.config(function ($routeProvider) {
	$routeProvider
		.when('/welcome',
		{
			templateUrl: '/js/partials/welcome.html'
		})
		.when('/register',
		{
			templateUrl: '/js/partials/register.html'
		})
		.otherwise({
			redirectTo: '/welcome'
		});
});