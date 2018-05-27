﻿(function () {
    'use strict';

    angular
        .module('h5')
        .component('clients',
        {
            templateUrl: 'clients/clients.template.html',
            controller: ['$scope', '$timeout', function ClientController($scope, $timeout) {
                var vm = this;
                vm.Theads = [
                    { ID: 'userId', Title: '标识' },
                    { ID: 'userName', Title: '应用' },
                    { ID: 'createDate', Title: '授权类型' },
                ];

                vm.loading = true;
                vm.filter = { take: 10 };

                vm.IData_Get = IData_Get;
                vm.IDelete = IDelete;

                vm.ckAll = false;
                vm.ICKAll = function () {
                    vm.ckAll = !vm.ckAll;
                };

                function IData_Get() {
                    vm.loading = true;

                    openapis.IdentityServer4MicroServiceClient.ClientGet().then(r => {
                        $timeout(() => {
                            vm.loading = false;

                            r.PageIndex = r.skip <= 0 ? 0 : r.skip % r.take == 0 ? r.skip / r.take : (r.skip / r.take) + 1;

                            r.PageCount = r.skip == 0 || r.total % r.skip == 0 ? 1 : r.total / r.skip;

                            vm.data = r;

                        }, 1);
                    })
                };

                function IDelete(id) {
                    swal({
                        title: "Are you sure?",
                        icon: "warning",
                        buttons: true,
                    })
                        .then(willDelete => {

                            if (willDelete) {

                                openapis.IdentityServer4MicroServiceClient.ClientDelete(id).then(r => {

                                    if (r.code == 200) {
                                        swal({ title: '成功', icon: 'success' });
                                    }
                                    else {

                                        swal({ title: r.message, icon: 'error' });
                                    }

                                    vm.IData_Get();
                                });
                            }
                        });
                }

                function activate() {
                    vm.IData_Get();
                }

                $(function () {
                    activate();
                })
            }]
        });

})();
