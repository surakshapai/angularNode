angular.module('myApp')
	.factory('Auth', function($http, $q, User) {
		var user = false, currentUser = {}, loggedInUser, userLength, userCount, isLoggedIn = false;

		return {
			
			register: function(user, success, error) {
				var deferred = $q.defer();

				$http.post('/register', user)
					.success(function(data, status) {
						if(status === 200) {
							currentUser = data;
							isLoggedIn = true;
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
							isLoggedIn = true;
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
				loggedInUser = currentUser;
				return loggedInUser;
			},

			isUserLoggedIn: function() {
				return isLoggedIn;
			},
			
			facebookLogin: function() {
				delete $http.defaults.headers.common['X-Requested-With'];
				var deferred = $q.defer();
				$http.get('/auth/facebook')
					.success(function(data, status) {
						console.log("Data in Facebook callback");
						console.log(data);
						deferred.resolve({
							user: data
						})
					})
					.error(function(data) {
						deferred.reject();
					})

					return deferred.promise;
			}


		}
	})