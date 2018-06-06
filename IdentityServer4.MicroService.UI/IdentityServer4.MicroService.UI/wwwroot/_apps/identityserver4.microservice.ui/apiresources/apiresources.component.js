(function () {
    'use strict';

    angular
        .module('h5')
        .component('apiresources',
            {
                templateUrl: 'apiresources/apiresources.template.html',
                controller: ['$scope', '$timeout', function ApiresourcesController($scope, $timeout) {
                    var vm = this;

                    vm.Theads = [
                        { ID: 'name', Title: '标识' },
                        { ID: 'displayName', Title: '微服务' },
                        { ID: 'enabled', Title: '状态' },
                    ]

                    vm.loading = true;
                    vm.filter = { take: 10 };

                    vm.IData_Get = IData_Get;
                    vm.IDelete = IDelete;


                    vm.ckAll = false;
                    vm.ICKAll = function () {
                        vm.ckAll = !vm.ckAll;
                    };

                    function IData_Get()
                    {
                        vm.loading = true;

                        openapis.IdentityServer4MicroServiceClient.ApiresourceGet().then(r =>
                        {
                            $timeout(() => {
                                vm.loading = false;

                                r.PageIndex = r.skip <= 0 ? 0 : r.skip % r.take == 0 ? r.skip / r.take : (r.skip / r.take) + 1;

                                r.PageCount = r.skip == 0 || r.total % r.skip == 0 ? 1 : r.total / r.skip;

                                vm.data = r;

                            }, 1);
                        }).catch(r => {
                            $timeout(() => vm.loading = false);
                            swal({ title: r.status + ":" + r.statusText, icon: 'error' });
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
                                    openapis.IdentityServer4MicroServiceClient.ApiresourceDelete(id).then(r => {
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
