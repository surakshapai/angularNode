angular.module('myApp')
	.factory('User', function($http, $q, $location) {
		var userCount, userChallenges;
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
			},

			saveNewChallenge: function(userId, challengeObj) {
				var deferred = $q.defer();
				$http.post('/saveUserChallenge/'+userId, challengeObj)
					.success(function(data,status) {
						console.log("Getting data back in saveNewChallenge");
						console.dir(data);
						if(status === 200) {
							deferred.resolve({
								userSavedWithChallenge: data
							})
						} else {
							deferred.reject();
						}
					})
					.error(function(status) {
						deferred.reject();
					})
					return deferred.promise;
			}

		}
	})