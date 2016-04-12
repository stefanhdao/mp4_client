var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users');
        },
        getUser : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/users/' + id);
        },
        postNewUser : function(object)
        {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/users/', object);
        },
        deleteUser : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/users/' + id);
        }
    }
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/tasks');
        },
        getTask : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log('I hope we didnt fuck up')
            return $http.get(baseUrl+'/api/tasks/' + id);
        },
        getTasksFiltered : function(parameters) {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log('I hope we didnt fuck up')
            return $http.get(baseUrl+'/api/tasks/', { params : parameters});
        },
        deleteTask : function(id) {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.delete(baseUrl+'/api/tasks/' + id);
        },
        postTask : function(object)
        {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.post(baseUrl+'/api/tasks/', object);
        },
        updateTask : function(object)
        {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.put(baseUrl+'/api/tasks/' + object._id, object);
        }
    }
});
