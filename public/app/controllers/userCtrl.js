function UserCtrl($rootScope, User, $scope, $state, $window, $filter, ngTableParams){
    $scope.processing = true;
    $scope.users = {}
    linkNewUser =  $('#newUser');
    $('#newUser').css('color', 'red');
    $('#idFiltroUser').focus();
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined || $rootScope.userNow.type.idType !== 1){
        $state.go('nopermission');
    }
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    User.all().success(function(data){
        $scope.processing = false;
        $scope.users = data;
        loadTable($scope, $filter, $scope.users, ngTableParams);
    });
    
    $scope.deleteUser = function(id, disableDelet){
        if(!disableDelet){
            $scope.processing = true;
            User.delete(id).success(function(data){
                User.all().success(function(data){
                    $scope.processing = false;
                    $scope.users = data;
                    loadTable($scope, $filter, $scope.users, ngTableParams);
                });
            });
        }
    };
}


function CreateUserCtrl($rootScope, $scope, User, UserType, $window, $state){
    $scope.type = 'create';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    UserType.get().success(function(data){
        $scope.userTypeCatalog = data;
    })
    $scope.saveUser = function(){
        $scope.processing = true;
        $scope.message = '';
        
        $scope.userData.userType = {
            description: $scope.typeUser.description,
            abbrev: $scope.typeUser.abbrev,
            idType: $scope.typeUser.idType
        }
        if($scope.typeUser.idType == 1)
            $scope.userData.admin = true;
        else
            $scope.userData.admin = false;
        
        User.create($scope.userData).success(function(data){
            $scope.processing = false;
            $scope.userData = {};
            $scope.message = data.message;
            $scope.typeUser = {};
        });
    };
}

function EditUserCtrl($rootScope, $scope, $state, $stateParams, User, UserType, $window){
    $scope.type = 'edit';
    //$rootScope.userNow = JSON.parse($window.localStorage.getItem('userData') || '{}');
    if($rootScope.userNow.type === undefined){
        $state.go('login');
    }
    UserType.get().success(function(data){
        $scope.userTypeCatalog = data;
    });
    User.get($stateParams.userId).success(function(data){
        $scope.typeUser = (_.where($scope.userTypeCatalog, {idType: data.userType.idType}))[0];
        $scope.userData = data;
    });
    
    $scope.saveUser = function(){
        $scope.processing = true;
        $scope.message = '';
        
        $scope.userData.userType = {
            description: $scope.typeUser.description,
            abbrev: $scope.typeUser.abbrev,
            idType: $scope.typeUser.idType
        }
        if($scope.typeUser.idType == 1)
            $scope.userData.admin = true;
        else
            $scope.userData.admin = false;
        
        User.update($stateParams.userId, $scope.userData).success(function(data){
            $scope.processing = false;
            $scope.userData = {};
            $scope.message = data.message;
            if(data.message == 'User updated')
                $state.go('users');
        })
    }
}