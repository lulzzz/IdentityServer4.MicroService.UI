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
                otherwise('/dashboard');
        }]);
})();