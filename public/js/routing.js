var routing = angular.module('myApp.routing', []);

routing.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            //sign-up panel
        when('/sign-up', {
                templateUrl: 'partials/sign-up.html',
                controller: 'SignUpCtrl'
            }).
            //login panel
        when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).
            //control panel
        when('/panel', {
                templateUrl: 'partials/panel.html',
                controller: 'PanelCtrl'
            }).
            //search panel
        when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
            }).
        otherwise({
            redirectTo: '/sign-up'
        });
    }
]);