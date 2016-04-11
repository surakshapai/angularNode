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

			$scope.facebookLogin = function() {
				console.log("being called");
				Auth.facebookLogin()
					.then(function() {
						console.log("log in happening");
					})
					.catch(function() {
						// Do nothing
					})
			};
		}]);