var myApp = angular.module('myApp',['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'views/home/home.html'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'views/login/login.html',
			controller: 'LoginController'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/register/register.html',
			controller: 'registerController'
		})
}]);


myApp.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});