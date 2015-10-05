angular.module('casantApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor')
})
/*.controller('userController', function(userFactory){
    var vm = this;
    
    userFactory.all()
        .success(function(data){
            vm.userData = data;
        });
});*/