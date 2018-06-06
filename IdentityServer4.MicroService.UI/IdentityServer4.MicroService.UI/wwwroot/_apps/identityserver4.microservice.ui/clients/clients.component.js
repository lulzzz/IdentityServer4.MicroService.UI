(function () {
    'use strict';

    angular
        .module('h5')
        .component('clients',
        {
            templateUrl: 'clients/clients.template.html',
            controller: ['$scope', '$timeout', function ClientController($scope, $timeout) {
                var vm = this;
                vm.Theads = [
                    { ID: 'clientName', Title: '应用' },
                    { ID: 'allowedGrantTypes', Title: '授权类型' },
                ];
                vm.grantTypes = [
                    //{ label: '简化模式', grantType: 'implicit' },
                    { label: 'JavaScript应用程序', grantType: 'client_credentials&implicit' },

                    //{ label: '授权码模式', grantType: 'authorization_code' },
                    { label: 'Web应用程序', grantType: 'authorization_code&client_credentials' },

                    //{ label: '混合模式', grantType: 'hybrid' },
                    { label: '本地桌面/移动应用程序', grantType: 'client_credentials&hybrid' },

                    //{ label: '密码模式', grantType: 'password' },
                    { label: '资源所有者应用程序', grantType: 'client_credentials&password' },

                    //{ label: '客户端模式', grantType: 'client_credentials' },
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

                            r.data.forEach(x => {
                                x.allowedGrantTypes = x.allowedGrantTypes.map(x => x.grantType).sort().join('&');
                            });

                            vm.data = r;

                        }, 1);
                    }).catch(r => {
                        $timeout(() => vm.loading = false);
                        swal({ title: r.status + ":" + r.statusText, icon: 'error' });
                    });
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
