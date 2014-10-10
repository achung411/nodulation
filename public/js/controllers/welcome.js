portal.controller("welcomeController", function ($scope, socket){    	

	socket.on("error", function (data) {
		$scope.error_msg = data.error_msg;
	});

	socket.on("notice", function (data) {
		$scope.notice = data.msg;
	});

	socket.on("registration_error", function (data) {
		$scope.reg_error = data.reg_error;
	});

	$scope.login = function (user) {
		socket.emit("/sessions/create", user);
	};

	$scope.addUser = function (user) {
		var new_user = user;
		$scope.user = "";
		$scope.regForm.$setPristine();
		socket.emit("/users/create", new_user);
	};

    socket.on("user_authenticated", function (me) {
		window.location.href = "/index";
    });

	// $scope.$on("$destroy", function (event) {
	// 	socket.removeAllListeners();
	// });
});