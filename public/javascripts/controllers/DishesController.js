define(['app'], function(app)
{
    app.controller('DishesController', ['$scope', '$http', function($scope, $http){
    $scope.dishes = {
        list:[],
        item:{}
    };

    $http.get("/api/v1/dishes")
    .then(function(response) {
        $scope.dishes.list = response.data.data;
    });

    $scope.showAddForm = function(){
        $scope.dishes.item={};
        $scope.hidden=false;
        $scope.dishes.item.status = 1;
    }



    $scope.addDish = function(){

        if($scope.myForm.$valid) {
            $http.post("/api/v1/dishes",$scope.dishes.item)
                .then(function(response) {
                    $scope.dishes.list.push(response.data.data);
                    $scope.hidden = true;
                    $scope.dishes.item = {};
                });
        }
            
    }

    $scope.editDish = function(index, task){
        $scope.hidden = false;
        if(task && $scope.myForm.$valid) {
            $http.put("/api/v1/dishes",$scope.dishes.item)
                .then(function(response) {
                    angular.extend($scope.dishes.list[$scope.editIndex], $scope.dishes.item);
                    $scope.hidden = true;
                    $scope.dishes.item = {};
                });
        }else{
            $scope.dishes.item = angular.copy($scope.dishes.list[index]);
            $scope.editIndex = index;
        }
    }

    $scope.deleteDish = function(index, id){
            $http.delete("/api/v1/dishes/"+id,{_id:id})
                .then(function(response) {
                    $scope.dishes.list.splice(index,1);
                });
    }
    }]);
});