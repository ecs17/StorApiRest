function SaleCtrl($rootScope, $scope, $state, $window, Product, $compile, $sce, $uibModal, $log) {

    $scope.tabsSale = [
        {
            id: "tab1",
            name: "Venta 1",
            active: true,
            title: "Venta numero 1",
            listProductsToSales: [],
            subTotal: 0.0,
            ivaSales: 0.0,
            totalSales: 0.0
        }
    ];
    var indexToClose;
    var indexProdToDelete;
    
    $scope.selectedProduct = function(object){
        var prodSelected = object.originalObject;
        var prodAlreadyExist = false;
        if(prodSelected.stocks === 0){
            console.log("product stocks 0 with bar_code: " + prodSelected.bar_code);
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
                    amount: prodSelected.price.sale_price
                });
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
        prodRow.amount = prodRow.quantity * prodRow.sale_price;
        getTotlaSales(tab);
    };
    
    $scope.removeTab = function (i, nameSale) {
        indexToClose = i;
        console.log("Removing tab: " + i);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'confirmCloseSalesModal.html',
            scope: $scope,
            size: 'sm'
        });
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
        $('#ex4_value').focus();
    }

    document.addEventListener('keydown', function(event){
        if(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales.length > 0){
            var idInput = (_.last(_.findWhere($scope.tabsSale, {active: true}).listProductsToSales)).bar_code
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