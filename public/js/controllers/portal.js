portal.controller('portalController', function ($scope, socket, conduit){

	// $scope.$on('$destroy', function (event) {
	// 	socket.removeAllListeners();
	// });

	$scope.picPoster = false;
	$scope.allPosts = [];
	$scope.allComments = [];
	$scope.posters = [];

	socket.emit("getMyPosts");

	socket.on("/posts/index", function (req) {
		$scope.allPosts = req;
		for (var i=0; i<req.length; i++) {
			socket.emit("retrieve_author", req[i].author_id);
			socket.emit("retrieve_comment", req[i]._id);
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

	socket.on("retrieved_comment", function (req) {
		var unique = true;
		for (var i=0;i<$scope.allComments.length; i++) {
			if (req._id == $scope.allComments[i]._id) {
				unique = false;
			}
		};
		if (unique) {
			$scope.allComments.push(req);
		};
	});

	$scope.writeStatus = function (new_status) {
		var newStatus = new_status;
		$scope.new_status = "";
		$scope.statusForm.$setPristine();
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

 	$scope.writeMyPost = function(new_post) {
 		var details = new_post;
 		$scope.new_post = "";
 		$scope.postForm.$setPristine();
 		socket.emit("/posts/create", {author_id: $scope.me._id, wall_id: $scope.me._id, content: details});
 	};

	$scope.editUser = function (user) {
		socket.emit("/users/edit", user);
	};

	$scope.writeComment = function(commentary, post_id) {
		socket.emit("/comments/create", {post_id: post_id, author_id: $scope.me._id, wall_id: $scope.me._id, content: commentary});
	};

	socket.on("incoming_error", function (req) {
		$scope.error = req;
	});

	socket.on("incoming_msg", function (req) {
		$scope.notice = req;
	});
});