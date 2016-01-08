angular.module('productService', ['ngResource'])

.factory('Product', ['$http', function($http){
    var productFactory = {};
    
    productFactory.create = function(productData){
        return $http.post('/api/product', productData);
    };
    
    return productFactory;
}])