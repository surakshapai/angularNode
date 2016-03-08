var myApp = angular.module('myApp',['ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/mainPage.html',
		})
		.state('login', {
			url: '/login',
			templateUrl: 'views/login.html',
			controller: 'loginController'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/register.html'
		})
}]);


myApp.run(($rootScope) => {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});