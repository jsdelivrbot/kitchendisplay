define(['app'], function(app)
{
    app.controller('HomeController', ['$scope', '$http', '$window', function($scope, $http, $window){
        $scope.kitchen = {
            orders:[],
            dishes:[]
        };
        $scope.getTodayList = function(){
            $http.get("/api/v1/kitchenDisplay")
                .then(function(response) {
                    $scope.kitchen.dishes = response.data.dishes;
                    $scope.kitchen.orders = response.data.orders;
                });
        };
        $scope.downloadReport = function(){
            $window.location.href = '/api/v1/download';
        };
    }]);
});