angular.module('creditService', ['ngResource'])

.factory('Credit', ['$http', function($http){
    var creditFactory = {};

    creditFactory.saveCredir = function(credit){
        return $http.post('/api/credit', credit);
    };
    
    creditFactory.update = function(creditId, credit){
        return $http.put('/api/credit/' + creditId, credit);
    };

    creditFactory.getByidClient = function(idClient){
        return $http.get('/api/credit/' + idClient);
    };
    
    return creditFactory;
}]);