var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/taskview', {
    templateUrl: 'partials/tasklist.html',
    controller: 'TaskListController'
  }).
  when('/tasks/:taskid', {
    templateUrl: 'partials/task.html',
    controller: 'AddTaskController'
  }).
  when('/edittask/:taskid', {
    templateUrl: 'partials/edittask.html',
    controller: 'AddTaskController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'AddTaskController'
  }).
  when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'UserListController'
  }).
  when('/users/:userid', {
    templateUrl: 'partials/user.html',
    controller: 'UserController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
