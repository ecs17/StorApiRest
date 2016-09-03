function ClientCtrl($rootScope, Client, $scope, $state, $window, $filter, ngTableParams){
    $scope.processing = true;
    $scope.clients = {}
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    Client.all().success(function(data){
        $scope.processing = false;
        $scope.clients = data;
        _.each($scope.clients, function(client){
            client.edit = ($rootScope.userNow.type.idType === 1 ? true : false);
        })
        loadTable($scope, $filter, $scope.clients, ngTableParams);
    });
    
    $scope.deleteClient = function(id, disableDelet){
        if(disableDelet){
            $scope.processing = true;
            Client.delete(id).success(function(data){
                Client.all().success(function(data){
                    $scope.processing = false;
                    $scope.clients = data;
                    loadTable($scope, $filter, $scope.clients, ngTableParams);
                });
            });
        }
    };
}


function CreateClientCtrl($rootScope, $scope, Client, ClientType, $window, $state){
    $scope.typeTask = 'create';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    if($rootScope.userNow.type.idType !== 1){
        $state.go('nopermission');
    }
    ClientType.get().success(function(data){
        $scope.clientType = data;
    })
    $scope.saveClient = function(){
        $scope.processing = true;
        $scope.message = '';
        
        $scope.clientData.clientType = {
            description: $scope.client_type.description,
            abbrev: $scope.client_type.abbrev,
            idType: $scope.client_type.idType
        }
        
        Client.create($scope.clientData).success(function(data){
            $state.go('clients')
            $scope.processing = false;
            $scope.clientData = {};
            $scope.message = data.message;
            $scope.clientType = {};
        });
    };
}



function EditClientCtrl($rootScope, $scope, $state, $stateParams, Client, ClientType, $window){
    $scope.typeTask = 'edit';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    } else if($rootScope.userNow.type.idType !== 1){
        $state.go('clients');
    } else {
        ClientType.get().success(function(data){
            $scope.clientType = data;
        });
        Client.get($stateParams.idClient).success(function(data){
            $scope.client_type = (_.where($scope.clientType, {idType: data.clientType.idType}))[0];
            $scope.clientData = data;
        });
        
        $scope.saveClient = function(){
            $scope.processing = true;
            $scope.message = '';
            
            $scope.clientData.clientType = {
                description: $scope.client_type.description,
                abbrev: $scope.client_type.abbrev,
                idType: $scope.client_type.idType
            }
            
            Client.update($stateParams.idClient, $scope.clientData).success(function(data){
                $scope.processing = false;
                $scope.clientData = {};
                $scope.message = data.message;
                if(data.message == 'Client updated')
                    $state.go('clients');
            })
        }
    }
}