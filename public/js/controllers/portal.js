portal.controller('portalController', function ($scope, socket, conduit){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.writeStatus = function (newStatus) {
		socket.emit("/statuses/create", newStatus);
	};

	socket.on("status_updated", function (req) {
		$scope.me.status = req.status;
	});

	$scope.editUser = function (user) {
		socket.emit("/users/edit", user);
	};

	socket.on("incoming_error", function (req) {
		$scope.error = req;
	});

	socket.on("incoming_msg", function (req) {
		$scope.notice = req;
	});
});