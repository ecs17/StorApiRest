function CreateProductCtrl($rootScope, $scope, ProductPres, MeasureType, Product) {
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
        console.log($scope.product.expDate);
    }
    
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.items.openexp = true;
    };
    
    $scope.saveProduct = function(){
        console.log($scope.product);
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
        console.log($scope.product);
        
        Product.create($scope.product).success(function(data){
            $scope.processing = false;
            $scope.product = {};
            $scope.message = data.message;
            $scope.presentation_type = {};
            $scope.measure_type = {};
        })
    }

}