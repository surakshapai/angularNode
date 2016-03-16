angular.module('myApp')
	.controller('LoginController', 
		['$scope', '$location', '$window', 'Auth', function($scope, $location, $window, Auth) {
			$scope.login = function() {
				$scope.error = false;
				$scope.disabled = true;
				$scope.user = null;
				// Auth.login({
				// 	username: $scope.username,
				// 	password: $scope.password
				// },
				// function(res) {
				// 	console.log(Auth.user);
				// 	$scope.user = Auth.user;
				// 	$location.path('/home');
				// },
				// function(err) {
				// 	$scope.error = "Failed to login";
				// });



				Auth.login({username:$scope.username, password:$scope.password})
					.then(function() {
						$location.path('/home');
						$scope.user = Auth.currentUser;
						$scope.disabled = false;
					})
					.catch(function() {
						$scope.error = true;
						$scope.errorMessage = "Invalid";
						$scope.disabled = true;
					});
			};
		}]);