'use strict';

/* Service */
/*http://docs.angularjs.org/api/ngResource.$resource*/
angular.module('RecordDiv', [])

.directive('record', function ($window) {
    return function(scope, element){
        var w = angular.element(element).context;
        w.onresize = function () {
            scope.$apply();
        };
        
        scope.$watch(function () {
            return w.clientHeight;
        }, function () {
            return scope.resize(w);
        });
        
        scope.$watch(function() {
            return w.scrollHeight
        }, function() {
            scope.resize(w);
        }, true);
        
        scope.resize = function(div){
            if(div.clientHeight >= 80)
                if(div.scrollHeight <= 80) {
                    scope.heightRecord = 0;
                } else {
                    scope.heightRecord = "height:80px; overflow:auto;";
                }
            else
                scope.heightRecord = div;
        }
    }
})