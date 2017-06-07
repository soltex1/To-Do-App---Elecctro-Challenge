var myApp = angular.module('myApp');

myApp.controller('TasksController',['$scope', '$http', '$location', '$route', function($scope, $http, $location, $routeParams){

  $scope.data = {
    availableOptions: [
      {id: '1', name: 'complete'},
      {id: '2', name: 'incomplete'}
    ],
    selectedOption: {id: '2', name: 'incomplete'} //This 
  }

  $scope.enableEditor = function(index, task) {
    $scope['editorEnabled'] = index;
    $scope['editableTitle'] = task.description;
    $scope.data.selectedOption = (task.state == 'complete') ? $scope.data.availableOptions[0] : $scope.data.availableOptions[1];
    $scope.aaa = index;
  };

  $scope.disableEditor = function(){
    $scope['editorEnabled'] = true;
    $scope.aaa = false;
  };

  $scope.save = function(editableTitle, task){
    $scope['editorEnabled'] = true;
    $scope.aaa = false;
    task.description = editableTitle;
    task.state = $scope.data.selectedOption.name;
    $http.put('/todos/'+task._id, {'description':task.description, 'state':task.state}); 
  };

  $scope.getTasks = function(){
    $http.get('/todos').then(function(response){
      $scope.tasks = response.data;
    });
  };

  $scope.text = 'hello';
  $scope.submit = function() {
    if ($scope.text) {
      $http.post('/todos', {'description':$scope.text, 'state':'incomplete'}).then(function(response){
        $scope.tasks.push(response.data);
        $scope.text = "";
      });
    }
  };

  $scope.delete = function(task){
    var index = $scope.tasks.indexOf(task);
    $scope.tasks.splice(index, 1);
    $http.delete('/todos/'+task._id);
  };

}]);

