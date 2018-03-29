define(['routes','services/dependencyResolverFor'], function (config, dependencyResolverFor){
	var app = angular.module ('app', ['ui.router']);
	app.config([
			'$stateProvider',
		 	'$urlRouterProvider',
			'$compileProvider',
			'$locationProvider',
			'$controllerProvider',
			'$filterProvider',
			'$provide',
            'appData',
			function ($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider, $controllerProvider, $filterProvider, $provide, appData){
				app.controller 			= 	$controllerProvider.register;
				app.directive 			= 	$compileProvider.directive;
				app.filter 				= 	$filterProvider.filter;
				app.factory 			= 	$provide.factory;
				app.service 			= 	$provide.service;
                var appRoutes = appData && appData[0] &&  appData[0].length ? appData[0] : [];
                $locationProvider.html5Mode(true);
				if (config.routes) {
					angular.forEach(config.routes, function (route, path) {

					if(path.replace("/","")){
						$stateProvider.state(path.replace("/",""), {
				            url: path,
				            views:{
				            	'Header': {
					                templateUrl: '/views/header.html',
					                resolve:dependencyResolverFor(['controllers/HeaderController', 'controllers/UserController'])
					            },
					            'Middle': {
					                templateUrl: route.templateUrl,
					                resolve:dependencyResolverFor(route.dependencies)
					            },
					            'Footer': {
					                templateUrl: '/views/footer.html',
					                resolve:dependencyResolverFor(['controllers/FooterController'])

					            }
				            }

        				});
					}
					})
				}

				if (config.defaultRoutePath) {
					//$routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
					$urlRouterProvider.otherwise('/home');
				}
			}
		]);
	app.run(['$rootScope', 'appData', '$location', function($rootScope, appData, $location){
		$rootScope.appData = appData;
        $rootScope.ME = appData && appData[2] && appData[2]._id ? appData[2]._id : null;
        $rootScope.tab = 'banners';
		$rootScope.baseUrl = window.location.origin;;
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

			$rootScope.tab = toState.url.replace('/', '');
		});

		$rootScope.$on('$viewContentLoaded', function() {
			var interval = setInterval(function(){
				if (document.readyState == "complete"){
					window.scroll(0, 0);
					clearInterval(interval);
				}
			},200);
		});

	}]);
    app.factory('commonDataHandler', ['$injector', function ($injector) {
        var dataObject = {};
        var $q = $injector.get('$q');
        var setDataAttribute = function (data) {
            dataObject.data = data;
        };

        var setCountAttribute = function (count) {
            dataObject.count = count;
        };

        var getServiceData = function () {
            return dataObject;
        };

        var setServiceParams = function (filter, model) {
            dataObject.filter = filter ? filter : {};
            dataObject.model = model ? model : {};
        };

        var setServiceData = function () {
            var deffered = $q.defer();
            if (dataObject.model) {
                var Service = $injector.get(dataObject.model);

                Service.find({
                    filter: dataObject.filter && dataObject.filter.filter ? dataObject.filter.filter : {}
                }, function (res) {
                    //handle success
                    setDataAttribute(res);
                    deffered.resolve(res);
                }, function (err) {
                    //handle error here
                    deffered.reject(null);
                });
            }
            return deffered.promise;
        };

        var setServiceCounts = function () {
            var deffered = $q.defer();
            if (dataObject.model) {
                var Service = $injector.get(dataObject.model);
                Service.count({
                    where: dataObject.filter && dataObject.filter.filter && dataObject.filter.filter.where ? dataObject.filter.filter.where : {}
                }, function (res) {
                    //handle success
                    //append offset to each record
                    setCountAttribute(res.count ? res.count : 0);
                    deffered.resolve(res);
                }, function (err) {
                    //handle error here
                    deffered.reject(null);
                });
            }
            return deffered.promise;
        };

        var setOffset = function (offset) {
            if (dataObject && dataObject.filter && dataObject.filter && dataObject.filter.filter) {
                dataObject.filter.filter.skip = offset;
            }

        };

        var getOffset = function () {
            return dataObject && dataObject.filter && dataObject.filter.filter && dataObject.filter.filter.skip ?
                dataObject.filter.filter.skip : 0;
        };

        return {
            setServiceData: setServiceData,
            getServiceData: getServiceData,
            setOffset: setOffset,
            getOffset: getOffset,
            setDataAttribute: setDataAttribute,
            setCountAttribute: setCountAttribute,
            setServiceParams: setServiceParams,
            setServiceCounts: setServiceCounts
        };
    }]);
	return app;

});
