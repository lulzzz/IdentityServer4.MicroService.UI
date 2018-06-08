(function () {
    'use strict';

    angular
        .module('h5')
        .component('apiresourceDetail',
        {
            templateUrl: 'apiresource-detail/apiresource-detail.template.html',
            controller: ['$routeParams', '$timeout','$location',
                function ApiresourceDetailController($routeParams, $timeout, $location)
                {
                    var vm = this;
                    vm.id = parseInt($routeParams.id);
                    vm.data = {
                        userClaims: [],
                        scopes: [],
                        secrets: []
                    };

                    vm.secretTypes = [
                        { label: 'SharedSecret', value: 'SharedSecret' },
                        { label: 'X509CertificateThumbprint', value: 'X509Thumbprint' },
                        { label: 'X509CertificateName', value: 'X509Name' },
                        { label: 'X509CertificateBase64', value: 'X509CertificateBase64' },
                    ];

                    vm.loading_getDetail = false;
                    function getApiresourceDetail() {
                        if (vm.loading_getDetail == true) { return; }

                        vm.loading_getDetail = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceDetail(vm.id).then(r =>
                        {
                            $timeout(function ()
                            {

                                vm.loading_getDetail = false;
                                if (r.data) {
                                    vm.data = r.data;
                                    
                                    //setTimeout(function () {
                                    //    $('#apiProductIdsSelect').select2();
                                    //}, 300)
                                }
                            }, 1);
                        });
                    }
                    vm.getApiresourceDetail = getApiresourceDetail;

                    function addClaim()
                    {
                        vm.data.userClaims.push({ id: 0, type: vm.selectedClaimSupport });
                    }
                    vm.addClaim = addClaim;
                    function delClaim(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.userClaims[index];
                                        vm.data.userClaims = vm.data.userClaims.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delClaim = delClaim;

                    function addScope() {
                        vm.data.scopes.push({
                            id: 0,
                            name: '',
                            displayName: '',
                            description: null,
                            required: false,
                            emphasize: false,
                            showInDiscoveryDocument: true,
                            userClaims: []
                        });
                    }
                    vm.addScope = addScope;
                    function delScope(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete =>
                            {
                                if (willDelete)
                                {
                                    $timeout(function () {
                                        delete vm.data.scopes[index];
                                        vm.data.scopes = vm.data.scopes.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delScope = delScope;

                    function addSecret() {
                        swal({
                            title: '输入密钥，加密后将无法查看',
                            content: "input",
                        }).then(plaintext => {

                            if (plaintext == '') return;

                            swal("生成中，请稍等...", {
                                buttons: false
                            });

                            openapis.IdentityServer4MicroServiceClient.ClientPostSecretkey(vm.id,
                                {
                                    keyType: 0,
                                    plaintext: plaintext
                                }).then(r => {

                                    swal.close();

                                    if (r.code == 200) {
                                        swal({ title: '成功', icon: 'success' });
                                        $timeout(function () {
                                            vm.data.secrets.push({
                                                description: null,
                                                expiration: null,
                                                id: 0,
                                                type: "SharedSecret",
                                                value: r.data,
                                            });
                                        }, 1);

                                    }
                                    else {
                                        swal({ title: r.message, icon: 'error' });
                                    }
                                });
                        });
                    }
                    vm.addSecret = addSecret;
                    function delSecret(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.secrets[index];
                                        vm.data.secrets = vm.data.secrets.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delSecret = delSecret;

                    function createOrUpdate() {
                        if (vm.id > 0)
                        {
                            openapis.IdentityServer4MicroServiceClient.ApiResourcePut(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success' });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            });
                        }
                        else
                        {
                            openapis.IdentityServer4MicroServiceClient.ApiResourcePost(vm.data).then(r => {
                                if (r.code == 200)
                                {
                                    swal({ title: '成功', icon: 'success', closeOnClickOutside: false }).then(() =>
                                    {
                                        $timeout(() => {
                                            $location.path('/apiresources');
                                        }, 1);
                                    });
                                }
                                else
                                {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            })
                        }
                    }
                    vm.createOrUpdate = createOrUpdate;

                    function addScopeClaim(claims)
                    {
                        claims.push({ type: vm.selectedClaimSupport2 });
                    }
                    vm.addScopeClaim = addScopeClaim;

                    function delScopeClaim(outerIndex, index)
                    {
                        delete vm.data.scopes[outerIndex].userClaims[index];
                        vm.data.scopes[outerIndex].userClaims = vm.data.scopes[outerIndex].userClaims.filter(x => x != undefined);
                    }
                    vm.delScopeClaim = delScopeClaim;

                    parent.oidc.metadataService.getMetadata().then(r => {
                        $timeout(function () {
                            vm.claims_supported = r.claims_supported;
                        }, 1);
                    });

                    if (vm.id > 0) {
                        vm.getApiresourceDetail();
                    }
                }]
        });

})();
