portal.controller('navController', function ($scope, socket){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.notifications = [];

	function initialize_nav () {
		$scope.friends_list = [];
		socket.emit("initialize_nav");
	};

	initialize_nav();

	socket.on("reset", function () {
		window.location.href = "/";
	});

	socket.on("initializing_nav", function (req) {
		$scope.me = req.my_record;
		$scope.everyone_else = req.other_users;
	});

	socket.on("friend_packet", function (req) {
		$scope.friends_list.push(req);
	});

 	socket.on("made_a_friend", function (req) {
		$scope.friends_list.push(req.new_friend);
	});

 	socket.on("unfriended", function (req) {
 		var dropped_friend_id = req.dropped_friend;
 		var target;
 		for (var i=0; i<$scope.friends_list.length; i++) {
 			if ($scope.friends_list[i]._id == dropped_friend_id) {
 				target = i;
 			};
 		};
 		if (target > -1) {
 			$scope.friends_list.splice(target, 1);
 		};
 	});

 	socket.on("notify", function (person) {
 		var involves_me = false;
 		var involves_friends = false;
 		if ($scope.me._id == person.object_id && person.action == "friend") {
			initialize_nav();
		};
		if ($scope.me._id == person.subject_id || $scope.me._id == person.object_id) {
 			involves_me = true;
 		}
 		else {
	 		for (var i=0; i<$scope.friends_list.length; i++) {
	 			if ($scope.friends_list[i]._id == person.subject_id || $scope.friends_list[i]._id == person.object_id) {
	 				involves_friends = true;
	 			}
			}
		};
		if (involves_me || involves_friends) {
	 		if ($scope.notifications.length > 6) {
				$scope.notifications.pop();
			};
			$scope.notifications.unshift(person);
		};
 	});
});