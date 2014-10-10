portal.controller('visiteeController', function ($scope, socket, $routeParams){

	$scope.friendly = false;
	$scope.picPoster = false;
	$scope.yourPosts = [];
	$scope.allComments = [];
	$scope.posters = [];

	var visitee_id = $routeParams.userid;

	socket.emit("initialize_visit", visitee_id);

 	socket.on("notify", function (msg) {
 		if (msg.action == "posting") {
 			socket.emit("getYourPosts", visitee_id);
 		}
 		else if (msg.action == "details" || msg.action == "friend") {
 			socket.emit("initialize_visit", visitee_id);
 		}
 	});

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

	socket.on("/posts/index", function (req) {
		$scope.yourPosts = req;
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

 	$scope.chooseText = function() {
 		$scope.picPoster = false;
 	};

 	$scope.choosePic = function() {
 		$scope.picPoster = true;
 	};

	$scope.writeYourPost = function(new_post) {
		var details = new_post;
		$scope.new_post = "";
		$scope.postForm.$setPristine();
 		socket.emit("/posts/create", {author_id: $scope.me._id, wall_id: visitee_id, content: details});
 	};

 	$scope.writeComment = function(commentary, post_id) {
		socket.emit("/comments/create", {post_id: post_id, author_id: $scope.me._id, wall_id: visitee_id, content: commentary});
	};
});