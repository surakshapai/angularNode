angular.module('myApp')
	.controller('registerController',
		['$rootScope', '$scope','$location', 'Auth',
		function($rootScope, $scope, $location, Auth) {
			$scope.register = function() {
				Auth.register({
					username: $scope.username,
					password: $scope.password
				},
				function(res) {
					$location.path('/home');
				},
				function(err) {
					$rootScope.error = err;
				});
			};
		}]);