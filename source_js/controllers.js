var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker']);
// '720kb.datepicker'

mp4Controllers.controller('AddTaskController', ['$scope', '$http', 'Users' , 'Tasks', '$window' , function($scope, $http,  Users, Tasks, $window) {
  
  Users.get().success(function(data){
    $scope.users = data.data;
  });

  $scope.submit = function() {
    
    var user = $scope.inputUser;
    var newObject;
    

    if( user != "" )
    {
      Users.getUser(user).success(function(data){
        user = data.data;
        newObject = {
          name: $scope.inputName,
          completed: false,
          deadline: $scope.inputDate,
          description: $scope.inputDescription,
          assignedUser: user._id,
          assignedUserName: user.name
        };

        Tasks.postTask(newObject).success(function(data){


        });

        console.log(newObject)
      });
    }
    else 
    {
      newObject = {
        name: $scope.inputName,
        completed: false,
        deadline: $scope.inputDate,
        description: $scope.inputDescription,
        assignedUser: "unassigned",
        assignedUserName: "unassigned"
      };  

      Tasks.postTask(newObject).success(function(data){


      });
      console.log(newObject)
    };
  }

}]);

mp4Controllers.controller('TaskController', ['$scope' , '$routeParams', '$http', 'Tasks', '$window' , function($scope, $routeParams, $http, Tasks, $window) {
  var taskid = $routeParams.taskid;

  Tasks.getTask(taskid).success(function(data){
    $scope.task = data.data;
    console.log($scope.task)
  });

}]);

mp4Controllers.controller('TaskListController', ['$scope', '$http', 'Tasks', '$window', function($scope, $http,  Tasks, $window) {

  Tasks.get().success(function(data){
    $scope.tasks = data.data;
    console.log($scope.tasks)
  });

  $scope.filterTasks = function(){

    //{"_id": "55099652e5993a350458b7b7"}

    var params = {};
    console.log($scope.displayStatus)

    if ($scope.displayStatus != "all")
    {
      params = {
        where : '{ "completed" : ' + $scope.displayStatus + '}'
      }

      Tasks.getTasksFiltered(params).success(function(data){
        console.log('yo fam we made it')
        console.log(data.data)
        console.log(params)
      });
    }
  }

  $scope.deleteTask= function(taskId){
    console.log("deleting task " + taskId)
    Tasks.deleteTask(taskId).success(function(data){

      Tasks.get().success(function(data){
        $scope.tasks = data.data;
      });

    }).error(function(){


    });
  }

}]);


mp4Controllers.controller('UserListController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window) {

  Users.get().success(function(data){
    $scope.users = data.data;
  });

  $scope.deleteUser= function(userId){
    console.log("deleting " + userId)
    Users.deleteUser(userId).success(function(data){

      Users.get().success(function(data){
        $scope.users = data.data;
      });

    }).error(function(){


    });
  }

}]);

mp4Controllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window)  {
  
  $scope.list = []
  $scope.submit = function() {
    var newObject = {
        name: $scope.inputName,
        email: $scope.inputEmail
    };
    
    Users.postNewUser(newObject).success(function(data){

      console.log('hey guys')

    }).error(function(){
      console.log('heh we failed')

    });

    console.log(newObject)
  };

}]);

mp4Controllers.controller('UserController', ['$scope' , '$routeParams', '$http', 'Users', 'Tasks', '$window' , function($scope, $routeParams, $http, Users, Tasks, $window) {
  var userid = $routeParams.userid;

  $scope.pendingUserFilter = function (item) {
    return (($scope.user)._id === item.assignedUser) && (item.completed === false);
  };

  $scope.completedUserFilter = function (item) {
    return  (($scope.user)._id === item.assignedUser) && (item.completed === true);
  };

  $scope.completeTask = function(task) {

    task.completed = true;
    Tasks.updateTask(task).success(function(data){
      console.log('we did it fam')
    });
  }

  Users.getUser(userid).success(function(data){
    $scope.user = data.data;
  });

  Tasks.get().success(function(data){
    $scope.tasks = data.data;
    console.log(data.data)
  });



  console.log(userid);

}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);
