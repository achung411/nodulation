portal.controller('portalController', function ($scope, socket, conduit){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.picPoster = false;
	$scope.allPosts = [];
	$scope.posters = [];

	socket.emit("getMyPosts");

	socket.on("/posts/index", function (req) {
		$scope.allPosts = req;
		for (var i=0; i<req.length; i++) {
			socket.emit("retrieve_author", req[i].author_id);
		};
	});

	socket.on("retrieved_author", function (req) {
		var unique = true;
		for (var i=0; i<$scope.posters.length; i++) {
			if (req._id == $scope.posters[i]._id) {
				unique = false;
			};
		};
		if (unique) {
			$scope.posters.push(req);
		}
	});

	$scope.writeStatus = function (newStatus) {
		socket.emit("/statuses/create", newStatus);
	};

	socket.on("status_updated", function (req) {
		$scope.me.status = req.status;
	});

	$scope.chooseText = function() {
 		$scope.picPoster = false;
 	};

 	$scope.choosePic = function() {
 		$scope.picPoster = true;
 	};

 	$scope.writePost = function(details) {
 		socket.emit("/posts/create", {author_id: $scope.me._id, wall_id: $scope.me._id, content: details});
 	};

 	socket.on("post_created", function (req) {
 		$scope.allPosts.push(req);
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