angular.module('myApp').controller('registerController',
	['$scope', '$location', 'AuthService',
	function($scope, $location, AuthService) {
		$scope.register = function() {
			$scope.error = false;
			$scope.disabled = true;

			AuthService.register($scope.registerForm.username, $scope.registerForm.password)
				.then(function() {
					$location.path('/login');
					$scope.disabled = false;
					$scope.registerForm = {};
				})
				.catch(function(){
					$scope.error = truel
					$scope.errorMessage = "Something went wrong";
					$scope.disabled = false;
					$scope.registerForm = {};
				});
		};
	}]);