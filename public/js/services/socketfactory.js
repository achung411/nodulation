portal.factory('socket', function ($rootScope) {
	var socket = ioo.connect();
	var factory = {};

	factory.on = function (eventName, callback) {
		socket.on(eventName, function () {  
    		var args = arguments;
    		$rootScope.$apply(function () {
    			callback.apply(socket, args);
    		});
  		});
	};

    factory.emit = function (eventName, data, callback) {
    	socket.emit(eventName, data, function () {
    		var args = arguments;
    		$rootScope.$apply(function () {
    			if (callback) {
    				callback.apply(socket, args);
    			}
    		});
    	});
   	};

	factory.removeAllListeners = function (eventName, callback) {
   		socket.removeAllListeners(eventName, function() {
    		var args = arguments;
    		$rootScope.$apply(function () {
    			callback.apply(socket, args);
    		});
    	});
   	};
    
    return factory;
});