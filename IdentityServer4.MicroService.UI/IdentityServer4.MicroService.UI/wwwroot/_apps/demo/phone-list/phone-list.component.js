(function () {
    'use strict';

    angular
        .module('h5')
        .component('phoneList',
        {
            templateUrl: 'phone-list/phone-list.template.html',
            controller: ['$scope', '$timeout', function PhoneListController($scope, $timeout) {
                var vm = this;

                vm.orderProp = [1, 2, 3, 4, 5];
                vm.user = user;
                vm.data = [];
                activate();

                function activate() {
                    openapis.CampaignAPIsClient.CrowdfundList().then(r => {
                        $timeout(vm.data = r, 1);
                    })
                }

            }]
        });

})();
