var myApp = angular.module('myApp');

myApp.controller('TasksController',['$scope', '$http', '$location', '$route', function($scope, $http, $location, $routeParams){

  // Initial data to the selection options
  $scope.data = {
    availableOptions: [
      {id: '1', name: 'COMPLETE'},
      {id: '2', name: 'INCOMPLETE'}
    ],
    selectedOption: {id: '2', name: 'INCOMPLETE'}
  }

  $scope.enableEditor = function(index, task) {
    $scope['editorEnabled'] = index;
    $scope['editableTitle'] = task.description;
    $scope.data.selectedOption = (task.state == 'COMPLETE') ? $scope.data.availableOptions[0] : $scope.data.availableOptions[1];
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
    $http.get('/currentuser').then(function(response){
      $http.get('/todos/'+ response.data._id).then(function(response){
        $scope.tasks = response.data;
      });
    });
  };
  
  $scope.current = function(){
    $http.get('/currentuser').then(function(response){
      $scope.currentUser = response.data.name;
      const abc = response.data._id;
      console.log('userid');
      console.log(abc);
    });
  };
   
  $scope.text = 'my first task';
  $scope.submit = function() {
    $http.get('/currentuser').then(function(response){

      if ($scope.text) {
        $http.post('/todos', {'description':$scope.text, 'state':'INCOMPLETE', '_creator':String(response.data._id)}).then(function(response){
          $scope.tasks.push(response.data);
          $scope.text = "";
        });
      }
    });
  };

  $scope.delete = function(task){
    var index = $scope.tasks.indexOf(task);
    $scope.tasks.splice(index, 1);
    $http.delete('/todos/'+task._id);
  };

}]);

