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
                    prod.quantity = parseFloat(prod.quantity) + 1;
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
                name: clientSelected.name + ' ' + (clientSelected.ap1 === undefined ? '' : clientSelected.ap1) + ' ' + (clientSelected.ap2 === undefined ? '' : clientSelected.ap2),
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
        getTotlaSales(_.findWhere($scope.tabsSale, {active: true}));
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
        $scope.payWith = parseFloat(_.isUndefined(amount) ? 0 : amount);
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
        else {
            $scope.payWith = $scope.tSale;
            $scope.clientDetail = {
                name: "",
                idClient: 0,
                amountActual: 0,
                payment: 0,
                limitCredit: 0,
                debit: 0
            }
        }
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
                                            console.log(data.message);
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

function SalesReportCtrl($rootScope, $scope, $state, $window, Product, Sale, Client, Credit, User, $filter, ngTableParams){
    $scope.byDatePeriod = false;
    $scope.showEndDate = false;
    $scope.hasSelections = false;
    $scope.clientsSelected = false;
    $scope.usersSelected = false;
    $scope.productsSelected = false;
    $scope.noDataResult = true;
    $scope.noResultMsj = false;
    $scope.clientListSelected = [];
    $scope.userListSelected = [];
    $scope.productListSelected = [];

    if($rootScope.userNow.type === undefined){
        $rootScope.loginClass = 'margin-left: 0px;';
        $state.go('login');
    } else{
        $rootScope.loginClass = '';
    }

    $scope.clearStart = function() {
        $scope.startDate = null;
    }

    $scope.clearEnd = function() {
        $scope.endDate = null;
    }

    $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptionsStart = {
        maxDate: new Date(),
        minDate: new Date(),
    }

    $scope.dateOptionsEnd = {
        maxDate: new Date(),
        minDate: new Date()
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsStart.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.openStart = function() {
        $scope.endOpen.opened = false;
        $scope.startOpen.opened = true;
    };

    $scope.openEnd = function() {
        $scope.startOpen.opened = false;
        $scope.endOpen.opened = true;
    };

    $scope.startOpen = {
        opened: false
    };

    $scope.endOpen = {
        opened: false
    };

    $scope.setMinDateEnd = function(){
        if($scope.startDate != null){
            $scope.showEndDate = true;
            $scope.dateOptionsEnd.minDate = $scope.startDate;
        }
    }

    $scope.$watch('byDatePeriod', function(){
        $scope.showEndDate = false;
        $scope.clearStart();
        $scope.clearEnd();
    });

    $scope.$watch('byClient', function(){
        $scope.clientsSelected = false;
        $scope.clientListSelected = [];
        if(!$scope.usersSelected && !$scope.productsSelected)
            $scope.hasSelections = false;
    });

    $scope.$watch('byUser', function(){
        $scope.usersSelected = false;
        $scope.userListSelected = [];
        if(!$scope.clientsSelected && !$scope.productsSelected)
            $scope.hasSelections = false;
    });

    $scope.$watch('byProduct', function(){
        $scope.productsSelected = false;
        $scope.productListSelected = [];
        if(!$scope.clientsSelected && !$scope.usersSelected)
            $scope.hasSelections = false;
    });

    $scope.$watch('byCash', function(){
        if($scope.byCash)
            $scope.byCredit = false;
    });

    $scope.$watch('byCredit', function(){
        if($scope.byCredit)
            $scope.byCash = false;
    });

    $scope.selectedClient = function(object){
        var clientSelected = object.originalObject;
        if($scope.clientListSelected.length == 0){
            $scope.clientListSelected.push({
                id: clientSelected.idClient,
                name: clientSelected.name + " " + clientSelected.ap1 + " " + clientSelected.ap2
            });
        } else if(!_.findWhere($scope.clientListSelected, {id: clientSelected.idClient})) {
            $scope.clientListSelected.push({
                id: clientSelected.idClient,
                name: clientSelected.name + " " + clientSelected.ap1 + " " + clientSelected.ap2
            });
        }

        if($scope.clientListSelected.length > 0){
            $scope.hasSelections = true;
            $scope.clientsSelected = true;
        }
    }

    $scope.loadClients = function (str) {
        if (str.length > 0) {
            Client.getSearch(str).success(function (data) {
                $scope.clientList = data;
            });
        }
    }

    $scope.selectedUser = function(object){
        var userSelected = object.originalObject;
        if($scope.userListSelected.length == 0){
            $scope.userListSelected.push({
                id: userSelected._id,
                name: userSelected.name
            });
        } else if(!_.findWhere($scope.userListSelected, {id: userSelected._id})) {
            $scope.userListSelected.push({
                id: userSelected._id,
                name: userSelected.name
            });
        }

        if($scope.userListSelected.length > 0){
            $scope.hasSelections = true;
            $scope.usersSelected = true;
        }
    }

    $scope.loadUsers = function (str) {
        if (str.length > 0) {
            User.getSearch(str).success(function (data) {
                $scope.userList = data;
            });
        }
    }

    $scope.selectedProduct = function(object){
        var prodSelected = object.originalObject;
        if($scope.productListSelected.length == 0){
            $scope.productListSelected.push({
                bar_code: prodSelected.bar_code,
                name: prodSelected.name_prod
            });
        } else if(!_.findWhere($scope.productListSelected, {bar_code: prodSelected.bar_code})) {
            $scope.productListSelected.push({
                bar_code: prodSelected.bar_code,
                name: prodSelected.name_prod
            });
        }

        if($scope.productListSelected.length > 0){
            $scope.hasSelections = true;
            $scope.productsSelected = true;
        }
    }
    
    $scope.loadProducts = function (str) {
        if (str.length > 0) {
            Product.getSearch(str).success(function (data) {
                $scope.productList = data;
            });
        }
    }

    $scope.deletClient = function(idSel){
        $scope.clientListSelected = _.without($scope.clientListSelected, _.findWhere($scope.clientListSelected, {id: idSel}));
        if($scope.clientListSelected.length == 0){
            $scope.clientsSelected = false;
            if(!$scope.usersSelected && !$scope.productsSelected)
                $scope.hasSelections = false;
        }
    }

    $scope.deletUser = function(idSel){
        $scope.userListSelected = _.without($scope.userListSelected, _.findWhere($scope.userListSelected, {id: idSel}));
        if($scope.userListSelected.length == 0){
            $scope.usersSelected = false;
            if(!$scope.clientsSelected && !$scope.productsSelected)
                $scope.hasSelections = false;
        }
    }

    $scope.deletProduct = function(idSel){
        $scope.productListSelected = _.without($scope.productListSelected, _.findWhere($scope.productListSelected, {bar_code: idSel}));
        if($scope.productListSelected.length == 0){
            $scope.productsSelected = false;
            if(!$scope.clientsSelected && !$scope.usersSelected)
                $scope.hasSelections = false;
        }
    }

    $scope.generateReport = function(){
        $scope.parametersQuery = {
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            clients: $scope.clientListSelected,
            users: $scope.userListSelected,
            products: $scope.productListSelected,
            cash: $scope.byCash,
            credit: $scope.byCredit
        };

        Sale.getSaleBySelection($scope.parametersQuery).success(function(data){
            $scope.salesResult = data;
            console.log($scope.salesResult);
            if($scope.salesResult.length > 0){
                $scope.noDataResult = false;
                $scope.noResultMsj = false;
                $scope.totalProducts = 0;
                $scope.totalAmountSales = 0;
                $scope.totalSales = $scope.salesResult.length;
                _.each($scope.salesResult, function(oneSale){
                    $scope.totalProducts += oneSale.totalProducts;
                    $scope.totalAmountSales += oneSale.totalAmount;
                    _.extend(oneSale, {selectedParent : false});
                });
                loadTable($scope, $filter, $scope.salesResult, ngTableParams);
                //generatePdf();
            } else {
                $scope.noResultMsj = true;
                $scope.noDataResult = true;
            }
        });
    }

    $scope.downloadPdf = function(){
        genDownloadPdf($scope.salesResult, $scope.parametersQuery, $scope.totalProducts, $scope.totalAmountSales, $scope.totalSales);
    }

    $scope.openPdf = function(){
        genOpenPdf($scope.salesResult, $scope.parametersQuery, $scope.totalProducts, $scope.totalAmountSales, $scope.totalSales);
    }

    $scope.downloadExcel = function(){
        if(!qz.websocket.isActive()){
            qz.websocket.connect().then(function(){
                console.log('conectado');
                return qz.printers.find();
            }).then(function(printers){
                for (var i = 0; i < printers.length; i++) {
                    console.log('Impresora ' + printers[i]);
                }
                var config = qz.configs.create('Microsoft Print to PDF');
                var data = [{
                    type: 'pdf',
                    data: 'assets/ReporteVents-30-Noviembre-2016.pdf'
                }];
                qz.print(config, data).then(function(){
                    console.log('se imprimio')
                }).catch(function(e) { console.error(e); });
            }).catch(function(e) { console.error(e); });
        } else {
            qz.printers.find().then(function(printers){
                for (var i = 0; i < printers.length; i++) {
                    console.log('Impresora ' + printers[i]);
                }
                var config = qz.configs.create('Microsoft Print to PDF');
                var data = [{
                    type: 'pdf',
                    data: 'assets/ReporteVents-30-Noviembre-2016.pdf'
                }];
                qz.print(config, data).then(function(){
                    console.log('se imprimio')
                    //qz.websocket.disconnect().catch(function(e) { console.error(e); });
                }).catch(function(e) { console.error(e); });
            }).catch(function(e) { console.error(e); });
        }
    }

    $scope.loadDetailSale = function(selParent){
        $scope.selectedParent = selParent
        $scope.saleDetailParam = new ngTableParams({
            page: 1,    // show first page
            count: 10    // count per page
        }, {
            total: 0, // length of data
            getData: function($defer, params){
                $defer.resolve($scope.selectedParent.detailSale.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }
}

function AccountCreditCtrl($rootScope, $scope, $state, $window, Product, Sale, Client, Credit, User, $filter, ngTableParams, Payment, $uibModal){
    $scope.selectClient = false;
    $scope.noDataResult = false;
    $scope.clientSelected = {};
    $scope.selectedParents = [];
    $scope.selectedClient = function(object){
        $scope.clientSelected = object.originalObject;
        _.extend($scope.clientSelected, {nameComplet: ($scope.clientSelected.name !== undefined ? $scope.clientSelected.name : '') 
                                        + " " + ($scope.clientSelected.ap1 !== undefined ? $scope.clientSelected.ap1 : '')
                                        + " " + ($scope.clientSelected.ap2 !== undefined ? $scope.clientSelected.ap2 : '')});
        if(!(_.isEmpty($scope.clientSelected))){
            $scope.selectClient = true;
            $scope.loadCredit = Credit.getDetailByidClient($scope.clientSelected.idClient).success(function(data){
                if(data.length > 0){
                    $scope.noDataResult = false;
                    $scope.detailCredit = data[0];
                    _.each($scope.detailCredit.detailCredit, function(creditSale){
                        _.extend(creditSale, {selectedParent : false})
                        $scope.selectedParents.push({});
                    })
                    console.log($scope.detailCredit);
                    loadTable($scope, $filter, $scope.detailCredit.detailCredit, ngTableParams);
                } else {
                    $scope.noDataResult = true;
                    $scope.selectClient = false;
                }
            });
        }
    }

    $scope.loadClients = function (str) {
        if (str.length > 0) {
            Client.getSearch(str).success(function (data) {
                $scope.clientList = data;
            });

        }
    }

    $scope.paymentNowF = function(amountPayment){
        $scope.paymentNow = parseFloat(amountPayment);
        $scope.paymentNowWrong = false;
        $scope.paymentNow = (_.isNaN($scope.paymentNow) ? 0 : $scope.paymentNow);
        $scope.amountCredtRest = ($scope.detailCredit.amountCredit - $scope.paymentNow < 0 ? 0 : $scope.detailCredit.amountCredit - $scope.paymentNow);
        if(amountPayment >= $scope.detailCredit.amountCredit){
            $scope.amountComplete = true;
            $scope.cambio = $scope.payWith - $scope.tSale;
        } else {
            $scope.amountComplete = false;
            $scope.cambio = 0;
        }

        if($scope.paymentNow !== 0 && $scope.payWith !== 0 && $scope.paymentNow < $scope.payWith){
            $scope.changePayment = $scope.payWith - $scope.paymentNow;
        } else {
            $scope.changePayment = 0;
        }
    }

    $scope.changePay = function(amountPayWith){
        $scope.payWith = parseFloat(_.isUndefined(amountPayWith) ? 0 : amountPayWith);
        $scope.changePayment = ($scope.payWith - $scope.paymentNow < 0 ? 0 : $scope.payWith - $scope.paymentNow);
    }

    $scope.paymentLiquide = function(){
        $scope.payWrong = false;
        $scope.paymentWrong = false;
        $scope.changePayment = 0;
        $scope.paymentNow = 0;
        $scope.payWith = 0;
        $scope.amountCredtRest = $scope.detailCredit.amountCredit;
        $scope.payment = {
            amountCredit: 0,
            amountPayment: 0,
            amountPayWith: 0,
            idUser: 0,
            idCredit: 0,
            idClient: 0,
            nowIdCredit: 0,
            coments: ''
        };

        $scope.paymentModal = $uibModal.open({
            animation: true,
            templateUrl: 'paymentModal.html',
            scope: $scope,
            windowClass: 'modal-md'
        });
    }

    $scope.abonar = function(){
        if($scope.payWith === 0 || $scope.payWith < $scope.paymentNow){
            $scope.payWrong = true;
        } else  if($scope.paymentNow === 0){
            $scope.paymentWrong = true;
        } else {
            $scope.payment.amountCredit = $scope.detailCredit.amountCredit;
            $scope.payment.amountPayment = $scope.paymentNow;
            $scope.payment.amountPayWith = $scope.payWith;
            $scope.payment.idUser = $rootScope.userNow.id;
            $scope.payment.idCredit = $scope.detailCredit.idCredit;
            $scope.payment.idClient = $scope.detailCredit.idClient;
            Payment.save($scope.payment).success(function(dataPayment){
                console.log(dataPayment.message);
                $scope.selectClient = false;
                $scope.noDataResult = false;
                $scope.paymentModal.dismiss('ok');
            });
        }
    }

    $scope.cancel = function(){
        $scope.paymentModal.dismiss('cancel');
    }

    $scope.closeAlert = function() {
        $scope.payWrong = false;
    }

    $scope.closeAlertNoPayment = function() {
        $scope.paymentWrong = false;
    }

    $scope.loadDetailSale = function(selParent, indexSale){
        console.log(indexSale);
        $scope.selectedParents[indexSale] = selParent;
        console.log($scope.selectedParents);
        $scope.selectedParent = selParent
        $scope.saleDetailParam = new ngTableParams({
            page: 1,    // show first page
            count: 10    // count per page
        }, {
            total: 0, // length of data
            getData: function($defer, params){
                if($scope.selectedParents[indexSale] !== null)
                    $defer.resolve($scope.selectedParents[indexSale].sDetail.detailSale.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }
}