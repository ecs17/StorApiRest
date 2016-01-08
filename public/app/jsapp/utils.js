function loadTableasdasd(){
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
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
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
            if (service.cachedData.length > 0) {
                console.log("using cached data")
                var filteredData = filterData(service.cachedData, filter);
                var transformedData = sliceData(orderData(filteredData, params), params);
                params.total(filteredData.length)
                $defer.resolve(transformedData);
            } else {
                console.log("fetching data")
                $http.get("data.json").success(function (resp) {
                    angular.copy(resp, service.cachedData)
                    params.total(resp.length)
                    var filteredData = $filter('filter')(resp, filter);
                    var transformedData = transformData(resp, filter, params)

                    $defer.resolve(transformedData);
                });
            }

        }
    };
}