var myApp = angular.module('myApp',['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	// delete $httpProvider.defaults.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'views/home/home.html',
			controller: 'HomeController'
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
		.state('login.facebook', {
			url: '/auth/facebook',
			controller: 'LoginController'
		})
}]);


myApp.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});