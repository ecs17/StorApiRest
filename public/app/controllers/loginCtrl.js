function LoginCtrl($rootScope, $location, Auth){
    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    vm.usersito = 'Nadie';
    $rootScope.$on('$routeChangeStart', function(){
        vm.loggedIn = Auth.isLoggedIn();
        
        Auth.getUser().then(function(data) {
            vm.user = data;
        });
    });
    
    vm.doLogin = function() {
        vm.processing = true;
        vm.usersito = 'Nadie';
        vm.error = '';
        Auth.login(vm.loginData.userName, vm.loginData.password).success(function(data){
            vm.processing = false;
            if(data.success){
                $location.path('/users');
                vm.usersito = data.name;
            }else{
                vm.error = data.message;
            }
        });
    };
    
    vm.doLogout = function(){
        Auth.logout();
        
        vm.user = {};
        $location.path('/login');
    };
}