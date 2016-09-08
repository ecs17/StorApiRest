function SaleCtrl($rootScope, $scope, $state, $window, Product, $compile, $sce, $uibModal, $log, Sale, Client, Credit) {

    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    $scope.tabsSale = [
        {
            id: "tab1",
            name: "Venta 1",
            active: true,
            hasProducts: false,
            title: "Venta numero 1",
            listProductsToSales: [],
            subTotal: 0.0,
            ivaSales: 0.0,
            totalSales: 0.0
        }
    ];
    var indexToClose;
    var indexProdToDelete;

    $scope.isCredit = false;
    $('#ex4_value').focus();
    
    $scope.selectedProduct = function(object){
        var prodSelected = object.originalObject;
        var prodAlreadyExist = false;
        console.log(_.findWhere(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales, {bar_code: prodSelected.bar_code}));
        if(prodSelected.stocks === 0){
            console.log("product stocks 0 with bar_code: " + prodSelected.bar_code);
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'noStoksModal.html',
                scope: $scope,
                size: 'sm'
            });
        } else if(_.findWhere(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales, {bar_code: prodSelected.bar_code}) !== undefined
                    && (prodSelected.stocks - _.findWhere(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales, {bar_code: prodSelected.bar_code}).quantity) === 0) {
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'noStoksModal.html',
                scope: $scope,
                size: 'sm'
            });
        } else {
            _.each(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales, function(prod, index){
                if(prod.bar_code === prodSelected.bar_code){
                    prod.quantity += 1
                    prod.amount = prod.sale_price * prod.quantity;
                    prod.stocks = prodSelected.stocks;
                    prodAlreadyExist = true;
                }
            });
            if(!prodAlreadyExist){
                _.findWhere($scope.tabsSale, {active: true}).listProductsToSales.push({
                    _id: prodSelected._id,
                    bar_code: prodSelected.bar_code,
                    name_prod: prodSelected.name_prod,
                    sale_price: _.isUndefined(prodSelected.price) ? prodSelected.price : prodSelected.price.sale_price,
                    quantity: 1,
                    amount: prodSelected.price.sale_price,
                    stocks: prodSelected.stocks,
                    typeMeasure: prodSelected.measure_type.idType
                });
            }
            if(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales.length > 0){
                _.findWhere($scope.tabsSale, {active: true}).hasProducts = true;
            }
            getTotlaSales(_.findWhere($scope.tabsSale, {active: true}));
        }
    }
    
    $scope.loadProducts = function (str) {
        if (str.length > 0) {
            Product.getSearch(str).success(function (data) {
                $scope.productList = data;
                if($scope.productList.length == 1 && $scope.productList[0].bar_code == str){
                    $('#ex4_value').keyup();
                }
            });
        }
    }

    $scope.selectedClient = function(object){
        var clientSelected = object.originalObject;
        $scope.clientDetail = {
            name: "",
            idClient: 0,
            amountActual: 0,
            payment: 0,
            limitCredit: 0,
            debit: 0
        }
        Credit.getByidClient(clientSelected.idClient).success(function(data){
            var credit = data;
            console.log(credit)
            var cd =  {
                name: clientSelected.name + ' ' + clientSelected.ap1 + ' ' + clientSelected.ap2,
                idClient: clientSelected.idClient,
                _id: clientSelected._id,
                clientType: clientSelected.clientType,
                idCredit: credit.length > 0 ? credit[0].idCredit : 0, 
                amountActual: parseFloat(_.findWhere($scope.tabsSale, {active: true}).totalSales),
                debit: credit.length > 0 ? credit[0].amountCredit : 0,
                limitCredit: clientSelected.limitCredit
            }
            $scope.clientDetail = cd;
        });
        
    }

    $scope.loadClients = function (str) {
        if (str.length > 0) {
            Client.getSearch(str).success(function (data) {
                $scope.clientList = data;
            });
        }
    }
    
    $scope.activTab = function(i) {
        setAllInactive()
        $scope.tabsSale[i].active = true;
    };

    var setAllInactive = function () {
        _.each($scope.tabsSale, function (tabSale) {
            tabSale.active = false;
        });
    };

    var addNewSale = function () {
        var id = $scope.tabsSale.length + 1;
        $scope.tabsSale.push({
            id: "tab"+id,
            name: "Venta " + id,
            active: true,
            hasProducts: false,
            title: "Venta numero " +id,
            listProductsToSales: [],
            subTotal: 0.0,
            ivaSales: 0.0,
            totalSales: 0.0
        });
    };

    $scope.addTabSale = function () {
        setAllInactive();
        addNewSale();
    };
    
    $scope.changeQuantity = function(prodRow, tab){
        if((prodRow.stocks - prodRow.quantity) < 0){
            prodRow.quantity = prodRow.stocks;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'noStoksModal.html',
                scope: $scope,
                size: 'sm'
            });
        } else {
            if(prodRow.typeMeasure === 1){
                if(prodRow.quantity !== "" && String(prodRow.quantity).replace(/[^0-9]/g, '') == 0)
                    prodRow.quantity = 1;
                prodRow.amount = String(prodRow.quantity).replace(/[^0-9]/g, '') * prodRow.sale_price;
            } else {
                prodRow.amount = prodRow.quantity * prodRow.sale_price;
            }
            getTotlaSales(tab);
        }
    };
    
    $scope.removeTab = function (i, nameSale) {
        indexToClose = i;
        console.log("Removing tab: " + i);
        if($scope.tabsSale.length > 1){
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirmCloseSalesModal.html',
                scope: $scope,
                size: 'sm'
            });
        }
    };
    
    $scope.ok = function () {
        $scope.tabsSale.splice(indexToClose, 1);
        setAllInactive();
        $scope.tabsSale[$scope.tabsSale.length - 1].active = true;
        _.each($scope.tabsSale, function(tabSale, index){
            tabSale.id = "tab"+(index + 1);
            tabSale.name = "Venta " + (index + 1);
        })
        console.log($scope.tabsSale);
        $scope.modalInstance.dismiss('ok');
    };

    $scope.cancel = function () {
        $scope.modalInstance.dismiss('cancel');
        $('#ex4_value').focus();
    };
    
    var getTotlaSales = function(tabSalesActive){
        var total = 0;
        _.each(tabSalesActive.listProductsToSales, function(productToSales){
            total = total + productToSales.amount;
        });
        tabSalesActive.subTotal = total.toFixed(2);
        tabSalesActive.totalSales = total.toFixed(2);
    }

    $scope.cantProd = function(){
        console.log($event);
    }

    $scope.deletProductFromListSales = function(idxProd){
        indexProdToDelete = idxProd;
        console.log("Removing product: " + indexProdToDelete);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'confirmDeleteProdSalesModal.html',
            scope: $scope,
            size: 'sm'
        });
    }

    $scope.removeProd = function(){
        _.findWhere($scope.tabsSale, {active: true}).listProductsToSales.splice(indexProdToDelete, 1);
        $scope.modalInstance.dismiss('ok');
        if(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales.length == 0){
            _.findWhere($scope.tabsSale, {active: true}).hasProducts = false;
        }
        $('#ex4_value').focus();
    }

    $scope.collect = function(activBtnCollect){
        if(activBtnCollect){
            console.log("Cobrar  Productos");
            $scope.amountComplete = false;
            $scope.payWrong = false;
            $scope.limitWrong = false;
            $scope.clientEmpty = false;
            $scope.tSale = parseFloat(_.findWhere($scope.tabsSale, {active: true}).totalSales);
            $scope.payWith = $scope.tSale;
            $scope.cambio = 0;
            $scope.isCredit = false;
            $scope.clientDetail = {
                name: "",
                idClient: 0,
                amountActual: 0,
                payment: 0,
                limitCredit: 0,
                debit: 0
            }
            $scope.modalInstanceCollect = $uibModal.open({
                animation: true,
                templateUrl: 'confirmCollectModal.html',
                scope: $scope,
                windowClass: 'modal-md'
            });
            $('#fieldPayWith').focus();
        }
    }

    $scope.changePay = function(amount){
        $scope.payWith = parseFloat(amount);
        $scope.payWrong = false;
        $scope.clientDetail.amountActual = ($scope.tSale - $scope.payWith < 0 ? 0 : $scope.tSale - $scope.payWith);
        $scope.clientDetail.payment = $scope.payWith;
        if(amount >= $scope.tSale){
            $scope.amountComplete = true;
            $scope.cambio = $scope.payWith - $scope.tSale;
        } else {
            $scope.amountComplete = false;
            $scope.cambio = 0;
        }
    }

    $scope.closeAlert = function() {
        $scope.payWrong = false;
    }

    $scope.closeAlertLimitCredit = function() {
        $scope.limitWrong = false;
    }

    $scope.closeAlertMissClient = function() {
        $scope.clientEmpty = false;
    }

    $scope.typeSale = function(iscred){
        $scope.isCredit = iscred;
        if($scope.isCredit)
            $scope.payWith = 0;
        else
            $scope.payWith = $scope.tSale;
    }

    $scope.finishSale = function(){
        if(!$scope.isCredit){
            if($scope.amountComplete){
                $scope.saveSaleAndUpdateStoks();
            } else {
                $scope.payWrong = true;
            }
        } else {
            if($scope.clientDetail.limitCredit >= ($scope.clientDetail.debit + $scope.clientDetail.amountActual)){
                if($scope.clientDetail.idClient !== 0){
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'confirmSaleCredit.html',
                        scope: $scope,
                        size: 'sm'
                    });
                } else {
                    $scope.clientEmpty = true;
                }
            } else {
                $scope.overCharg = ($scope.clientDetail.debit + $scope.clientDetail.amountActual) - $scope.clientDetail.limitCredit;
                $scope.limitWrong = true;
            }
        }
    }

    $scope.saveSaleAndUpdateStoks = function(){
        if($scope.modalInstance !== undefined){
            $scope.modalInstance.dismiss('ok');
        }
        Product.updateStokProducts(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales).success(function(data){
            console.log(data.message);
            if(data.status === 'success'){
                var userActual = $rootScope.userNow;
                var sale = {
                    idUser: $rootScope.userNow.id,
                    idClient: $scope.isCredit ? $scope.clientDetail.idClient : 0,
                    comments: '',
                    typeSale: $scope.isCredit ? 2 : 1,
                    amountSale: $scope.tSale,
                    listProductsToSales: _.findWhere($scope.tabsSale, {active: true}).listProductsToSales
                };
                Sale.saveSale(sale).success(function(data){
                    console.log(data.message);
                    if(data.status === 'success'){
                        _.findWhere($scope.tabsSale, {active: true}).listProductsToSales = [];
                        _.findWhere($scope.tabsSale, {active: true}).hasProducts = false;
                        _.findWhere($scope.tabsSale, {active: true}).subTotal = 0.0,
                        _.findWhere($scope.tabsSale, {active: true}).ivaSales = 0.0,
                        _.findWhere($scope.tabsSale, {active: true}).totalSales = 0.0
                        if($scope.isCredit && !$scope.amountComplete){
                            if($scope.clientDetail.idCredit === 0){
                                var credit = {
                                    amountCredit: $scope.clientDetail.debit + $scope.clientDetail.amountActual,
                                    idClient: $scope.clientDetail.idClient,
                                    detailCredit: [{idSale: data.idSale, payment: $scope.payWith}]
                                }
                                Credit.saveCredir(credit).success(function(dataCredit){
                                    console.log(dataCredit.message);
                                    if($scope.clientDetail.clientType.idType !== 2){
                                        Client.updateStatusToCredit($scope.clientDetail.idClient).success(function(data){
                                            console.log(data.message)
                                            $scope.modalInstanceCollect.dismiss('ok');
                                            $scope.payWith = 0;
                                            $scope.cambio = 0;
                                            $('#ex4_value').focus();
                                        })
                                    }
                                    console.log($scope.clientDetail)
                                });
                            } else {
                                var credit = {
                                    idCredit: $scope.clientDetail.idCredit,
                                    amountCredit: $scope.clientDetail.debit + $scope.clientDetail.amountActual,
                                    idClient: $scope.clientDetail.idClient,
                                    detailCredit: [{idSale: data.idSale, payment: $scope.payWith}]
                                }
                                Credit.update($scope.clientDetail.idCredit, credit).success(function(dataCredit){
                                    console.log(dataCredit.message);
                                    
                                    $scope.modalInstanceCollect.dismiss('ok');
                                    $scope.payWith = 0;
                                    $scope.cambio = 0;
                                    $('#ex4_value').focus();
                                });
                            }
                        } else {
                            $scope.modalInstanceCollect.dismiss('ok');
                            $scope.payWith = 0;
                            $scope.cambio = 0;
                            $('#ex4_value').focus();
                        }
                    }
                });
            }
        });
    }

    $scope.cancelCobro = function(){
        $scope.modalInstanceCollect.dismiss('cancel');
        $scope.payWith = 0;
        $scope.cambio = 0;
        $('#ex4_value').focus();
    }

    document.addEventListener('keydown', function(event){
        if(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales.length > 0){
            var idInput = (_.last(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales)).bar_code
            if(event.which === 119){
                 $scope.collect();
            }
        }
        if($('#ex4_value').is(':focus')){
            if(event.which === 118){
                $('#'+idInput).focus();
            } 
        }
        if($('.quatity').is(':focus')){
            if(event.which === 13){
                $('#ex4_value').focus();
            }
        }
    });

    /*$scope.openModal = function(){
        $scope.$state = $state;
        var left = screen.width / 2 - 200, top = screen.height / 2 - 250;
        $window.open('http://www.google.com', '_blank', 'width=400,height=500');
    }*/
}