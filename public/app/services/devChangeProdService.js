angular.module('devChangeProdService', ['ngResource'])

.factory('DevChangProd', ['$http', function($http){
    var devChangProdFactory = {};

    devChangProdFactory.saveTransact = function(transactData){
        return $http.post('/api/devAndChange', transactData);
    };

    return devChangProdFactory;
}])