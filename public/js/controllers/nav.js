portal.controller('navController', function ($scope, socket, conduit){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.friends_list = [];

	socket.emit("initialize_nav");

	socket.on("reset", function() {
		window.location.href = "/";
	});

	socket.on("initializing_nav", function (req) {
		$scope.me = req.my_record;
		$scope.everyone_else = req.other_users;
		console.log("Who am I? :", $scope.me);
	});

	socket.on("friend_packet", function (req) {
		$scope.friends_list.push(req);
	});

 	socket.on("made_a_friend", function (req) {
		$scope.friends_list.push(req.new_friend);
	});

 	socket.on("unfriended", function(req) {
 		var dropped_friend_id = req.dropped_friend;
 		var target = 0;
 		for (var i=0; i<$scope.friends_list.length; i++) {
 			if ($scope.friends_list[i]._id == dropped_friend_id) {
 				target = i;
 			};
 		}
 		$scope.friends_list.splice(target, 1);
 	});
});