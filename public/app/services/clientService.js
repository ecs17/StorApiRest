angular.module('clientService', ['ngResource'])

.factory('Client', ['$http', function($http){
    var clientFactory = {};

    clientFactory.getSearch = function(anyField){
        return $http.get('/api/client/search/' + anyField);
    }

    return clientFactory;
}])