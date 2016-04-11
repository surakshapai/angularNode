angular.module('myApp')
	.factory('Post', function($http, $q) {
		var userPosts = [];
		return {
			postUserMessage: function(postObject) {
				var deferred = $q.defer();

				$http.post('/users/post/'+postObject.userId, postObject)
					.success(function(data, status) {
						if(status === 200) {
							deferred.resolve({
								userPosts: userPosts.push(data.postedMessage)
							})
						} else {
							deferred.reject();
						}

					})
					.error(function(data) {
						deferred.reject();
					});
					return deferred.promise;
			},
			getAllUserPosts: function() {
				return userPosts;
			}
		};
	});