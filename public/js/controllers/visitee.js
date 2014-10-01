portal.controller('visiteeController', function ($scope, socket, $routeParams){

	$scope.friendly = false;

	var visitee_id = $routeParams.userid;
	socket.emit("initialize_visit", visitee_id);

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	socket.on("visit_approved", function (req) {
		$scope.me = req.my_record;
		$scope.visitee = req.visitee_record;
		var num_friends = $scope.me.friends.length;
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
		$scope.friendly = true;
	});

	$scope.dropFriend = function (target_id) {
		socket.emit("/friends/destroy", target_id);
	};

 	socket.on("unfriended", function() {
 		$scope.friendly = false;
 	});

 	$scope.ping = function () {
 		console.log("pinging away!");
 		socket.emit("PING");
 	};

 	socket.on("PONG", function() {
 		console.log("We all love PONG here in the visitor page!");
 	});
});