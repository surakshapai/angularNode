angular.module('myApp')
	.controller('LoginController', 
		['$scope', '$location', '$window', 'Auth', function($scope, $location, $window, Auth) {
			console.log("Controller being valled");
			$scope.login = function() {	
				$scope.error = false;
				$scope.disabled = true;
				$scope.user = null;

				Auth.login({username:$scope.username, password:$scope.password})
					.then(function() {
						var currentUser = Auth.getCurrentUser();
						var userID = currentUser.userId;
						$location.path('/home/user/posts/1');
						$scope.user = Auth.currentUser;
						$scope.disabled = false;
					})
					.catch(function() {
						$scope.error = true;
						$scope.errorMessage = "You may have entered username or password incorrectly";
						$scope.disabled = true;
					});
			};

			$scope.facebookLogin = function() {
				console.log("being called");
				Auth.facebookLogin();
					// .then(function() {
					// 	console.log("log in happening");
					// })
					// .catch(function() {
					// 	// Do nothing
					// })
			};
		}]);