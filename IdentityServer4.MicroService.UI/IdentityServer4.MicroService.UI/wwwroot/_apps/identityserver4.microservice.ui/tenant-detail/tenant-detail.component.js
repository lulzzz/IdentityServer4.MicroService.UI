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
                    vm.oidc_authority = localStorage.getItem('oidc_authority');
                    vm.OAuthLogins = {};
                    vm.CommonConfig = {};
                    vm.AzureApim = {};

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

                    //vm.defaultProperties.forEach(x => {
                    //    vm.data.properties.push(
                    //        { id: 0, appTenantId: vm.id, key: x, value: '' }
                    //    );
                    //});

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
                                if (r.data)
                                {
                                    vm.data = r.data;

                                    bindOAuths();
                                    bindAzureApim();
                                    bindCommonConfig();
                                }
                            }, 1);
                        });
                    }
                    function bindOAuths() {
                        vm.OAuthLogins.AmazonClientId = vm.data.properties.filter(x => x.key == 'Amazon:ClientId')[0];
                        vm.OAuthLogins.AmazonClientSecret = vm.data.properties.filter(x => x.key == 'Amazon:ClientSecret')[0];

                        vm.OAuthLogins.FacebookClientId = vm.data.properties.filter(x => x.key == 'Facebook:ClientId')[0];
                        vm.OAuthLogins.FacebookClientSecret = vm.data.properties.filter(x => x.key == 'Facebook:ClientSecret')[0];

                        vm.OAuthLogins.GitHubClientId = vm.data.properties.filter(x => x.key == 'GitHub:ClientId')[0];
                        vm.OAuthLogins.GitHubClientSecret = vm.data.properties.filter(x => x.key == 'GitHub:ClientSecret')[0];

                        vm.OAuthLogins.GitterClientId = vm.data.properties.filter(x => x.key == 'Gitter:ClientId')[0];
                        vm.OAuthLogins.GitterClientSecret = vm.data.properties.filter(x => x.key == 'Gitter:ClientSecret')[0];

                        vm.OAuthLogins.GoogleClientId = vm.data.properties.filter(x => x.key == 'Google:ClientId')[0];
                        vm.OAuthLogins.GoogleClientSecret = vm.data.properties.filter(x => x.key == 'Google:ClientSecret')[0];

                        vm.OAuthLogins.InstagramClientId = vm.data.properties.filter(x => x.key == 'Instagram:ClientId')[0];
                        vm.OAuthLogins.InstagramClientSecret = vm.data.properties.filter(x => x.key == 'Instagram:ClientSecret')[0];

                        vm.OAuthLogins.LinkedInClientId = vm.data.properties.filter(x => x.key == 'LinkedIn:ClientId')[0];
                        vm.OAuthLogins.LinkedInClientSecret = vm.data.properties.filter(x => x.key == 'LinkedIn:ClientSecret')[0];

                        vm.OAuthLogins.MicrosoftClientId = vm.data.properties.filter(x => x.key == 'Microsoft:ClientId')[0];
                        vm.OAuthLogins.MicrosoftClientSecret = vm.data.properties.filter(x => x.key == 'Microsoft:ClientSecret')[0];

                        vm.OAuthLogins.PaypalClientId = vm.data.properties.filter(x => x.key == 'Paypal:ClientId')[0];
                        vm.OAuthLogins.PaypalClientSecret = vm.data.properties.filter(x => x.key == 'Paypal:ClientSecret')[0];

                        vm.OAuthLogins.QQClientId = vm.data.properties.filter(x => x.key == 'QQ:ClientId')[0];
                        vm.OAuthLogins.QQClientSecret = vm.data.properties.filter(x => x.key == 'QQ:ClientSecret')[0];

                        vm.OAuthLogins.RedditClientId = vm.data.properties.filter(x => x.key == 'Reddit:ClientId')[0];
                        vm.OAuthLogins.RedditClientSecret = vm.data.properties.filter(x => x.key == 'Reddit:ClientSecret')[0];

                        vm.OAuthLogins.SalesforceClientId = vm.data.properties.filter(x => x.key == 'Salesforce:ClientId')[0];
                        vm.OAuthLogins.SalesforceClientSecret = vm.data.properties.filter(x => x.key == 'Salesforce:ClientSecret')[0];

                        vm.OAuthLogins.TwitterClientId = vm.data.properties.filter(x => x.key == 'Twitter:ClientId')[0];
                        vm.OAuthLogins.TwitterClientSecret = vm.data.properties.filter(x => x.key == 'Twitter:ClientSecret')[0];

                        vm.OAuthLogins.WeiboClientId = vm.data.properties.filter(x => x.key == 'Weibo:ClientId')[0];
                        vm.OAuthLogins.WeiboClientSecret = vm.data.properties.filter(x => x.key == 'Weibo:ClientSecret')[0];

                        vm.OAuthLogins.VisualStudioOnlineClientId = vm.data.properties.filter(x => x.key == 'Visual Studio Online:ClientId')[0];
                        vm.OAuthLogins.VisualStudioOnlineClientSecret = vm.data.properties.filter(x => x.key == 'Visual Studio Online:ClientSecret')[0];

                        vm.OAuthLogins.WeixinClientId = vm.data.properties.filter(x => x.key == 'Weixin:ClientId')[0];
                        vm.OAuthLogins.WeixinClientSecret = vm.data.properties.filter(x => x.key == 'Weixin:ClientSecret')[0];

                        vm.OAuthLogins.WordPressClientId = vm.data.properties.filter(x => x.key == 'WordPress:ClientId')[0];
                        vm.OAuthLogins.WordPressClientSecret = vm.data.properties.filter(x => x.key == 'WordPress:ClientSecret')[0];
                    }
                    function bindAzureApim() {
                        vm.AzureApim.Host = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:Host')[0];
                        vm.AzureApim.ApiId = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:ApiId')[0];
                        vm.AzureApim.ApiKey = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:ApiKey')[0];
                        vm.AzureApim.AuthorizationServerId = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:AuthorizationServerId')[0];
                        vm.AzureApim.ProductId = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:ProductId')[0];
                        vm.AzureApim.PortalUris = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:PortalUris')[0];
                        vm.AzureApim.DelegationKey = vm.data.properties.filter(x => x.key == 'Azure:ApiManagement:DelegationKey')[0];

                    }
                    function bindCommonConfig() {
                        vm.CommonConfig.WebSite = vm.data.properties.filter(x => x.key == 'WebSite')[0];
                        vm.CommonConfig.PortalSite = vm.data.properties.filter(x => x.key == 'PortalSite')[0];
                        vm.CommonConfig.AdminSite = vm.data.properties.filter(x => x.key == 'AdminSite')[0];
                        vm.CommonConfig.Keywords = vm.data.properties.filter(x => x.key == 'Keywords')[0];
                        vm.CommonConfig.Summary = vm.data.properties.filter(x => x.key == 'Summary')[0];
                        vm.CommonConfig.Description = vm.data.properties.filter(x => x.key == 'Description')[0];
                        vm.CommonConfig.EnterpriseEmail = vm.data.properties.filter(x => x.key == 'EnterpriseEmail')[0];
                        vm.CommonConfig.Tracking = vm.data.properties.filter(x => x.key == 'Tracking')[0];
                        vm.CommonConfig.Favicon = vm.data.properties.filter(x => x.key == 'Favicon')[0];
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
