portal.factory('conduit', function() {
	
	// var friends = ["Tupac Shakur", "Biggie Smalls", "Sean Puffy Combs", "Jay-Z", "Nas"];
	var identity = {};
	var friends = [];
	var channel = {};
	
	channel.set_identity = function (ego, callback) {
		console.log("requesting we save user: ", ego);
		identity = ego;
		console.log("we have saved the user: ", identity);
		callback();
		// console.log("My identity is now: ", identity);
		// callback();
	};

	channel.get_identity = function (callback) {
		// $http.get('/friends.json').success(function(output)
		console.log("I think i am ", identity);
		// callback(identity);
		callback();
		return identity;
	};
	

	channel.getFriends = function() {
		return friends;
	};

	channel.setFriends = function(newlist) {
		friends = newlist;
	};

	channel.add_to_friends = function(person) {
		var is_friend = false;
		for (var i=0; i < friends.length; i++) {
			if (person._id == friends[i]._id) {
				is_friend = true;
			}
		}
		if (!is_friend) {
			friends.push(person);
		};
	}

	return channel;
});