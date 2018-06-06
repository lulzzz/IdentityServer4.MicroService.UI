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
                        ['1.0.10', '1.0.11', '1.0.12'].reverse()
                    );

                    //    }, 1);
                    //})
                }
               
            }]
        });

})();
