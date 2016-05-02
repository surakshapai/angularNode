angular.module('myApp')
	.factory('Post', function($http, $q, Auth) {
		var userPosts = [];
		return {
			postUserMessage: function(postObject) {
				var deferred = $q.defer();
				$http.post('/users/post/'+postObject.userId, postObject)
					.success(function(data, status) {
						if(status === 200) {
							console.log(data);
							deferred.resolve({
								userPosts: data
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
			},
			
			getUserPreviousPosts: function(userID) {
				var deferred = $q.defer();
				var isLoggedIn = Auth.isUserLoggedIn();
				$http.get('/previousPostsByUser/'+userID.userId)
					.success(function(data, status){
						if(status === 200) {	
							if(data.isNewUser) {
								deferred.resolve({
									isNewUser: data.isNewUser
								})
							} else {
								deferred.resolve({
									allUserPosts: data,
									isNewUser: data.isNewUser
								})
							}
							
						} else {
							deferred.reject();
						}
					})
					.error(function(data) {
						deferred.reject();
					});
					return deferred.promise;
			},

			getPostCount: function(userID) {
				var deferred = $q.defer();

				$http.get('/postCount/'+userID)
					.success(function(data, status) {
						if(status === 200) {
							deferred.resolve({
								postCount: data
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

			deleteUserPost: function(postDetails) {
				console.log(postDetails);
				var deferred = $q.defer();

				$http.delete('/deleteUserPost', {data: {'postDetails': postDetails}});
			}
		};
	});