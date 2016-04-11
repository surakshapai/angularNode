angular.module('myApp')
	.factory('Auth', function($http, $q, User) {
		var user = false, currentUser = {}, loggedInUser, userLength, userCount;

		return {
			isLoggedIn: function(user) {
				if(user) {
					return true;
				} else {
					return false;
				}
			},

			register: function(user, success, error) {
				var deferred = $q.defer();

				$http.post('/register', user)
					.success(function(data, status) {
						if(status === 200) {
							currentUser = data;
							deferred.resolve({
								user: true,
								currentUser: data
							})
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

			login: function(user) {
				var deferred = $q.defer();

				$http.post('/login', user)
					.success(function(data, status) {
						if(status === 200) {
							currentUser = data;
							deferred.resolve({
								user: true,
								currentUser: data
							})
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
			getCurrentUser: function() {
				console.log(currentUser);
				loggedInUser = currentUser;
				return loggedInUser;
			},

			facebookLogin: function() {
				delete $http.defaults.headers.common['X-Requested-With'];
				// $http.get('/auth/facebook')
				// 	.success(function(data, status) {
				// 		console.log(data);
				// 	})
				// 	.error(function(data) {
						
				// 	})
			}
		}
	})