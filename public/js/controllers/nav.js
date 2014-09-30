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
	});

	// socket.on("made_a_friend", function (req) {
	// 	console.log("We've received a confirmation in our nav controller");
	// });

	//  socket.on("unfriended", function() {
 // 		console.log("Droppin' friends in visitees");
 // 	});

	socket.on("friend_packet", function (req) {
		$scope.friends_list.push(req);
	});
});