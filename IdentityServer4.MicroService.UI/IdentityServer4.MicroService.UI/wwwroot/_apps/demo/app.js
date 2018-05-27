(function () {
    'use strict';

    // 获取框架的 oidc对象
    window.user = window.parent.user;

    angular.module('h5', [
        'ngRoute',
        'ngSanitize',
    ]).config(config).run(run);

    function config() {

        openapis.init({
            server_endpoint: 'https://openapis.ixingban.com',
            clientId: 'adminportal',
            client_secret: '1',
            scope: 'campaign.apis.all',
            token_endpoint: 'https://ids.jixiucloud.cn/connect/token',
            subscription_key: '35a0672e5ff94b72a2e658e3debb2237'
        });
    }

    run.$inject = [];

    function run() {
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
                when('/phones', {
                    template: '<phone-list></phone-list>'
                }).
                when('/phones/:phoneId', {
                    template: '<phone-detail></phone-detail>'
                }).
                otherwise('/phones');
        }]);
})();