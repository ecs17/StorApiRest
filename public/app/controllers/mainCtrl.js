angular.module('mainCtrl', [])

.controller('homeController', function($rootScope, $location, Auth, $scope, $state, $window, UserNow){
    if($rootScope.userNow.type === undefined){
        $rootScope.loginClass = 'margin-left: 0px;';
        $state.go('login');
    } else{
        $rootScope.loginClass = '';
    }
})

.controller('mainController', function($rootScope, $location, Auth, $scope, $state, $stateParams, $window, UserNow){

    //Start
       /* $scope.msg = {};
        var handleCallback = function (msg) {
            $scope.$apply(function () {
                $scope.msg = JSON.parse(msg.data)
            });
        }

        var source = new EventSource('/stats');
        source.addEventListener('message', handleCallback, false);*/
    //End


    var vm = this;
    $rootScope.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams){
        $rootScope.loggedIn = Auth.isLoggedIn();
        if($rootScope.loggedIn){
            console.log('if loggedIn here');
            $("#wrapper").removeClass("no-page-wrapper");
            $("#page-wrapper").removeClass("no-page-wrapper");
            //$("body").animate({marginTop: 50});
            $rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
            console.log($rootScope.userNow);
            /*if (toState.redirectTo) {
                console.log('if redirectTo here');
                event.preventDefault();
                $state.go(toState.redirectTo, toParams)
            }*/
        } else{
            console.log('else loggedIn here');
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
                console.log('doLogin if here');
                $scope.userNow = data;
                $state.go('home.test');
                event.preventDefault();
                //$location.path('/home');
                //$scope.$emit('someEvent');
                //$state.reload();
                
            }else{
                $scope.error = data.message;
            }
        });
    };
    
    $scope.goLogin = function(){
        console.log('goLogin here');
        $rootScope.loginClass = 'margin-left: 0px;'
        $state.go('login');
    }
    
    $scope.doLogout = function(){
        Auth.logout();
        $scope.user = {};
        $state.go('login');
    };
    
    //Funcion para abrir estado en modal.window
    /*$scope.openModal = function(){
        var url = $state.href('startSale');
        var left = screen.width / 2 - 200, top = screen.height / 2 - 250;
        $window.open(url, '', 'width=400,height=500');
        $scope.$state = $state;
    };*/
}).controller('TestCtrl', function($rootScope, $scope, $state, $window, Product, Sale, Client, Credit, User, $filter, ngTableParams){
    $scope.childrenTableParams = new ngTableParams({
        page: 1,    // show first page
        count: 10    // count per page
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            $defer.resolve($scope.selectedParent.sDetail.detailSale.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
});

function Ctrl404($scope, $rootScope, $location) {}