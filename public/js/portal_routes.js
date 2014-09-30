portal.config(function ($routeProvider) {
	$routeProvider
		.when('/main',
		{
			templateUrl: '/js/partials/main.html'
		})
		.when('/profile',
		{
			templateUrl: '/js/partials/profile.html'
		})
		.when('/settings',
		{
			templateUrl: '/js/partials/settings.html'
		})
		.when('/profile/:userid',
		{
			templateUrl: '/js/partials/visitor.html'
		})	
		.otherwise({
			redirectTo: '/main'
		});
});