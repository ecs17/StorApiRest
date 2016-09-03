angular.module('clientService', ['ngResource'])

.factory('Client', ['$http', function($http){
    var clientFactory = {};

    clientFactory.getSearch = function(anyField){
        return $http.get('/api/client/search/' + anyField);
    }
    
    clientFactory.get = function(id){
        return $http.get('/api/clients/' + id);
    };
    
    clientFactory.all = function(){
        var all = $http.get('/api/client/');
        return all;
    };
    
    clientFactory.create = function(clientData){
        return $http.post('/api/client/', clientData);
    };
    
    clientFactory.update = function(id, clientData){
        return $http.put('/api/clients/' + id, clientData);
    };
    
    clientFactory.delete = function(id){
        return $http.delete('/api/clients/' + id);
    };

    clientFactory.updateStatusToCredit = function(idClient){
        return $http.put('/api/clientupdatcredit/' + idClient);
    }

    return clientFactory;
}])