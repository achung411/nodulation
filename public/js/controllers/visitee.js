portal.controller('visiteeController', function ($scope, socket, $routeParams){

	$scope.friendly = false;

	var visitee_id = $routeParams.userid;
	socket.emit("initialize_visit", visitee_id);

	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

	socket.on("visit_approved", function (req) {
		$scope.me = req.my_record;
		// console.log("I am[vis]: ", $scope.me);
		$scope.visitee = req.visitee_record;
		console.log("I am visiting[vis]: ", $scope.visitee);
		// console.log("My friends are[vis]: ", $scope.me.friends);
		var num_friends = $scope.me.friends.length;
		// console.log("I have ", num_friends, " friends");
		for (var i=0; i<num_friends; i++) {
			if ($scope.visitee._id == $scope.me.friends[i]) {
				$scope.friendly = true;
			}
		};
	});

	$scope.addFriend = function (target_id) {
		socket.emit("/friends/create", target_id);
	};

	socket.on("incoming_error", function (req) {
		$scope.error = req;
	});

 	socket.on("made_a_friend", function (req) {
		console.log("We've received a confirmation in our visitee controller");
	});

});