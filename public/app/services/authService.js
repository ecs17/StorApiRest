angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken){
    var authFactory = {};
    
    authFactory.login = function(userName, password){
        return $http.post('/api/authenticate', {
            userName: userName,
            password: password
        }).success(function(data){
            AuthToken.setToken(data);
            /*$http.get('/');
            $http.get('/app/cssapp/custom.min.css');
            $http.get('/assets/js/angular/angular.min.js');
            $http.get('/assets/js/angular/angular-route.js');
            $http.get('/assets/js/angular/angular-resource.min.js');
            $http.get('/assets/js/angular/angular-animate.js');
            $http.get('/assets/js/angular/angular-ui-router.js');
            $http.get('/assets/js/angular/angucomplete-alt.js');
            $http.get('/assets/js/bootstrap/bootstrap.min.js');
            $http.get('/assets/js/angular/angucomplete-alt.js');
            $http.get('/assets/js/jquery/jquery.js');
            $http.get('/assets/js/bootstrap/bootstrap.min.js');
            $http.get('/assets/js/angular/ui-bootstrap-tpls-2.1.3.min.js');
            $http.get('/app/jsapp/custom.js');
            $http.get(' /app/jsapp/utils.js');
            $http.get('/app/jsapp/app.js');*/
            //$http.get('/api/me', {cache : true});
            return data;
        })
    };
    
    authFactory.logout = function(){
        AuthToken.setToken();
    };
    
    authFactory.isLoggedIn = function(){
        if(AuthToken.getToken())
            return true;
        else
            return false;
    };
    
    authFactory.getUser = function(){
        if(AuthToken.getToken())
            return $http.get('/api/me', {cache : true});
        else
            return $q.reject({ message: 'User has no token.'});
    };
    
    return authFactory;
})

.factory('AuthToken', function($window){
    var authTokenFactory = {};
    
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };
    
    authTokenFactory.setToken = function(data){
        if(data && data.token){
            var userData = {id: data._id, userName: data.userName, name: data.name, type: data.type};
            $window.localStorage.setItem('token', data.token);
            $window.localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('userData');
        }
    };
    
    return authTokenFactory;
})

.factory('AuthInterceptor', ['$q', '$location', 'AuthToken', '$injector', function($q, $location, AuthToken, $injector){
    var interceptorFactory = {};
    
    interceptorFactory.request = function(config){
        var token = AuthToken.getToken();
        if(token)
            config.headers['x-access-token'] = token;
        
        return config;
    };
    
    interceptorFactory.responseError = function(response){
        if(response.status == 403)
            $injector.get('$state').go('login')
//            $state.go('login')
            $location.path('/login');
        
        return $q.reject(response);
    };
    
    return interceptorFactory;
}]);