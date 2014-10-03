portal.controller('portalController', function ($scope, socket){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.picPoster = false;
	$scope.allPosts = [];
	$scope.posters = [];

	// triggered by the initialize action run in the parent navController
	socket.on("/posts/index", function (req) {
		$scope.allPosts = req;
		console.log("all posts: ", req);
		for (var i=0; i<req.length; i++) {
			socket.emit("retrieve_author", req[i].author_id);
		};
	});

	socket.on("retrieved_author", function (req) {
		console.log("we got a winner! ", req);
		var unique = true;
		for (var i=0; i<$scope.posters.length; i++) {
			if (req._id == $scope.posters[i]._id) {
				unique = false;
			};
		};
		if (unique) {
			$scope.posters.push(req);
		}
		console.log("current $scope.posters on response: ", $scope.posters);
	});

	$scope.writeStatus = function (newStatus) {
		socket.emit("/statuses/create", newStatus);
	};

	socket.on("status_updated", function (req) {
		$scope.me.status = req.status;
	});

	$scope.chooseText = function() {
 		console.log("I choose you, text!");
 		$scope.picPoster = false;
 	};

 	$scope.choosePic = function() {
 		console.log("I choose you, picture!");
 		$scope.picPoster = true;
 	};

 	$scope.writePost = function(details) {
 		console.log("new post: ", details);
 		console.log("author: ", $scope.me._id);
 		console.log("wall: ", $scope.me._id);
 		socket.emit("/posts/create", {author_id: $scope.me._id, wall_id: $scope.me._id, content: details});
 	};

 	socket.on("post_created", function (req) {
 		console.log("We got a new one!", req);
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