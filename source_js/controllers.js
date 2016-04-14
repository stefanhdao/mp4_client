var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'angularUtils.directives.dirPagination']);
// '720kb.datepicker'

mp4Controllers.controller('AddTaskController', ['$scope', '$http', 'Users' , 'Tasks', '$window' , function($scope, $http,  Users, Tasks, $window) {
  
  Users.get().success(function(data){
    $scope.users = data.data;
  });

  $scope.submit = function() {
    
    var user = $scope.inputUser;
    var newObject;
    $scope.success = '';

    if( user != undefined && user != null && user != "")
    {
      Users.getUser(user._id).success(function(data){

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
          $scope.success = 'true';
          task = data.data;
          user.pendingTasks.push(task._id);

          Users.updateUser(user).success(function(){

          });
        });
      });
    }
    else 
    {
      newObject = {
        name: $scope.inputName,
        completed: false,
        deadline: $scope.inputDate,
        description: $scope.inputDescription,
        assignedUser: "",
        assignedUserName: "unassigned"
      };  

      Tasks.postTask(newObject).success(function(data){
        $scope.success = 'true';

      });
    };
  }

}]);

mp4Controllers.controller('EditTaskController', ['$scope' , '$routeParams', '$http', 'Tasks', 'Users', '$window' , function($scope, $routeParams, $http, Tasks, Users, $window) {
  
  var taskid = $routeParams.taskid;
  Users.get().success(function(data){
    $scope.users = data.data;
  });

  Tasks.getTask(taskid).success(function(data){

    $scope.task = data.data;
    if($scope.task.assignedUserName != "unassigned") {
      Users.getUser($scope.task.assignedUser).success(function(data2){

        for (var i = 0; i < $scope.users.length; i++)
        {
          if (data2.data._id === $scope.users[i]._id)
          {
            $scope.inputUser = $scope.users[i];
            break;
          }
        }
      });
    }

    $scope.inputName = $scope.task.name;
    $scope.inputDescription = $scope.task.description;
    $scope.inputDate = $scope.task.deadline;
    $scope.inputCompleted = $scope.task.completed === true ? "true" : "false";
  });

  $scope.submit = function() {
    $scope.task.name = $scope.inputName;
    $scope.task.deadline = $scope.inputDate;
    $scope.task.description = $scope.inputDescription;
    $scope.task.completed = $scope.inputCompleted === "true" ? true: false;

    if($scope.inputUser === null || $scope.inputUser === undefined)
    {
      console.log('no user')

      if($scope.task.assignedUser != "" && $scope.task.assignedUserName != "unassigned")
      {
        Users.getUser($scope.task.assignedUser)
        .success(function(data){
          var user = data;
          var index = user.pendingTasks.indexOf($scope.task._id);
          user.pendingTasks.splice(index, 1);

          Users.updateUser(user).success(function(data){
            $scope.task.assignedUser = "";
            $scope.task.assignedUserName = "unassigned";

            Tasks.updateTask($scope.task).success(function(data){
              $scope.success = 'true';
            });
          });
        })
        .error(function(){
          $scope.task.assignedUser = "";
          $scope.task.assignedUserName = "unassigned";

          Tasks.updateTask($scope.task).success(function(data){
            $scope.success = 'true';
          });
        });
      }
      else
      {
        $scope.task.assignedUser = "";
        $scope.task.assignedUserName = "unassigned";

        Tasks.updateTask($scope.task).success(function(data){
          $scope.success = 'true';
        });
      }   
    }
    else
    {
      console.log('has user')

      if($scope.task.assignedUser != "")
      {
        Users.getUser($scope.task.assignedUser)
        .success(function(data){
          var user = data.data;
          var index = user.pendingTasks.indexOf($scope.task._id);
          user.pendingTasks.splice(index, 1);

          Users.updateUser(user)
          .success(function(data){
            $scope.task.assignedUser = $scope.inputUser._id;
            $scope.task.assignedUserName = $scope.inputUser.name;

            index = $scope.inputUser.pendingTasks.indexOf($scope.task._id);
            if ( index != -1)
            {
              $scope.inputUser.pendingTasks.splice(index, 1);
            }


            if($scope.inputCompleted === "false")
            {
              $scope.inputUser.pendingTasks.push($scope.task._id);
            }
            Users.updateUser($scope.inputUser)
            .success(function(){
              console.log("successfully updated other user(2)")
              console.log($scope.inputUser);

              $scope.task.assignedUser = $scope.inputUser._id;
              $scope.task.assignedUserName = $scope.inputUser.name;

              Tasks.updateTask($scope.task).success(function(data){
                $scope.success = 'true';
              });
            });

          });
        })
        .error(function(){
          $scope.task.assignedUser = $scope.inputUser._id;
          $scope.task.assignedUserName = $scope.inputUser.name;

          if($scope.inputCompleted === "false")
          {
            $scope.inputUser.pendingTasks.push($scope.task._id);
          }

          Users.updateUser($scope.inputUser).success(function(){

            $scope.task.assignedUser = $scope.inputUser._id;
            $scope.task.assignedUserName = $scope.inputUser.name;

            Tasks.updateTask($scope.task).success(function(data){
              $scope.success = 'true';
            });
          });
        });
      }
      else
      {
        $scope.task.assignedUser = $scope.inputUser._id;
        $scope.task.assignedUserName = $scope.inputUser.name;

        if($scope.inputCompleted === "false")
        {
          $scope.inputUser.pendingTasks.push($scope.task._id);
        }

        Users.updateUser($scope.inputUser).success(function(){

          $scope.task.assignedUser = $scope.inputUser._id;
          $scope.task.assignedUserName = $scope.inputUser.name;

          Tasks.updateTask($scope.task).success(function(data){
            $scope.success = 'true';
          });
        });
      }
    }
  };

}]);

mp4Controllers.controller('TaskController', ['$scope' , '$routeParams', '$http', 'Tasks', 'Users', '$window' , function($scope, $routeParams, $http, Tasks, Users, $window) {
  
  var taskid = $routeParams.taskid;

  Tasks.getTask(taskid).success(function(data){
    $scope.task = data.data;
  });

}]);

mp4Controllers.controller('TaskListController', ['$scope', '$http', 'Tasks', 'Users', '$window', function($scope, $http,  Tasks, Users, $window) {

  $scope.displayStatus = "false";
  $scope.orderType = "ascending";
  $scope.sortOptions = ["dateCreated", "name", "assignedUserName", "deadline"];
  $scope.sortOption = $scope.sortOptions[0];

  paramsInitial = {
        where : '{ "completed" : false }',
        sort : '{ "dateCreated" : 1 }'
  }

  Tasks.getTasksFiltered(paramsInitial).success(function(data){

    $scope.tasks = data.data;
  });

  $scope.filterTasks = function(){
    var params = {};

    if ($scope.displayStatus != "all")
    {
      var order = $scope.orderType === "ascending" ? 1 : -1;

      params = {
        where : '{ "completed" : ' + $scope.displayStatus + '}',
        sort : '{"' + $scope.sortOption + '" : ' + order + '}'
      }

      Tasks.getTasksFiltered(params).success(function(data){
        $scope.tasks = data.data;
      });
    }
    else
    {
      var order = $scope.orderType === "ascending" ? 1 : -1;

      params = {
        sort : '{"' + $scope.sortOption + '" : ' + order + '}'
      }

      Tasks.getTasksFiltered(params).success(function(data){
        $scope.tasks = data.data;
      });
    }
  }

  $scope.deleteTask= function(taskId){
    console.log("deleting task " + taskId)
    Tasks.getTask(taskId).success(function(data){

      var delTask = data.data;
      Tasks.deleteTask(taskId).success(function(data){

        var userId = delTask.assignedUser;

        if(userId != "")
        {
          Users.getUser(userId).success(function(data){
            var user = data.data;
            var index = user.pendingTasks.indexOf($scope.taskId);
            user.pendingTasks.splice(index, 1);

            Users.updateUser(user).success(function(data){
            });
          });
        }

        Tasks.get().success(function(data){
          $scope.tasks = data.data;
        });

      }).error(function(){


      });

    });

    
  }

}]);


mp4Controllers.controller('UserListController', ['$scope', '$http', 'Users', 'Tasks', '$window' , function($scope, $http,  Users, Tasks, $window) {

  Users.get().success(function(data){
    $scope.users = data.data;

  });

  $scope.deleteUser= function(userId){
    console.log("deleting " + userId)
    Users.deleteUser(userId).success(function(data){

      var params = {
        where: '{ "assignedUser" : "' + userId + '"}'
      }

      Tasks.getTasksFiltered(params).success(function(data){
        console.log('data')
        tasks = data.data;

        for ( var i = 0; i < tasks.length; i++)
        {
          tasks[i].assignedUser = "";
          tasks[i].assignedUserName = "unassigned";

          Tasks.updateTask(tasks[i]).success(function(){

          });

        }

      });

      Users.get().success(function(data){
        $scope.users = data.data;
      });

    }).error(function(){


    });
  }

}]);

mp4Controllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window)  {
  
  $scope.list = []
  $scope.success = 'none';

  $scope.clearSuccess = function() {
    $scope.success = 'none';
  };

  $scope.submit = function() {

    var newObject = {
        name: $scope.inputName,
        email: $scope.inputEmail
    };
    
    Users.postNewUser(newObject).success(function(data){
      $scope.success = 'true';

    }).error(function(){
      $scope.success = 'false';

    });
  };

}]);

mp4Controllers.controller('UserController', ['$scope' , '$routeParams', '$http', 'Users', 'Tasks', '$window' , function($scope, $routeParams, $http, Users, Tasks, $window) {
  var userid = $routeParams.userid;

  $scope.show = 'false;'

  Users.getUser(userid).success(function(data){
    $scope.user = data.data;

    params = {
        where : '{ "assignedUser" : "' + $scope.user._id + '"}',
      }
   
    Tasks.getTasksFiltered(params).success(function(data){
      $scope.tasks = data.data;
    });

  });

  $scope.completedUserFilter = function (item) {
    return  (item.completed === true);
  };

  $scope.pendingUserFilter = function (item) {
    return  (item.completed === false);
  };

  $scope.completeTask = function(task) {

    task.completed = true;
    Tasks.updateTask(task).success(function(data){
      var index = $scope.user.pendingTasks.indexOf(task._id);
      $scope.user.pendingTasks.splice(index, 1);
      Users.updateUser($scope.user).success(function(){
      })

    });
  }

  $scope.showCompletedTasks = function()
  {
    $scope.show = 'true';
  }

}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);
