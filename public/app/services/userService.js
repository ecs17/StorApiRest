angular.module('userService', ['ngResource'])

.factory('User', ['$http', function($http){
    var userFactory = {};

    userFactory.getSearch = function(anyField){
        return $http.get('/api/users/search/' + anyField);
    }
    
    userFactory.get = function(id){
        return $http.get('/api/users/' + id);
    };
    
    userFactory.all = function(){
        var all = $http.get('/api/users/');
        return all;
    };
    
    userFactory.create = function(userData){
        return $http.post('/api/users/', userData);
    };
    
    userFactory.update = function(id, userData){
        return $http.put('/api/users/' + id, userData);
    };
    
    userFactory.delete = function(id){
        return $http.delete('/api/users/' + id);
    };
    
    return userFactory;
}])

.factory('UserNow', function(){
    return {
        id: '',
        name: '',
        userName: ''
    }
});