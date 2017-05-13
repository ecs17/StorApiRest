'use strict';
angular.module('casantApp', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'authService', 'mainCtrl', 'userService',
    'catalogService', 'ngTable', 'BarCodeValidator', 'DinamicTab', 'productService', 'angucomplete-alt', 'salesService',
    'clientService', 'creditService', 'providerService', 'devChangeProdService', 'paymentService', 'RecordDiv', 'cgBusy']);

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
    ['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $locationProvider.html5Mode({enabled:true});
            
            $urlRouterProvider
                //.when('index.html', '/home')
                //.when('', '/home')
                .when('', '/home')
                .when('/', '/home')
                //.when('/main', '/home')
            
            $stateProvider
            
            /*.state('home', {
                redirectTo: '',
                url: '/main',
                templateUrl: '<h1>Principal</h1>',
                //controller: 'homeController'
            })*/
            .state('home', {
                abstract: true,
                url: '/home',
                template: '<ui-view/>'
            })
            .state('home.test', {
                url: '',
                views: {
                    'homeMain': {
                        templateUrl: 'app/views/pages/home.html',
                        controller: 'homeController'
                    }
                }
            })
            /*.state('home', {
                url: '/home',
                templateUrl: 'app/views/pages/home.html',
                controller: 'homeController'
            })*/
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
            .state('salesReport', {
                url: '/saleReport',
                templateUrl: 'app/views/pages/sales/salesReport.html',
                controller: SalesReportCtrl
            })
            .state('accountCredit', {
                url: '/accountCredit',
                templateUrl: 'app/views/pages/sales/creditClient.html',
                controller: AccountCreditCtrl
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
            .state('devAndChanges', {
                url: '/devAndChanges',
                templateUrl: 'app/views/pages/products/devChangsProd.html',
                controller: DevChangProdCtrl
            })
            .state('providers', {
                url: '/providers',
                templateUrl: 'app/views/pages/providers/all.html',
                controller: ProviderCtrl
            })
            .state('createprovider', {
                url: '/createprovider',
                templateUrl: 'app/views/pages/providers/newAndUpdate.html',
                controller: CreateProviderCtrl
            })
            .state('editProvider', {
                url: '/editProvider/:idProvider',
                templateUrl: 'app/views/pages/providers/newAndUpdate.html',
                controller: EditProviderCtrl
            })
            .state('nopermission', {
                url: 'noPermission',
                templateUrl: 'app/views/pages/noPermission.html'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'app/views/pages/404.html',
                controller: Ctrl404
            });
            
        }
     ])
     .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ])