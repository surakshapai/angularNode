angular.module('myApp')
	.factory('User', function($http, $q) {
		var userCount;
		return {
			getAllUsers: function() {
				$http.get('/users').success(function(res) {
					console.log(res);
				}).error(function(data) {
					console.log(data);
				})
			}, 
			getUserCount: function() {
				var deferred = $q.defer();

				$http.get('/userCount').success(function(data, status) {
					if(status === 200) {
						deferred.resolve({
							userCount: data.userCount
						})
					} else {
						deferred.reject();
					}
				}).error(function(data) {
					deferred.reject();
				})
				return deferred.promise;
			}
		}
	})