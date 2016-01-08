angular.module('BarCodeValidator', [])
.directive('barCode', [function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelBarCode){
            function fromProdcut(text){
                if(text){
                    var transInput = text.replace(/[^0-9]/g, '');
                    if(transInput !== text){
                        ngModelBarCode.$setViewValue(transInput);
                        ngModelBarCode.$render();
                    }
                    return transInput;
                }
                return undefined;
            }
            ngModelBarCode.$parsers.push(fromProdcut);
        }
    }
}])