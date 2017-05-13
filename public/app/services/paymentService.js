angular.module('paymentService', ['ngResource'])

.factory('Payment', ['$http', function($http){
    var paymentFactory = {};

    paymentFactory.save = function(payment){
        return $http.post('/api/payment', payment);
    };

    return paymentFactory;
}]);