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
.directive('quantity', function () {
    return {
		require: 'ngModel',
        link: function (scope) {
            scope.$watch('productRow.quantity', function(newValue, oldValue){
                if(scope.productRow.typeMeasure === 1)
                    scope.productRow.quantity = String(newValue).replace(/[^0-9]/g, '');
                else
                    checkFloat(newValue);

                if (isNaN(newValue)) {
                    if(typeof newValue === 'undefined')
                        scope.productRow.quantity = '';
                    else
                        scope.productRow.quantity = oldValue;
                }
            });

            function checkFloat(newValue){
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) 
                    return;
                if (arr.length === 2 && newValue === '-.') 
                    return;
            }
        }
    }
})
.directive('stoksNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope) {	
			scope.$watch('product.stocks', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue) && scope.product !== undefined) {
                    if(typeof newValue === 'undefined')
                        scope.product.stocks = '';
                    else
                        scope.product.stocks = oldValue;
                }
            });	
			scope.$watch('product.taxes.iva', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue) && scope.product !== undefined) {
                    if(typeof newValue === 'undefined')
                        scope.product.taxes.iva = '';
                    else
                        scope.product.taxes.iva = oldValue;
                }
            });	
			scope.$watch('product.taxes.ieps', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue) && scope.product !== undefined) {
                    if(typeof newValue === 'undefined')
                        scope.product.taxes.ieps = '';
                    else
                        scope.product.taxes.ieps = oldValue;
                }
            });	
			scope.$watch('product.price.purchase_price', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue) && scope.product !== undefined) {
                    if(typeof newValue === 'undefined')
                        scope.product.price.purchase_price = '';
                    else
                        scope.product.price.purchase_price = oldValue;
                }
            });	
			scope.$watch('product.price.sale_price', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue) && scope.product !== undefined) {
                    if(typeof newValue === 'undefined')
                        scope.product.price.sale_price = '';
                    else
                        scope.product.price.sale_price = oldValue;
                }
            });	
			scope.$watch('payWith', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue)) {
                    if(typeof newValue === 'undefined')
                        scope.payWith = '';
                    else
                        scope.payWith = oldValue;
                }
            });	
			scope.$watch('paymentNow', function(newValue,oldValue) {
                check(newValue);
                if (isNaN(newValue)) {
                    if(typeof newValue === 'undefined')
                        scope.paymentNow = '';
                    else
                        scope.paymentNow = oldValue;
                }
            });
            function check(newValue){
                var arr = String(newValue).split("");
                if (arr.length === 0)
                    return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) 
                    return;
                if (arr.length === 2 && newValue === '-.') 
                    return;
            }
		}
	};
});