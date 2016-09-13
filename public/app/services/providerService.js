angular.module('providerService', ['ngResource'])

.factory('Provider', ['$http', function($http){
    var providerFactory = {};

    providerFactory.getSearch = function(anyField){
        return $http.get('/api/provider/search/' + anyField);
    }
    
    providerFactory.get = function(id){
        return $http.get('/api/provider/' + id);
    };
    
    providerFactory.all = function(){
        var all = $http.get('/api/providers/');
        return all;
    };
    
    providerFactory.create = function(providerData){
        return $http.post('/api/providers/', providerData);
    };
    
    providerFactory.update = function(id, providerData){
        return $http.put('/api/provider/' + id, providerData);
    };
    
    providerFactory.delete = function(id){
        return $http.delete('/api/provider/' + id);
    };

    return providerFactory;
}])