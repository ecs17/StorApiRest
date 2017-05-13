angular.module('salesService', ['ngResource'])

.factory('Sale', ['$http', function($http){
    var saleFactory = {};

    saleFactory.saveSale = function(sale){
        return $http.post('/api/sale', sale);
    }

    saleFactory.getSaleBySelection = function(datasearch){
        return $http.get('/api/sale/' + JSON.stringify(datasearch));
    }
    
    return saleFactory;
}]);