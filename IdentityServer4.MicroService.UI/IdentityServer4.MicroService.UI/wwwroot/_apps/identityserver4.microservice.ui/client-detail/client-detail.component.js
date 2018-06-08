(function () {
    'use strict';

    angular
        .module('h5')
        .component('clientDetail',
        {
            templateUrl: 'client-detail/client-detail.template.html',
            controller: ['$routeParams', '$timeout', '$location',
                function ClientDetailController($routeParams, $timeout, $location)
                {
                    this.id = $routeParams.id;
                    var vm = this;
                    vm.id = parseInt($routeParams.id);
                    vm.selectedGrantType = 'client_credentials&implicit';
                    vm.data = {
                        logoUri:'data:image/png;base64,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',
                        allowOfflineAccess: true,
                        allowAccessTokensViaBrowser: true,
                        enabled: true,
                        requireClientSecret: true,
                        frontChannelLogoutSessionRequired: true,
                        backChannelLogoutSessionRequired: true,
                        enableLocalLogin: true,

                        identityTokenLifetime: 300,// 5 minutes
                        accessTokenLifetime: 3600,//1 hour
                        authorizationCodeLifetime: 300,//5 minutes
                        absoluteRefreshTokenLifetime: 2592000,//30 days
                        slidingRefreshTokenLifetime: 1296000,// 15 days
                        protocolType: 'oidc',
                        accessTokenType: 0,

                        alwaysSendClientClaims: true,
                        clientClaimsPrefix: 'client_',

                        requireConsent: false,
                        allowRememberConsent: true,
                        consentLifetime: null,

                        claims: [],
                        clientSecrets: [],
                        allowedCorsOrigins: [],
                        allowedGrantTypes: [],
                        allowedScopes: [{ id: 0, scope: 'openid' }, { id: 0, scope: 'profile' }],
                        identityProviderRestrictions: [],
                        postLogoutRedirectUris: [],
                        redirectUris: [],
                        properties: [],
                    };

                    vm.protocolTypes = [
                        { label: 'OpenIdConnect', value: 'oidc' },
                        { label: 'WsFederation', value: 'wsfed' },
                        { label: 'Saml2p', value: 'saml2p' }
                    ];

                    vm.accessTokenTypes = [
                        { value: 0, name: 'jwt' },
                        { value: 1, name: 'reference' }
                    ];

                    vm.refreshTokenUsages = [
                        { value: 0, name: 'ReUse' },
                        { value: 1, name: 'OneTimeOnly' }
                    ];

                    vm.refreshTokenExpirations = [
                        { value: 0, name: 'Sliding' },
                        { value: 1, name: 'Absolute' }
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

                    vm.scopes = {};

                    vm.secretTypes = [
                        { label: 'SharedSecret', value: 'SharedSecret' },
                        { label: 'X509CertificateThumbprint', value: 'X509Thumbprint' },
                        { label: 'X509CertificateName', value: 'X509Name' },
                        { label: 'X509CertificateBase64', value: 'X509CertificateBase64' },
                    ];

                    vm.loading_getDetail = false;
                    function getClientDetail() {
                        if (vm.loading_getDetail == true) { return; }

                        vm.loading_getDetail = true;

                        openapis.IdentityServer4MicroServiceClient.ClientDetail(vm.id).then(r => {
                            $timeout(function () {

                                vm.loading_getDetail = false;
                                if (r.data) {
                                    vm.data = r.data;

                                    // 选中效果
                                    vm.selectedGrantType = r.data.allowedGrantTypes.map(x => x.grantType).sort().join('&');

                                }
                            }, 1);
                        });
                    }
                    vm.getClientDetail = getClientDetail;

                    function addClaim() {
                        vm.data.claims.push({ id: 0, type: '', value: '' });
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

                    function addSecret() {
                        swal({
                            title: '输入密钥，加密后将无法查看',
                            content: "input",
                        }).then(plaintext => {

                            if (plaintext == '' || plaintext.trim() == '') return;

                            swal("生成中，请稍等...", {
                                buttons: false
                            });

                            // id 必须是存在的
                            openapis.IdentityServer4MicroServiceClient.ClientPostSecretkey(vm.id < 1 ? 1 : vm.id,
                                {
                                    keyType: 0,
                                    plaintext: plaintext
                                }).then(r => {

                                    swal.close();

                                    if (r.code == 200) {
                                        swal({ title: '成功', icon: 'success' });
                                        $timeout(function () {
                                            vm.data.clientSecrets.push({
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
                                        delete vm.data.clientSecrets[index];
                                        vm.data.clientSecrets = vm.data.clientSecrets.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delSecret = delSecret;

                    function addCorsOrigin() {
                        vm.data.allowedCorsOrigins.push({
                            id: 0,
                            origin: ''
                        });
                    }
                    vm.addCorsOrigin = addCorsOrigin;
                    function delCorsOrigin(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.allowedCorsOrigins[index];
                                        vm.data.allowedCorsOrigins = vm.data.allowedCorsOrigins.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delCorsOrigin = delCorsOrigin;

                    function addGrantType() {
                        vm.data.allowedGrantTypes.push({
                            description: null,
                            expiration: null,
                            id: 1,
                            type: "SharedSecret",
                            value: "",
                        });
                    }
                    vm.addGrantType = addGrantType;
                    function delGrantType(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.allowedGrantTypes[index];
                                        vm.data.allowedGrantTypes = vm.data.allowedGrantTypes.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delGrantType = delGrantType;

                    function addScope() {

                        if (vm.data.allowedScopes.filter(x => x.scope == vm.selectedScope).length > 0)
                        {
                            swal({ icon: 'error', title: '重复添加' });

                            return;
                        }

                        vm.data.allowedScopes.push({
                            id: 0,
                            scope: vm.selectedScope
                        });
                    }
                    vm.addScope = addScope;
                    function delScope(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.allowedScopes[index];
                                        vm.data.allowedScopes = vm.data.allowedScopes.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delScope = delScope;

                    function addProperty() {

                        vm.data.properties.push({
                            id: 0,
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

                    function addIDPRestriction() {
                        vm.data.identityProviderRestrictions.push({
                            id: 0,
                            provider: ''
                        });
                    }
                    vm.addIDPRestriction = addIDPRestriction;
                    function delIDPRestriction(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.identityProviderRestrictions[index];
                                        vm.data.identityProviderRestrictions = vm.data.identityProviderRestrictions.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delIDPRestriction = delIDPRestriction;

                    function addPostLogoutRedirectUri() {
                        vm.data.postLogoutRedirectUris.push({
                            id: 0,
                            postLogoutRedirectUri: '',
                        });
                    }
                    vm.addPostLogoutRedirectUri = addPostLogoutRedirectUri;
                    function delPostLogoutRedirectUri(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.postLogoutRedirectUris[index];
                                        vm.data.postLogoutRedirectUris = vm.data.postLogoutRedirectUris.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delPostLogoutRedirectUri = delPostLogoutRedirectUri;

                    function addRedirectUri() {
                        vm.data.redirectUris.push({
                            id: 0,
                            redirectUri: ""
                        });
                    }
                    vm.addRedirectUri = addRedirectUri;
                    function delRedirectUri(index) {
                        swal({
                            title: "Are you sure?",
                            buttons: true,
                        })
                            .then(willDelete => {
                                if (willDelete) {
                                    $timeout(function () {
                                        delete vm.data.redirectUris[index];
                                        vm.data.redirectUris = vm.data.redirectUris.filter(x => x != undefined);
                                    }, 1);
                                }
                            });
                    }
                    vm.delRedirectUri = delRedirectUri;

                    function createOrUpdate() {

                        var currentGrantTypes = vm.data.allowedGrantTypes.map(x => x.grantType).sort().join('&');
                        if (currentGrantTypes != vm.selectedGrantType)
                        {
                            vm.data.allowedGrantTypes = vm.selectedGrantType.split('&').map(x => { return { grantType: x } });
                        }

                        if (vm.id > 0) {
                            openapis.IdentityServer4MicroServiceClient.ClientPut(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success' });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            });
                        }
                        else {
                            openapis.IdentityServer4MicroServiceClient.ClientPost(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success', closeOnClickOutside: false }).then(() => {
                                        $timeout(() => {
                                            $location.path('/clients');
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

                    if (vm.id > 0) {
                        vm.getClientDetail();
                    }

                    openapis.IdentityServer4MicroServiceClient.ApiResourceScopes().then(r => {
                        if (r.code == 200)
                        {
                            $timeout(() => { 
                                vm.scopes = r.data;
                            }, 1);

                            openapis.IdentityServer4MicroServiceClient.IdentityResourceGet().then(x => {

                                if (r.code == 200)
                                {
                                    $timeout(() => {
                                        vm.scopes['用户资源'] = x.data.map(x => { return { code: x.name, name: x.displayName } });
                                    }, 1);
                                }
                            })

                        }
                    });

                    $(function () {

                        $('#customFileLang').change(function (){
                            if (this.files.length < 1) { return; }
                            var file = this.files[0];
                            var formdata = new FormData();
                            formdata.append("value", file);

                            swal({
                                title: "是否确认上传?",
                                buttons: true,
                            })
                                .then(confirmUpload => {
                                    if (confirmUpload) {
                                        openapis.IdentityServer4MicroServiceClient.FileImage(formdata).then(r => {

                                            if (r.code == 200) {
                                                $timeout(() => {
                                                    vm.data.logoUri = r.data;
                                                }, 1);
                                            }
                                            else {
                                                swal({ title: r.message, icon: 'error' });
                                            }
                                        });
                                    }
                                    else {
                                        $('#customFileLang').val('');
                                    }
                                });
                        });
                    });
                }]
        });

})();
