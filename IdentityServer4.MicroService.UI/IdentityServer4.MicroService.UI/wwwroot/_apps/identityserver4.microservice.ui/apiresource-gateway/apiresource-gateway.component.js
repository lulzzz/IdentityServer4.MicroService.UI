(function () {
    'use strict';

    angular
        .module('h5')
        .component('apiresourceGateway',
        {
            templateUrl: 'apiresource-gateway/apiresource-gateway.template.html',
            controller: ['$routeParams', '$timeout', '$scope','$q',
                function ApiresourceGatewayController($routeParams, $timeout, $scope, $q)
                {
                    var vm = this;
                    vm.id = $routeParams.id;
                    $scope.tabIndex = 0;

                    $scope.$watch('tabIndex', function (newValue, oldValue)
                    {
                        switch (newValue)
                        {
                            case 0:
                                vm.getPublishConfiguration();
                                vm.getVersions();
                                vm.getApiresourceProducts();
                                break;
                            case 1:
                                vm.getVersions();
                                break;

                            case 2:
                                vm.getReleases();
                                break;

                            case 3:
                                vm.getSubscriptions();
                                break;

                            case 4:
                                vm.getNPMOptions(0);
                                break;
                        }
                    })

                    vm.loading_getApiresourceProducts = false;
                    function getApiresourceProducts()
                    {
                        if (vm.loading_getApiresourceProducts == true) { return; }

                        vm.loading_getApiresourceProducts = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceProducts().then(r => {
                            $timeout(function () {
                                vm.loading_getApiresourceProducts = false;
                                if (r.data) {
                                    vm.products = r.data;

                                    setTimeout(function () { 
                                        $('#apiProductIdsSelect').select2();
                                    }, 300)
                                }
                            }, 1);
                        });
                    }
                    vm.getApiresourceProducts = getApiresourceProducts;

                    /**
                     *  获取产品组合
                     */
                    vm.loading_getPublishConfiguration = false;
                    function getPublishConfiguration()
                    {
                        if (vm.loading_getPublishConfiguration == true) { return; }

                        vm.loading_getPublishConfiguration = true;
                        
                        openapis.IdentityServer4MicroServiceClient.ApiResourcePublishconfiguration(vm.id).then(r =>
                        {
                            $timeout(function ()
                            {
                                vm.loading_getPublishConfiguration = false;
                                if (r.data)
                                {
                                    vm.data = r.data;
                                    
                                    if (vm.data.policy == null) {
                                        vm.data.policy = `<policies>
    <inbound>
        <cors>
            <allowed-origins>
                <origin>*</origin>
            </allowed-origins>
            <allowed-methods>
                <method>*</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
        </cors>
        <base />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>`;
                                    }
                                }
                            }, 1);
                        });
                    }
                    vm.getPublishConfiguration = getPublishConfiguration;

                    /**
                     *  获取Auth列表
                     */
                    vm.loading_getApiresourceAuthservers = false;
                    function getApiresourceAuthservers() {
                        if (vm.loading_getApiresourceAuthservers == true) { return; }

                        vm.loading_getApiresourceAuthservers = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceAuthservers().then(r => {
                            $timeout(function () {
                                vm.loading_getApiresourceAuthservers = false;
                                if (r.data) {
                                    vm.oauths = r.data;
                                }
                            }, 1);
                        });
                    }
                    vm.getApiresourceAuthservers = getApiresourceAuthservers;

                    /**
                     * 获取所有版本
                     * */
                    vm.loading_getVersions = false;
                    function getVersions()
                    {
                        if (vm.loading_getVersions == true) { return; }

                        vm.loading_getVersions = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceVersions(vm.id).then(r =>
                        {
                            $timeout(function ()
                            {
                                vm.loading_getVersions = false;

                                if (r.data)
                                {
                                    r.data.forEach(v =>
                                    {
                                        v.revisions = v.revisions.sort(r => r.apiRevision);

                                        vm.currentReversion = v.revisions.filter(x => x.isCurrent)[0].apiId;
                                    });

                                    vm.versions = r.data;
                                }
                            }, 1);
                        });
                    }
                    vm.getVersions = getVersions;

                    /**
                     * 获取更新说明列表
                     * */
                    vm.loading_getReleases = false;
                    function getReleases()
                    {
                        if (vm.versions.length < 1)
                        {
                            vm.loading_getReleases = false;

                            return;
                        }

                        if (vm.loading_getReleases == true) { return; }

                        vm.loading_getReleases = true;

                        vm.versions.forEach((v, index) =>
                        {
                            openapis.IdentityServer4MicroServiceClient.ApiResourceReleases(vm.id, v.id.replace('/apis/', '')).then(x =>
                            {
                                $timeout(function ()
                                {
                                    if (index + 1 == vm.versions.length) {
                                        vm.loading_getReleases = false;
                                    }

                                    v.releases = x.data;
                                }, 1);
                            });
                        });
                    }
                    vm.getReleases = getReleases;

                    /**
                     * 获取订阅列表
                     * */
                    vm.loading_getSubscriptions = false;
                    function getSubscriptions()
                    {
                        if (vm.loading_getSubscriptions == true) { return; }

                        vm.loading_getSubscriptions = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceSubscriptions(vm.id).then(r =>
                        {
                            $timeout(function ()
                            {
                                vm.loading_getSubscriptions = false;

                                vm.subscriptions = r.data;

                            }, 1);
                        });
                    }
                    vm.getSubscriptions = getSubscriptions;

                    /**
                     * 获取发包渠道NPM配置
                     * */
                    vm.loading_getNPMOptions = false;
                    function getNPMOptions(languageKey)
                    {
                        if (vm.loading_getNPMOptions == true) { return; }

                        vm.loading_getNPMOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenNpmoptions(vm.id, languageKey).then(r =>
                        {
                            $timeout(function ()
                            {
                                vm.loading_getNPMOptions = false;

                                if (r.code == 200){
                                    vm.npmOptions = r.data;
                                }
                                else{
                                    alert(r.message);
                                }
                            }, 1);
                        });
                    }
                    vm.getNPMOptions = getNPMOptions;

                    /**
                     * 更新发包渠道配置
                     * */
                    function setNPMOptions()
                    {
                        if (vm.loading_getNPMOptions == true) { return; }

                        vm.loading_getNPMOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenPutnpmoptions(vm.id, $scope.tab2Index, vm.npmOptions).then(r => {
                            $timeout(function () {
                                vm.loading_getNPMOptions = false;
                            }, 1);

                            if (r.code == 200) {
                                alert('更新成功');
                            }
                            else {
                                alert(r.message);
                            }

                        });
                    }
                    vm.setNPMOptions = setNPMOptions;

                    /**
                     * 获取发包渠道Github配置
                     * */
                    function getGithubOptions() {
                        if (vm.loading_getNPMOptions == true) { return; }
                        vm.loading_getNPMOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenGithubOptions(vm.id).then(r => {
                            $timeout(function () {
                                vm.loading_getNPMOptions = false;
                            }, 1);

                                if (r.code == 200) {
                                    vm.githubOptions = r.data;
                                }
                                else {
                                    alert(r.message);
                                }
                           
                        });
                    }
                    vm.getGithubOptions = getGithubOptions;
                    function setGithubOptions() {
                        if (vm.loading_getNPMOptions == true) { return; }
                        vm.loading_getNPMOptions = true;
                        openapis.IdentityServer4MicroServiceClient.CodeGenPutGithubOptions(vm.id, vm.githubOptions).then(r => {
                            $timeout(function () {
                                vm.loading_getNPMOptions = false;
                            }, 1);

                            if (r.code == 200) {
                                alert('更新成功');
                            }
                            else {
                                alert(r.message);
                            }
                        });
                    }
                    vm.setGithubOptions = setGithubOptions;

                    /**
                     * 发布版本
                     * */
                    vm.loading_publish = false;
                    function publish() {

                        if (vm.loading_publish == true) { return; }

                        var onOk = function (r) {
                            $timeout(function () {
                                vm.loading_publish = false;
                            }, 1);

                            if (r.code == 200) {
                                alert('发布成功');
                            }
                            else
                            {
                                alert(r.code + ':' + r.message);
                            }
                        };

                        // 首次发布
                        if (vm.versions.length < 1)
                        {
                            //alert('首次发布');
                            vm.loading_publish = true;
                            openapis.IdentityServer4MicroServiceClient.ApiResourcePublish(vm.id,
                                {
                                    name: vm.data.name,
                                    description: vm.data.description,
                                    apiId: vm.id,
                                    suffix: vm.data.suffix,
                                    swaggerUrl: vm.data.swaggerUrl,
                                    productIds: vm.data.productIds,
                                    authorizationServerId: vm.data.authorizationServerId,
                                    scope: vm.data.scope,
                                    openid: vm.data.openid,
                                    policy: vm.data.policy,
                                }).then(onOk);
                        }
                        else {

                            // 发布新版本
                            if (vm.selectedVersion == 'newVersion') {
                                if (vm.newVersionNumber == undefined) {
                                    alert('请填写新的版本号');
                                    return;
                                }

                                var model = {
                                    revisionId: '',
                                    apiVersionName: vm.newVersionNumber
                                };

                                //新版本的设置默认从最后一个版本获取
                                var lastVersionRevisions = vm.versions[vm.versions.length - 1].revisions;
                                model.revisionId = lastVersionRevisions[lastVersionRevisions.length - 1].apiId.replace('/apis/', '');

                                vm.loading_publish = true;
                                openapis.IdentityServer4MicroServiceClient.
                                    ApiResourcePublishversion(vm.id, model).then(onOk);
                            }

                            else {
                                if (vm.selectedVersion == undefined) {
                                    alert('请选择版本');
                                    return;
                                }

                                // 发新修订版
                                if (vm.selectedVersion.indexOf('.newRevision') > -1) {
                                    //alert('发布新修订版');
                                    var apiId = vm.selectedVersion.split('.newRevision')[0].replace('/apis/', '');
                                    vm.loading_publish = true;
                                    openapis.IdentityServer4MicroServiceClient.ApiResourcePublishrevision(vm.id,
                                        {
                                            apiId: apiId,
                                            swaggerUrl: vm.data.swaggerUrl,
                                            releaseNote: ''
                                        }).then(onOk);
                                }

                                // 更新指定版本
                                else {

                                    //alert('更新指定版本');
                                    vm.loading_publish = true;
                                    
                                    openapis.IdentityServer4MicroServiceClient.ApiResourcePublish(vm.id,
                                        {
                                            name: vm.data.name,
                                            description: vm.data.description,
                                            apiId: vm.selectedVersion.replace('/apis/', ''),
                                            suffix: vm.data.suffix,
                                            swaggerUrl: vm.data.swaggerUrl,
                                            productIds: vm.data.productIds,
                                            authorizationServerId: vm.data.authorizationServerId,
                                            scope: vm.data.scope,
                                            openid: vm.data.openid,
                                            policy: vm.data.policy
                                        }).then(onOk);
                                }
                            }
                        }
                    }
                    vm.publish = publish;

                   
                    /**
                    * 发布SDK包
                    * */
                    vm.loading_releasePackage = false;
                    function releasePackage(aid,language)
                    {
                        if (vm.loading_releasePackage == true) { return; }

                        vm.loading_releasePackage = true;
                        openapis.IdentityServer4MicroServiceClient.CodeGenReleasesdk(
                            {
                                platform: 0,
                                language: language,
                                apiId: vm.id,
                                swaggerUrl: 'https://portal.ixingban.com/docs/services/' + aid.replace('/apis/', '') + '/export?DocumentFormat=Swagger'
                            }).then(r =>
                            {
                                $timeout(function () {
                                    vm.loading_releasePackage = false;
                                }, 1);

                                if (r.code == 200) {
                                    alert('发布成功');
                                }
                                else {
                                    alert(r.message);
                                }
                            });
                    }
                    vm.releasePackage = releasePackage;
                    /**
                     * 上线
                     * */
                    function releaseRevision(aid)
                    {
                        if (vm.loading_releasePackage == true) { return; }

                        vm.loading_releasePackage = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceSetOnlineVersion(vm.id, aid.replace('/apis/', '')).then(x =>
                        {
                            $timeout(function () {
                                vm.loading_releasePackage = false;
                            }, 1);

                            if (x.code == 200)
                            {
                                alert('上线成功');
                                vm.getVersions();
                            }
                            else
                            {
                                alert(x.message);
                            }
                        });
                    }
                    vm.releaseRevision = releaseRevision;

                    /**
                     * 发布、更新、删除 发布历史记录
                     * */
                    vm.releasesItem = [];
                    vm.loading_updateRelease = false;
                    function createRelease(aid, itemIndex)
                    {
                        if (vm.loading_updateRelease == true) { return; }

                        vm.loading_updateRelease = true;

                        var notes = vm.releasesItem[itemIndex];

                        openapis.IdentityServer4MicroServiceClient.ApiResourcePostRelease(vm.id, { aid: aid.replace('/apis/', ''), notes: notes }).then(x =>
                        {
                            $timeout(function () {
                                vm.loading_updateRelease = false;
                            }, 1);

                            if (x.code == 200)
                            {
                                alert('创建成功');
                                vm.releasesItem[itemIndex] = '';
                                vm.getReleases();
                            }
                            else {
                                alert(x.message);
                            }
                        });
                    }
                    function updateRelease(item)
                    {
                        if (vm.loading_updateRelease == true) { return; }

                        vm.loading_updateRelease = true;

                        var ids = item.id.split('/');

                        openapis.IdentityServer4MicroServiceClient.ApiResourcePutRelease(vm.id, ids[ids.length - 1], { notes: item.notes }).then(x =>
                        {
                            $timeout(function () {
                                vm.loading_updateRelease = false;
                            }, 1);
                            if (x.code == 200)
                            {
                                alert('更新成功');
                                vm.getReleases();
                            }
                            else {
                                alert(x.message);
                            }
                        });
                    }
                    function removeRelease(releaseId)
                    {
                        if (vm.loading_updateRelease == true) { return; }

                        vm.loading_updateRelease = true;

                        var ids = releaseId.split('/');

                        openapis.IdentityServer4MicroServiceClient.ApiResourceDeleteRelease(vm.id, ids[ids.length - 1]).then(x =>
                        {
                            $timeout(function () {
                                vm.loading_updateRelease = false;
                            }, 1);

                            if (x.code == 200)
                            {
                                alert('删除成功');
                                vm.getReleases();
                            }
                            else {
                                alert(x.message);
                            }
                        });
                    }
                    vm.createRelease = createRelease;
                    vm.updateRelease = updateRelease;
                    vm.removeRelease = removeRelease;

                    $(function () { 
                        vm.getApiresourceProducts();
                        vm.getApiresourceAuthservers();
                    });

                }]
        });
})();
