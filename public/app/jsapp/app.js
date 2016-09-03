'use strict';
angular.module('casantApp', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'authService', 'mainCtrl', 'userService',
    'catalogService', 'ngTable', 'BarCodeValidator', 'DinamicTab', 'productService', 'angucomplete-alt', 'salesService',
    'clientService', 'creditService']);

angular.module('casantApp').config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});

angular.module('casantApp').run(function($rootScope, $uibModal, $state, $window) {
    $rootScope.modal = true;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
        if($rootScope.userNow.type === undefined && toState.name !== 'login'){
            $state.go('login');
        } else if(fromState.name === 'startSale' && $rootScope.userNow.type !== undefined){
            console.log("Change State")
            if ($rootScope.modal) {
                event.preventDefault();
                $rootScope.modal = false;
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/views/pages/templates/modalChange.html'
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log('changing state to:'+ toState.name);
                    $state.go(toState, {}, {reload:true});
                }, function() {
                    console.log('going back to state:'+ fromState.name);
                    $state.go(fromState, {}, {reload:false});
                });
            } else {
                $rootScope.modal = true;
            }
        }
    })
});

angular.module('casantApp').config(
    ['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            
            $urlRouterProvider
                .when('', '/home')
                .when('/', '/home');
            
            $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/views/pages/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'app/views/pages/users/all.html',
                controller: UserCtrl
            })
            .state('create', {
                url: '/create',
                templateUrl: 'app/views/pages/users/single.html',
                controller: CreateUserCtrl
            })
            .state('edituser', {
                url: '/editUser/:userId',
                templateUrl: 'app/views/pages/users/single.html',
                controller: EditUserCtrl
            })
            .state('products', {
                url: '/products',
                templateUrl: 'app/views/pages/products/all.html',
                controller: ProductCtrl
            })
            .state('newProduct', {
                url: '/createProduct',
                templateUrl: 'app/views/pages/products/newAndUpdate.html',
                controller: CreateProductCtrl
            })
            .state('addStocks', {
                url: '/addStocks',
                templateUrl: 'app/views/pages/products/addStocks.html',
                controller: AddStocksCtrl
            })
            .state('editProduct', {
                url: '/editProduct/:productId',
                templateUrl: 'app/views/pages/products/newAndUpdate.html',
                controller: EditProductCtrl
            })
            .state('startSale', {
                url: '/sale',
                templateUrl: 'app/views/pages/sales/sale.html',
                controller: SaleCtrl
            })
            .state('clients', {
                url: '/clients',
                templateUrl: 'app/views/pages/clients/all.html',
                controller: ClientCtrl
            })
            .state('createclient', {
                url: '/createclient',
                templateUrl: 'app/views/pages/clients/newAndUpdate.html',
                controller: CreateClientCtrl
            })
            .state('editclient', {
                url: '/editClient/:idClient',
                templateUrl: 'app/views/pages/clients/newAndUpdate.html',
                controller: EditClientCtrl
            })
            .state('nopermission', {
                url: 'noPermission',
                templateUrl: 'app/views/pages/noPermission.html'
            })
            
        }
     ])