angular.module('myApp')
	.controller('HomeController',
		['$scope', 'Auth', 'User', 'Post', function($scope, Auth, User, Post) {
			$scope.currentUserModel = Auth.getCurrentUser();
			$scope.userName = $scope.currentUserModel.username;
			var userId = $scope.currentUserModel.userId;
			User.getAllUsers();
			
			$scope.postMessage = function() {
				Post.postUserMessage({postMessage: $scope.userPost, userId: userId})
					.then(function() {
						console.log("Calling then");
						// console.log("data in then" + data);
						$scope.userPosts = Post.getAllUserPosts(); 
						console.log("Scope"+ $scope);
					})
					.catch(function() {
						console.log("Calling catxh");
						console.log("error");
					})
			}
			// console.log("Scope"+ $scope);
		}]);