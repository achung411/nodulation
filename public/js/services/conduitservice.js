portal.service('conduit', function() {
	
	// var friends = ["Tupac Shakur", "Biggie Smalls", "Sean Puffy Combs", "Jay-Z", "Nas"];
	var identity = [];
	var friends = [];
	var channel = {};
	
	channel.set_identity = function(ego) {
		identity = ego;
		console.log("I am...", identity);
	};

	channel.get_identity = function() {
		console.log("I will always be... ", identity);
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