function ProductCtrl($rootScope, $scope, Product, $window, $filter, ngTableParams){
    $scope.processing = true;
    $scope.products = {}
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    Product.all().success(function(data){
        $scope.processing = false;
        $scope.products = data;
        loadTable($scope, $filter, $scope.products, ngTableParams);
    });
}
function CreateProductCtrl($rootScope, $scope, ProductPres, MeasureType, Product) {
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
    
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
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
            $scope.processing = false;
            $scope.product = {};
            $scope.message = data.message;
            $scope.presentation_type = {};
            $scope.measure_type = {};
        })
    }

}