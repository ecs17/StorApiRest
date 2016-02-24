function loadTable($scope, $filter, dataTable, ngTableParams) {
    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
        sorting: {
            name: 'asc'
        }
    }, {
        total: 0, // length of data
        getData: function ($defer, params) {
            service.getData($defer, params, $scope.filter);
        }
    });

    $scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
    });

    function filterData(data, filter) {
        return $filter('filter')(data, filter)
    }

    function orderData(data, params) {
        var d = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
        return d;
    }

    function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
    }

    function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params);
    }

    var service = {
        cachedData: [],
        getData: function ($defer, params, filter) {
            var filteredData = filterData(dataTable, filter);
            var transformedData = sliceData(orderData(filteredData, params), params);
            params.total(filteredData.length)
            $defer.resolve(transformedData);
        }
    };
}

function getPrice_iva_ipes(purchase_price, iva, ieps){
    var sale_price = 0;
    var ieps_tem = 0;
    var iva_tem = 0;
    if(ieps !== undefined){
        ieps_tem = purchase_price * (ieps / 100)
    }
    if(iva !== undefined){
        iva_tem = purchase_price * (iva / 100);
    }
    sale_price = parseFloat(purchase_price) + iva_tem + ieps_tem + (purchase_price * 0.25);
    return sale_price;
}