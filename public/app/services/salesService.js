angular.module('salesService', ['ngResource'])

.factory('Sale', ['$http', function($http){
    var saleFactory = {};

    saleFactory.saveSale = function(sale){
        return $http.post('/api/sale', sale);
    }
    
    return saleFactory;
}]);