(function () {
    'use strict';

    angular
        .module('h5')
        .component('tenantDetail',
        {
            templateUrl: 'tenant-detail/tenant-detail.template.html',
            controller: ['$routeParams', '$timeout', '$location',
                function TenantDetailController($routeParams, $timeout, $location)
                {
                    var vm = this;
                    vm.id = parseInt($routeParams.id);
                    vm.defaultProperties = [
                        //common configuration
                        'WebSite',
                        'PortalSite',
                        'AdminSite',
                        'Keywords',
                        'Summary',
                        'Description',
                        'EnterpriseEmail',
                        'Tracking',
                        'Favicon',

                        // used for auth login
                        'Amazon:ClientId',
                        'Amazon:ClientSecret',

                        'Facebook:ClientId',
                        'Facebook:ClientSecret',

                        'GitHub:ClientId',
                        'GitHub:ClientSecret',

                        'Gitter:ClientId',
                        'Gitter:ClientSecret',

                        'Google:ClientId',
                        'Google:ClientSecret',

                        'Instagram:ClientId',
                        'Instagram:ClientSecret',

                        'LinkedIn:ClientId',
                        'LinkedIn:ClientSecret',

                        'Microsoft:ClientId',
                        'Microsoft:ClientSecret',

                        'Paypal:ClientId',
                        'Paypal:ClientSecret',

                        'QQ:ClientId',
                        'QQ:ClientSecret',

                        'Reddit:ClientId',
                        'Reddit:ClientSecret',

                        'Salesforce:ClientId',
                        'Salesforce:ClientSecret',

                        'Twitter:ClientId',
                        'Twitter:ClientSecret',

                        'Visual Studio Online:ClientId',
                        'Visual Studio Online:ClientSecret',

                        'Weibo:ClientId',
                        'Weibo:ClientSecret',

                        'Weixin:ClientId',
                        'Weixin:ClientSecret',

                        'WordPress:ClientId',
                        'WordPress:ClientSecret',


                        // used for AzureApiManagement
                        'Azure:ApiManagement:Host',
                        'Azure:ApiManagement:ApiId',
                        'Azure:ApiManagement:ApiKey',
                        'Azure:ApiManagement:AuthorizationServerId',
                        'Azure:ApiManagement:ProductId',
                        'Azure:ApiManagement:PortalUris',
                        'Azure:ApiManagement:DelegationKey',
                    ];

                    vm.data = {
                        createDate: new Date(),
                        lastUpdateTime: new Date(),
                        cacheDuration: 3600,
                        status: 1,
                        claims: [],
                        hosts: [],
                        properties: []
                    };

                    vm.defaultProperties.forEach(x => {
                        vm.data.properties.push(
                            { id: 0, appTenantId: vm.id, key: x, value: '' }
                        );
                    });

                    vm.status = [
                        { name: '待激活', value: 0 },
                        { name: '启用', value: 1 },
                        { name: '禁用', value: 2 },
                    ];
                    vm.loading_getDetail = false;
                    function getTenantDetail() {
                        if (vm.loading_getDetail == true) { return; }

                        vm.loading_getDetail = true;

                        openapis.IdentityServer4MicroServiceClient.TenantDetail(vm.id).then(r => {
                            $timeout(function () {

                                vm.loading_getDetail = false;
                                if (r.data) {
                                    vm.data = r.data;
                                }
                            }, 1);
                        });
                    }
                    vm.getTenantDetail = getTenantDetail;

                    if (vm.id > 0) {
                        vm.getTenantDetail();
                    }

                    function addClaim() {
                        vm.data.claims.push({
                            id: 0,
                            appTenantId: vm.id,
                            claimType: "",
                            claimValue: ""
                        });
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
                                        delete vm.data.claims[index];
                                        vm.data.claims = vm.data.claims.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delClaim = delClaim;

                    function addHost() {
                        vm.data.hosts.push({
                            id: 0,
                            appTenantId: vm.id,
                            hostName: ''
                        });
                    }
                    vm.addHost = addHost;
                    function delHost(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.hosts[index];
                                        vm.data.hosts = vm.data.hosts.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delHost = delHost;

                    function addProperty() {
                        vm.data.properties.push({
                            id: 0,
                            appTenantId: vm.id,
                            key: '',
                            value: ''
                        });
                    }
                    vm.addProperty = addProperty;
                    function delProperty(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.properties[index];
                                        vm.data.properties = vm.data.properties.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delProperty = delProperty;

                    function createOrUpdate() {
                        if (vm.id > 0) {
                            openapis.IdentityServer4MicroServiceClient.TenantPut(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success' });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            });
                        }
                        else {
                            openapis.IdentityServer4MicroServiceClient.TenantPost(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success', closeOnClickOutside: false }).then(() => {
                                        $timeout(() => {
                                            $location.path('/tenants');
                                        }, 1);
                                    });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            })
                        }
                    }
                    vm.createOrUpdate = createOrUpdate;
                }]
        });

})();
