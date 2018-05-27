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

                        alwaysSendClientClaims:true,
                        clientClaimsPrefix: 'client_',

                        requireConsent: true,
                        allowRememberConsent: true,
                        consentLifetime: null,

                        claims: [],
                        clientSecrets: [],
                        allowedCorsOrigins: [],
                        allowedGrantTypes: [],
                        allowedScopes: [],
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
                        { label: '简化模式', grantType: 'implicit' },
                        { label: '简化模式 + 客户端模式', grantType: 'client_credentials&implicit' },

                        { label: '授权码模式', grantType: 'authorization_code' },
                        { label: '授权码模式 + 客户端模式', grantType: 'authorization_code&client_credentials' },

                        { label: '混合模式', grantType: 'hybrid' },
                        { label: '混合模式 + 客户端模式', grantType: 'client_credentials&hybrid' },

                        { label: '密码模式', grantType: 'password' },
                        { label: '密码模式 + 客户端模式', grantType: 'client_credentials&password' },

                        { label: '客户端模式', grantType: 'client_credentials' },
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
                        vm.data.claims.push({ id: 0, type: "" });
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

                            if (plaintext == '') return;

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
                            description: null,
                            expiration: null,
                            id: 1,
                            type: "SharedSecret",
                            value: "",
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
                            description: null,
                            expiration: null,
                            id: 1,
                            type: "SharedSecret",
                            value: "",
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
                            description: null,
                            expiration: null,
                            id: 1,
                            type: "SharedSecret",
                            value: "",
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
                            description: null,
                            expiration: null,
                            id: 1,
                            type: "SharedSecret",
                            value: "",
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

                            openapis.IdentityServer4MicroServiceClient.IdentityresourceGet().then(x => {

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
