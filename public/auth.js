angular.module('myApp')
	.factory('Auth', function($http, $q) {
		var user = null, currentUser = null;

		function changeUser(user) {
			angular.extend(currentUser, user);
		}

		return {
			isLoggedIn: function(user) {
				if(user) {
					return true;
				} else {
					return false;
				}
			},

			register: function(user, success, error) {
				$http.post('/register', user).success(function(user) {
					changeUser(user);
					success(user);
				}).error(error);
			},

			// login: function(user, success, error) {
			// 	$http.post('/login', user).success(function() {
			// 		changeUser(user);
			// 		success(user);
			// 	}).error(error);
			// },
			login: function(user) {
				var deferred = $q.defer();

				$http.post('/login', user)
					.success(function(data, status) {
						if(status === 200) {
							user = true;
							currentUser = data;
							deferred.resolve();
						} else {
							user = false;
							deferred.reject();
						}
					})
					.error(function(data) {
						user = false;
						deferred.reject();
					});
					return deferred.promise;

			},
			currentUser: currentUser
		}
	})