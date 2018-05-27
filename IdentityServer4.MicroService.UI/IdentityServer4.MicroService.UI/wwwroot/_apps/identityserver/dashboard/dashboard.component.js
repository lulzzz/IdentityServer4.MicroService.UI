(function () {
    'use strict';

    angular
        .module('h5')
        .component('dashboard',
        {
            templateUrl: 'dashboard/dashboard.template.html',
            controller: ['$scope', '$timeout', function DashboardController($scope, $timeout) {
                var vm = this;
                vm.loading = true;
                vm.versions = [];
                activate();

                function activate()
                {
                    var appName = 'identityserver4.microservice.ui';

                    //$.getJSON('/home/AppVersions?appName=' + appName).then(r => {

                    //    $timeout(function () {

                            vm.loading = false;

                    vm.versions = ['版本历史'].concat(
                        //r.data.reverse()
                        ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.6', '1.0.7', '1.0.8', '1.0.9'].reverse()
                    );

                    //    }, 1);
                    //})
                }
               
            }]
        });

})();
