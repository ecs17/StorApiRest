angular.module('productService', ['ngResource'])

.factory('Product', ['$http', function($http){
    var productFactory = {};
    
    productFactory.create = function(productData){
        return $http.post('/api/product', productData);
    };
    
    productFactory.all = function(){
        return $http.get('/api/product');
    };
    
    productFactory.update = function(productId, product){
        return $http.put('/api/product/' + productId, product);
    };
    
    productFactory.get = function(id){
        return $http.get('/api/product/' + id);
    };
    
    productFactory.delete = function(id){
        return $http.delete('/api/product/' + id);
    }
    
    productFactory.getSearch = function(anyField){
        return $http.get('/api/product/search/' + anyField);
    }
    
    return productFactory;
}])