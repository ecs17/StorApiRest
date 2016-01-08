angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth, $scope, $state, $window, UserNow){
    var vm = this;
    $rootScope.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$stateChangeStart', function(){
        $rootScope.loggedIn = Auth.isLoggedIn();
        if($rootScope.loggedIn){
            $("#wrapper").removeClass("no-page-wrapper");
            $("#page-wrapper").removeClass("no-page-wrapper");
            $("body").animate({marginTop: 50});
            $rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
            console.log($rootScope.userNow);
        } else{
            $("#wrapper").addClass("no-page-wrapper");
            $("#page-wrapper").addClass("no-page-wrapper");
            $("body").animate({marginTop: 0});
        }
        
        Auth.getUser().then(function(data) {
            $scope.user = data;
        });
    });
    
    $scope.doLogin = function() {
        $scope.processing = true;
        $scope.usersito = 'Nadie';
        $scope.error = '';
        Auth.login($scope.loginData.userName, $scope.loginData.password).success(function(data){
            $scope.processing = false;
            if(data.success){
                $state.go('home');
                $scope.userNow = data;
            }else{
                $scope.error = data.message;
            }
        });
    };
    
    $scope.goLogin = function(){
        $state.go('login');
    }
    
    $scope.doLogout = function(){
        Auth.logout();
        $scope.user = {};
        $state.go('login');
    };
});