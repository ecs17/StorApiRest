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
}]);