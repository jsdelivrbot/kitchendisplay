define(['app'], function(app)
{
    app.service('appCommonData', function($q, $rootScope, $http){
        var data = {};
        var deferred = $q.defer();
        $http.get("getBanners")
            .then(function(response) {
                data = response.data.data;
                deferred.resolve(data);
            },function(response) {
                data = response.data.data;
                deferred.reject([]);
            });
        return deferred.promise;
    });
});