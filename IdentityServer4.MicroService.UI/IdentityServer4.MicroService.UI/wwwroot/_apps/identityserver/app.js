(function () {
    'use strict';

    // 获取框架的 oidc对象
    try {
        window.user = window.parent.user;
    }
    catch (err) {

    }

    angular.module('h5', [
        'ngRoute',
        'ngSanitize',
    ]).config(config).run(run);

    function config()
    {
        openapis.init({
            server_endpoint: 'https://localhost:44309',
            clientId: 'adminportal',
            client_secret: '1',
            token_endpoint: 'https://localhost:44309/connect/token',
            subscription_key: ''
        });
    }

    function run()
    {

    }

})();

(function () {
    'use strict';

    angular
        .module('h5')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$rootScope'];

    function AppController($scope, $rootScope) {
        var vm = this;
        activate();

        function activate() {
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('h5')
        .config(["$locationProvider", "$routeProvider", function config(
            $locationProvider,
            $routeProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/dashboard', {
                    template: '<dashboard></dashboard>'
                }).
                when('/users', {
                    template: '<users></users>'
                }).
                when('/users/:id', {
                    template: '<user-detail></user-detail>'
                }).
                when('/clients', {
                    template: '<clients></clients>'
                }).
                when('/clients/:id', {
                    template: '<client-detail></client-detail>'
                }).
                when('/tenants', {
                    template: '<tenants></tenants>'
                }).
                when('/tenants/:id', {
                    template: '<tenant-detail></tenant-detail>'
                }).
                when('/identityresources', {
                    template: '<identityresources></identityresources>'
                }).
                when('/identityresources/:id', {
                    template: '<identityresource-detail></identityresource-detail>'
                }).
                when('/apiresources', {
                    template: '<apiresources></apiresources>'
                }).
                when('/apiresources/:id', {
                    template: '<apiresource-detail></apiresource-detail>'
                }).
                when('/apigateway/:id', {
                    template: '<apiresource-gateway></apiresource-gateway>'
                }).
                otherwise('/dashboard');
        }]);
})();