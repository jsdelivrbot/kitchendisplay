require.config({
    'paths': {
        'angular': './bower_components/angular/angular',
        'angular-ui-route': './bower_components/angular-ui-route/angular-ui-router.min',
        'jquery': './bower_components/jquery/dist/jquery',
        'bootstrap': './lib/bootstrap/js/bootstrap.min',
        'async': './bower_components/requirejs/async'
    },
    'shim': {
        'app': {
            deps: ['angular', 'bootstrap', 'angular-ui-route', 'async']
        },
        'angular-ui-route': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        }

    }
});
require(['app'], function (app) {
        app.constant('appData', appData);
        angular.bootstrap(document,['app']);
}) 