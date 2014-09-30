portal.controller('navController', function ($scope, socket){

	$scope.friends_list = [];

	socket.emit("initialize_connection");

	socket.on("reset", function() {
		window.location.href = "/";
	});

	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

	socket.on("initializing", function (req) {
		$scope.me = req.my_record;
		$scope.everyone_else = req.other_users;
		console.log("I be[nav]: ", $scope.me);
		console.log("You guys be[nav]: ", $scope.everyone_else);
		console.log("My friends[nav]: ", $scope.me.friends);
	});

	socket.on("made_a_friend", function (req) {
		console.log("We've received a confirmation in our nav controller");
	});

	// socket.on("made_a_friend", function (req) {
	// 	console.log("We made a friend!");
			// console.log("Our results: ", req);
	// 	// console.log("our returned info: ", req.new_friendlist);
	// });

	socket.on("friend_packet", function (req) {
		console.log("incoming friend: ", req);
		$scope.friends_list.push(req);
		console.log("my friends so far: ", $scope.friends_list);
	});
});