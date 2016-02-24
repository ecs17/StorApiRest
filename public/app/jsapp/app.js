'use strict';
angular.module('casantApp', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'authService', 'mainCtrl', 'userService', 'catalogService', 'ngTable', 'BarCodeValidator', 'productService']);

angular.module('casantApp').config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
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
            .state('nopermission', {
                url: 'noPermission',
                templateUrl: 'app/views/pages/noPermission.html'
            })
            .state('startSale', {
                url: '/sale',
                templateUrl: 'app/views/pages/sales/sale.html',
                constroller: SaleCtrl
            })
            
        }
     ])