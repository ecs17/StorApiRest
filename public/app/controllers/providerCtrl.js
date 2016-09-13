function ProviderCtrl($rootScope, Provider, $scope, $state, $window, $filter, ngTableParams){
    $scope.processing = true;
    $scope.providers = {}
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    Provider.all().success(function(data){
        $scope.processing = false;
        $scope.providers = data;
        _.each($scope.providers, function(provider){
            provider.edit = ($rootScope.userNow.type.idType === 1 ? true : false);
        });
        loadTable($scope, $filter, $scope.providers, ngTableParams);
    });
    
    $scope.deleteProvider = function(id, disableDelet){
        if(disableDelet){
            $scope.processing = true;
            Provider.delete(id).success(function(data){
                Provider.all().success(function(data){
                    $scope.processing = false;
                    $scope.providers = data;
                    _.each($scope.providers, function(provider){
                        provider.edit = ($rootScope.userNow.type.idType === 1 ? true : false);
                    });
                    loadTable($scope, $filter, $scope.providers, ngTableParams);
                });
            });
        }
    };
}


function CreateProviderCtrl($rootScope, $scope, Provider, ProviderType, ProviderStatus, $window, $state){
    $scope.typeTask = 'create';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    if($rootScope.userNow.type.idType !== 1){
        $state.go('nopermission');
    }
    ProviderType.get().success(function(data){
        $scope.providerType = data;
    })
    ProviderStatus.get().success(function(data){
        $scope.providerStatus = data;
    })

    $scope.saveProvider = function(){
        $scope.processing = true;
        $scope.message = '';
        
        $scope.providerData.providerType = {
            description: $scope.provider_type.description,
            abbrev: $scope.provider_type.abbrev,
            idType: $scope.provider_type.idType
        };
        
        $scope.providerData.statusType = {
            description: $scope.provider_status.description,
            abbrev: $scope.provider_status.abbrev,
            idType: $scope.provider_status.idType
        };
        
        Provider.create($scope.providerData).success(function(data){
            $state.go('providers')
            $scope.processing = false;
            $scope.providerData = {};
            $scope.message = data.message;
            $scope.providerType = {};
            $scope.statusType = {};
        });
    };
}



function EditProviderCtrl($rootScope, $scope, $state, $stateParams, Provider, ProviderType, ProviderStatus, $window){
    $scope.typeTask = 'edit';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    } else if($rootScope.userNow.type.idType !== 1){
        $state.go('clients');
    } else {
        
        ProviderType.get().success(function(data){
            $scope.providerType = data;
        });
        ProviderStatus.get().success(function(data){
            $scope.providerStatus = data;
        });

        Provider.get($stateParams.idProvider).success(function(data){
            $scope.provider_type = (_.where($scope.providerType, {idType: data.providerType.idType}))[0];
            $scope.provider_status = (_.where($scope.providerStatus, {idType: data.statusType.idType}))[0];
            $scope.providerData = data;
        });
        
        $scope.saveProvider = function(){
            $scope.processing = true;
            $scope.message = '';
            
            $scope.providerData.providerType = {
                description: $scope.provider_type.description,
                abbrev: $scope.provider_type.abbrev,
                idType: $scope.provider_type.idType
            };
            
            $scope.providerData.statusType = {
                description: $scope.provider_status.description,
                abbrev: $scope.provider_status.abbrev,
                idType: $scope.provider_status.idType
            };
            
            Provider.update($stateParams.idProvider, $scope.providerData).success(function(data){
                $scope.processing = false;
                $scope.providerData = {};
                $scope.message = data.message;
                $scope.providerType = {};
                $scope.statusType = {};
                $state.go('providers');
            })
        }
    }
}