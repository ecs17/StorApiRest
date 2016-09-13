function DevChangProdCtrl($rootScope, $scope, $state, $window, $filter, Product, Provider, DevChangProd, $uibModal){
    $scope.processing = true;
    $scope.clients = {};
    $scope.transactData = {
        idUser: 0,
        idProvider: 0,
        bar_code: 0,
        stoksNow: 0,
        stoksNew: 0,
        typeTransact: 0,
        refund: 0,
        change: 0,
        obs: ''
    };
    $scope.notMove = false;
    $scope.prodisSelected = false;
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }

    $scope.selectedProduct = function(object){
        if(object !== undefined){
            var prodSelected = object.originalObject;
            $scope.prodSel = {
                _id: prodSelected._id,
                bar_code: prodSelected.bar_code,
                name_prod: prodSelected.name_prod,
                stocks: prodSelected.stocks
            }
            $scope.stocksOrig = prodSelected.stocks;
            $scope.prodisSelected = true;
        }
    }
    
    $scope.loadProducts = function (str) {
        if (str.length > 0) {
            Product.getSearch(str).success(function (data) {
                $scope.productList = data;
                if($scope.productList.length == 1 && $scope.productList[0].bar_code == str){
                    $('#searchProd_value').keyup();
                }
            });
        }
    }

    $scope.selectedProvider = function(object){
        if(object !== undefined)
            $scope.provSelected = object.originalObject;
    }
    
    $scope.loadProviders = function (str) {
        if (str.length > 0) {
            Provider.getSearch(str).success(function (data) {
                $scope.proviertList = data;
            });
        }
    }

    $scope.closeAlert = function(){
        $scope.notMove = false;
    }

    $scope.changeRefund = function(){
        $scope.prodSel.stocks = $scope.stocksOrig;
        $scope.prodSel.stocks = $scope.prodSel.stocks - $scope.refund;
    }

    $scope.confirmTransact = function(){
        $scope.isdev = false;
        $scope.ischang = false;
        $scope.devAndChang = false;
        if(($scope.refund === undefined || $scope.refund === 0 || $scope.refund === '')
            && ($scope.change === undefined || $scope.change === 0 || $scope.change === '')){
            $scope.notMove = true;
        } else {
            $scope.isdev = (($scope.refund === undefined || $scope.refund === 0 || $scope.refund === '') ? false : true);
            $scope.ischang = (($scope.change === undefined || $scope.change === 0 || $scope.change === '') ? false : true);
            if($scope.isdev && $scope.ischang){
                $scope.devAndChang = true;
                $scope.isdev = false;
                $scope.ischang = false;
            }
            $scope.miSaveTrans = $uibModal.open({
                animation: true,
                templateUrl: 'confirmTrans.html',
                scope: $scope,
                windowClass: 'modal-md'
            });
        }
    }

    $scope.cancel = function(){
        $scope.miSaveTrans.dismiss('cancel');
    }

    $scope.saveTransact = function(){
        console.log($scope.refund === undefined || $scope.refund === '' ? 0 : $scope.refund)
        $scope.miSaveTrans.dismiss('ok');
        $scope.transactData.idUser = $rootScope.userNow.id;
        $scope.transactData.idProvider = $scope.provSelected.idProvider;
        $scope.transactData.bar_code = $scope.prodSel.bar_code;
        $scope.transactData.stoksNow = $scope.stocksOrig;
        $scope.transactData.stoksNew = $scope.prodSel.stocks;
        $scope.transactData.refund = parseFloat($scope.refund === undefined || $scope.refund === '' ? 0 : $scope.refund);
        $scope.transactData.change = parseFloat($scope.change === undefined || $scope.change === '' ? 0 : $scope.change);
        $scope.transactData.obs = $scope.obs;
        if($scope.isdev || $scope.devAndChang){
            Product.updateStokProduct($scope.prodSel).success(function(dataProd){
                DevChangProd.saveTransact($scope.transactData).success(function(dataDevChang){
                    console.log(dataDevChang.message);
                    $scope.clearData();
                });
            });
        } else {
            DevChangProd.saveTransact(transactData).success(function(dataDevChang){
                console.log(dataDevChang.message);
                $scope.clearData();
            });
        }
    }

    $scope.clearData = function(){
        $scope.transactData = {
            idUser: 0,
            idProvider: 0,
            bar_code: 0,
            stoksNow: 0,
            stoksNew: 0,
            typeTransact: 0,
            refund: 0,
            change: 0,
            obs: ''
        };
        $scope.refund = '';
        $scope.change = '';
        $scope.obs = '';
        $scope.stocksOrig = 0;
        $scope.prodSel = {};
        $scope.provSelected = {};
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.processing = true;
        $scope.notMove = false;
        $scope.prodisSelected = false;
    }
}