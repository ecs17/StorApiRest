function ProductCtrl($rootScope, $scope, Product, $window, $filter, $state, ngTableParams){
    $scope.processing = true;
    $scope.products = {}
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    Product.all().success(function(data){
        $scope.processing = false;
        $scope.products = data;
        loadTable($scope, $filter, $scope.products, ngTableParams);
    });
    
    $scope.deleteProduct = function(id){
        $scope.processing = true;
        
        Product.delete(id).success(function(data){
            Product.all().success(function(data){
                $scope.processing = false;
                $scope.products = data;
                loadTable($scope, $filter, $scope.products, ngTableParams);
            });
        });
    };
}
function CreateProductCtrl($rootScope, $scope, ProductPres, MeasureType, Product, $state) {
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    $scope.product = {
        stocks: '',
        taxes: {
            iva: '',
            ieps: ''
        },
        price: {
            purchase_price: '',
            sale_price: ''
        }
    };
    $scope.typeTask = 'create';
    $scope.items = {
        openexp: false
    };
    ProductPres.get().success(function (data) {
        $scope.preseType = data;
    });
    MeasureType.get().success(function (data) {
        $scope.measureType = data;
    });
    
//    $scope.disabled = function (date, mode) {
//        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
//    };
    
    $scope.chageDateExp = function (exp) {
        $scope.product.expDate = exp.toISOString();
    }
    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.items.openexp = true;
    };
    
    $scope.saveProduct = function(){
        $scope.product.presentation_type = {
            abbrev: $scope.presentation_type.abbrev,
            description: $scope.presentation_type.description,
            idType: $scope.presentation_type.idType
        };
        
        $scope.product.measure_type = {
            abbrev: $scope.measure_type.abbrev,
            description: $scope.measure_type.description,
            idType: $scope.measure_type.idType
        };
        
        Product.create($scope.product).success(function(data){
            $state.go('products')
            $scope.processing = false;
            $scope.product = {};
            $scope.message = data.message;
            $scope.presentation_type = {};
            $scope.measure_type = {};
        })
    }
    
    $scope.$watch('product.taxes', function(){
        if($scope.product !== undefined && $scope.product.price.purchase_price !== undefined){
            $scope.product.price.sale_price = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
            $scope.priceSug = $scope.product.price.sale_price;
        }
    }, true);
    
    $scope.$watch('product.price.purchase_price', function(){
        if($scope.product !== undefined && $scope.product.price.purchase_price !== undefined){
            $scope.product.price.sale_price = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
            $scope.priceSug = $scope.product.price.sale_price;
        }
    })

}

function AddStocksCtrl($rootScope, $scope, Product, $window, $filter, ngTableParams, $state){
    $scope.processing = true;
    $scope.startEdit = true;
    $scope.product = {}
    $scope.prodTemp = {};
    $scope.oldProd = {};
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    Product.all().success(function(data){
        $scope.processing = false;
        $scope.products = data;
        $scope.originProd = angular.copy(data);
        loadTable($scope, $filter, $scope.products, ngTableParams);
    });
    
    $scope.saveProdTemp = function(pt){
        $scope.prcodTemp = angular.copy(pt);
    }
    
    $scope.cancelSave = function(prod){
        if($scope.prcodTemp.stocks != prod.stocks || $scope.prcodTemp.dates.expiration != prod.dates.expiration || $scope.prcodTemp.price.purchase_price != prod.price.purchase_price || $scope.prcodTemp.price.sale_price != prod.price.sale_price)
            $state.reload();
    }
    
    $scope.saveProduct = function(prod){
        
        Product.update(prod._id, prod).success(function(data){
            $scope.processing = false;
            $scope.message = data.message;
        })
    }
    
    $scope.items = {
        openexp: false
    };
    
    $scope.chageDateExp = function (exp) {
        $scope.product = {
            dates: {
                expiration: exp.toISOString()
            }
        };
    }
    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.items.openexp = true;
    };
}

function EditProductCtrl($rootScope, $scope, $stateParams, Product, $window, ProductPres, MeasureType, $state){
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    var flagTax = false;
    var flagPrc = false;
    $scope.priceInvalid = false;
    $scope.typeTask = 'edit';
    ProductPres.get().success(function (data) {
        $scope.preseType = data;
    });
    MeasureType.get().success(function (data) {
        $scope.measureType = data;
    });
    
    Product.get($stateParams.productId).success(function(data){
        $scope.presentation_type = (_.where($scope.preseType, {idType: data.presentation_type.idType}))[0];
        $scope.measure_type = (_.where($scope.measureType, {idType: data.measure_type.idType}))[0];
        $scope.product = data;
        $scope.product.expDate = $scope.product.dates.expiration;
    });
    
    $scope.items = {
        openexp: false
    };
    
    $scope.chageDateExp = function (exp) {
        $scope.product.expDate = exp.toISOString();
    }
    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.items.openexp = true;
    };
    
    $scope.saveProduct = function(){
        $scope.processing = true;
        $scope.message = '';
        
        $scope.product.presentation_type = {
            abbrev: $scope.presentation_type.abbrev,
            description: $scope.presentation_type.description,
            idType: $scope.presentation_type.idType
        };
        
        $scope.product.measure_type = {
            abbrev: $scope.measure_type.abbrev,
            description: $scope.measure_type.description,
            idType: $scope.measure_type.idType
        };
        
        Product.update($stateParams.productId, $scope.product).success(function(data){
            $scope.processing = false;
            $scope.product = {};
            $scope.message = data.message;
            $scope.presentation_type = {};
            $scope.measure_type = {};
            if(data.message == 'Producto Actualizado')
                $state.go('products');
        })
    }
    
    $scope.$watch('product.taxes', function(){
        if($scope.product !== undefined && $scope.product.price.purchase_price !== undefined){
            if(flagTax){
                $scope.product.price.sale_price = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
                $scope.priceSug = $scope.product.price.sale_price;
            } else {
                $scope.priceSug = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
            }
            flagTax = true;
        }
    }, true);
    
    $scope.$watch('product.price.purchase_price', function(){
        if($scope.product !== undefined && $scope.product.price.purchase_price !== undefined){
            if(flagPrc){
                $scope.product.price.sale_price = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
                $scope.priceSug = $scope.product.price.sale_price;
            } else {
                $scope.priceSug = getPrice_iva_ipes($scope.product.price.purchase_price, $scope.product.taxes.iva, $scope.product.taxes.ieps);
            }
            flagPrc = true;
        }
    });
    
    $scope.$watch('product.price.sale_price', function(){
        if($scope.product !== undefined){
            if($scope.product.price.sale_price < $scope.product.price.purchase_price)
                $scope.priceInvalid = true;
            else
                $scope.priceInvalid = false;
        }
    });
}