portal.controller('welcomeController', function($scope, socket, conduit){    	

	socket.on('error', function (data) {
		console.log ('incoming errors: ', data.error_msg);
		$scope.error_msg = data.error_msg;
	});

	socket.on('notice', function (data) {
		console.log ('incoming notice: ', data.msg);
		$scope.notice = data.msg;
	});

	socket.on('registration_error', function(data) {
		console.log("incoming registration error: ", data);
		$scope.reg_error = data.reg_error;
	});

	$scope.login = function (user) {
		console.log("logging you in: ", user);
		socket.emit('/sessions/create', user);
	};

	$scope.addUser = function(user) {
		socket.emit('/users/create', user);
	};

    socket.on('user_authenticated', function(me) {
    	console.log("I am now ", me);
    	conduit.set_identity(me, function() {
			window.location.href = "/index";	    	
    	});
    });

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });
});