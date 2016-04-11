angular.module('myApp')
	.controller('registerController', ['$rootScope', '$scope', '$location', 'Auth', 'User',
		function($rootScope, $scope, $location, Auth, User) {
			var promise = User.getUserCount();
			var userCount;
			promise.then(function(data) {
				userCount = data.userCount;
			});

			$scope.register = function() {
				Auth.register({
						username: $scope.username,
						password: $scope.password,
						userId: userCount+1 })
				.then(function(data) {
					$location.path('/home');
				})
				.catch(function() {
					$scope.errorMessage = "Invalid";
				})
			};
		}
	]);