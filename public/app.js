var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'TasksController',
    templateUrl: 'views/tasks.html'
  })
  .otherwise({
    redirectTo: '/'
  })
});