angular.module('catalogService', ['ngResource'])

.factory('UserType', ['$http', function($http){
    var userTCFactory = {};
    userTCFactory.get = function(){
        var typeUsers = $http.get('/api/userTypeCatalog/');
        return typeUsers;
    };
    
    return userTCFactory;
}])
.factory('ClientType', ['$http', function($http){
    var clientTCFactory = {};
    clientTCFactory.get = function(){
        var typeClients = $http.get('/api/clientTypeCatalog/');
        return typeClients;
    };
    
    return clientTCFactory;
}])
.factory('ClientType', ['$http', function($http){
    var clientTCFactory = {};
    clientTCFactory.get = function(){
        var typeClients = $http.get('/api/clientTypeCatalog/');
        return typeClients;
    };
    
    return clientTCFactory;
}])
.factory('ProductPres', ['$http', function($http){
    var  productPresFactory = {};
    productPresFactory.get = function(){
        return $http.get('/api/catlg_prodPres/');
    };
    return productPresFactory;
}])
.factory('MeasureType', ['$http', function($http){
    var measureTypeFactory = {};
    measureTypeFactory.get = function(){
        return $http.get('/api/measureType_prod/');
    };
    return measureTypeFactory;
}])
.factory('ProviderType', ['$http', function($http){
    var providerTCFactory = {};
    providerTCFactory.get = function(){
        var typeProvider = $http.get('/api/providerTypeCatalog/');
        return typeProvider;
    };
    
    return providerTCFactory;
}])
.factory('ProviderStatus', ['$http', function($http){
    var providerSFactory = {};
    providerSFactory.get = function(){
        var statusProvider = $http.get('/api/providerStatusCatalog/');
        return statusProvider;
    };
    
    return providerSFactory;
}]);