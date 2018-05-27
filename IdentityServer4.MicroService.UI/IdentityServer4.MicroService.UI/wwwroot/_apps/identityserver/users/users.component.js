(function () {
    'use strict';

    angular
        .module('h5')
        .component('users',
        {
            templateUrl: 'users/users.template.html',
            controller: ['$scope', '$timeout', function UserController($scope, $timeout) {
                var vm = this;
                vm.Theads = [
                    { ID: 'userId', Title: '标识' },
                    { ID: 'userName', Title: '用户' },
                    { ID: 'createDate', Title: '创建时间' },
                ]
                vm.orderProp = [1, 2, 3, 4, 5];
                vm.user = user;
                vm.data = [];
                vm.loading = true;
                activate();

                function activate() {
                    vm.loading = true;
                    openapis.IdentityServer4MicroServiceClient.UserGet().then(r => {
                        $timeout(() => {
                            vm.data = r;
                            vm.loading = false;
                        }, 1);
                    })
                }

            }]
        });

})();
