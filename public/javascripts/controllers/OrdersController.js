define(['app'], function(app)
{
    app.controller('OrdersController', ['$scope', '$http', function($scope, $http){
    $scope.orders = {
        list:[],
        item:{},
        dishes:[]
    };

    $http.get("/api/v1/orders")
    .then(function(response) {
        $scope.orders.dishes = response.data.dishes;
        $scope.orders.list = response.data.orders;
    });

    $scope.showAddForm = function(){
        $scope.orders.item={};
        $scope.hidden=false;
        $scope.orders.item.status = 1;
    }



    $scope.addOrder = function(){

        if($scope.myForm.$valid) {
            $http.post("/api/v1/orders",$scope.orders.item)
                .then(function(response) {
                    $scope.orders.list.push(response.data.data);
                    $scope.hidden = true;
                    $scope.orders.item = {};
                });
        }
            
    }

    $scope.editOrder = function(index, task){
        $scope.hidden = false;
        if(task && $scope.myForm.$valid) {
            $http.put("/api/v1/orders",$scope.orders.item)
                .then(function(response) {
                    angular.extend($scope.orders.list[$scope.editIndex], $scope.orders.item);
                    $scope.hidden = true;
                    $scope.orders.item = {};
                });
        }else{
            $scope.orders.item = angular.copy($scope.orders.list[index]);
            $scope.editIndex = index;
        }
    }

    $scope.deleteOrder = function(index, id){
            $http.delete("/api/v1/orders/"+id,{_id:id})
                .then(function(response) {
                    $scope.orders.list.splice(index,1);
                });
    }
    }]);
});