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