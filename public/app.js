var myApp = angular.module('myApp',['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	// delete $httpProvider.defaults.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	
	

	$urlRouterProvider.otherwise('main/login');

	$stateProvider
		.state('home', {
			url: '/home',
			cache: false,
			templateUrl: 'views/home/home-main.html',
			controller: 'HomeController'
		})
		.state('home.postDetails', {
			url: '/user/posts/{challengeID}',
			templateUrl: 'views/home/post-details.html',
			controller: 'HomeController'
		})
		.state('home.challengeDetails', {
			url: '/user/challenge',
			templateUrl: 'views/home/challenge-details.html',
			controller: 'HomeController'
		})
		.state('main', {
			url: '/main',
			template: '<ui-view />'
		})
		.state('main.login', {
			url: '/login',
			cache: false,
			templateUrl: 'views/login/login.html',
			controller: 'LoginController'
		})
		.state('main.register', {
			url: '/register',
			templateUrl: 'views/register/register.html',
			controller: 'registerController'
		})
		// .state('login.facebook', {
		// 	url: '/auth/facebook',
		// 	controller: 'LoginController'
		// })
}]);


myApp.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});