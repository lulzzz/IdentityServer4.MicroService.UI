(function () {
    'use strict';

    angular
        .module('h5')
        .component('apiresourceSdkgen',
        {
            templateUrl: 'apiresource-sdkgen/apiresource-sdkgen.template.html',
            controller: ['$routeParams', '$timeout', '$location','$scope',
                function ApiresourceSdkgenController($routeParams, $timeout, $location, $scope)
                {
                    var vm = this;

                    vm.id = parseInt($routeParams.id);

                    $scope.$watch('tabIndex', function (newValue, oldValue)
                    {
                        switch (newValue) {

                            case 0:
                                vm.getHistories();
                                break;

                            case 1:
                                vm.getNPMOptions(0);
                                break;

                            case 2:
                                vm.getApiResourcePackages();
                                break;
                        }
                    })

                    /**
                     * 设置发布配置
                     * @param {any} tbIndex
                     */
                    vm.configView = function (tbIndex) {
                        $timeout(function () {
                            $scope.tabIndex = 1;
                            $scope.tab2Index = tbIndex;
                        }, 1);

                        vm.getNPMOptions(tbIndex);
                    }



                    /**
                    * 获取所有版本
                    * */
                    vm.loading_getVersions = false;
                    function getVersions() {
                        if (vm.loading_getVersions == true) { return; }

                        vm.loading_getVersions = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceVersions(vm.id).then(r => {
                            $timeout(function () {
                                vm.loading_getVersions = false;

                                if (r.data) {
                                    r.data.forEach(v => {
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
                  * 获取发包渠道NPM配置
                  * */
                    vm.loading_getHistories = false;
                    function getHistories() {
                        if (vm.loading_getHistories == true) { return; }

                        vm.loading_getHistories = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenHistory(vm.id).then(r => {
                            $timeout(function () {
                                vm.loading_getHistories = false;
                                if (r.code == 200) {
                                    vm.histories = r.data;
                                }
                                else {
                                    toastr.error(r.message);
                                }
                            }, 1);
                        });
                    }
                    vm.getHistories = getHistories;

                    /**
                    * 获取发包渠道NPM配置
                    * */
                    vm.loading_getNPMOptions = false;
                    function getNPMOptions(languageKey) {
                        if (vm.loading_getNPMOptions == true) { return; }

                        vm.loading_getNPMOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenNpmOptions(vm.id, languageKey).then(r => {
                            $timeout(function () {
                                vm.loading_getNPMOptions = false;

                                if (r.code == 200) {
                                    vm.npmOptions = r.data;
                                }
                                else {
                                    toastr.error(r.message);
                                }
                            }, 1);
                        });
                    }
                    vm.getNPMOptions = getNPMOptions;

                    /**
                     * 更新发包渠道配置
                     * */
                    function setNPMOptions() {
                        if (vm.loading_getNPMOptions == true) { return; }

                        vm.loading_getNPMOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenPutNpmOptions(vm.id, $scope.tab2Index, vm.npmOptions).then(r => {
                            $timeout(function () {
                                vm.loading_getNPMOptions = false;
                            }, 1);

                            if (r.code == 200) {
                                alert('更新成功');
                            }
                            else {
                                toastr.error(r.message);
                            }

                        });
                    }
                    vm.setNPMOptions = setNPMOptions;

                    /**
                  * 发布SDK包
                  * */
                    vm.loading_releasePackage = false;
                    function releasePackage(aid, language) {
                        if (vm.loading_releasePackage == true) { return; }
                        if (!vm.commonOptions.swaggerUrl) {
                            swal('请先设置微服务的swaggerUrl', '操作提示', 'error');
                            $scope.tabIndex = 1;
                            $scope.tab2Index = 3;
                            return;
                        }

                        swal({
                            title: "是否确认发布?",
                            buttons: true,
                        })
                            .then(willPublish => {
                                if (willPublish) {
                                    releasePackage2(aid, language, vm.commonOptions.swaggerUrl);
                                }
                            });
                    }
                    vm.releasePackage = releasePackage;
                    /**
                   * 发布SDK包
                   * */
                    vm.loading_releasePackage = false;
                    function releasePackage2(aid, language, swaggerUrl) {
                        vm.loading_releasePackage = true;
                        openapis.IdentityServer4MicroServiceClient.CodeGenReleaseSDK(
                            {
                                platform: 0,
                                language: language,
                                apiId: vm.id,
                                swaggerUrl: swaggerUrl
                            }).then(r => {
                                $timeout(function () {
                                    vm.loading_releasePackage = false;
                                }, 1);

                                if (r.code == 200) {
                                    alert('发布成功');
                                }
                                else {
                                    toastr.error(r.message);
                                }
                            });
                    }

                    /**
                     * 获取发包渠道Github配置
                     * */
                    vm.githubOptions = {
                        syncLabels: true,
                        syncDocs: true,
                        userAgent: 'Awosome IdentityServer4 MicroService'
                    };
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
                                toastr.error(r.message);
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
                                toastr.error(r.message);
                            }
                        });
                    }
                    vm.setGithubOptions = setGithubOptions;
                    function getGithubToken() {
                        window.open('https://github.com/login/oauth/authorize?client_id=Iv1.03f5f066b1789e5e&redirect_uri=https://app.getpostman.com/oauth2/callback&scope=administration issues pull requests code metadata public_repo repo');

                        swal({
                            title: '请将授权成功后的Code粘贴进来',
                            content: "input",
                        }).then(codetext => {

                            if (codetext == undefined || codetext == '') return;

                            swal("生成中，获取中...",
                                {
                                    buttons: false
                                });

                            $.ajax({
                                url: '/Home/GithubToken?code=' + codetext,
                            }).then(r => {

                                swal.close();

                                $timeout(function () {
                                    try {
                                        vm.githubOptions.token = r.split('&')[0].split('=')[1];
                                    }
                                    catch (err) { }
                                }, 1);
                            });

                        });
                    }
                    vm.getGithubToken = getGithubToken;
                    /**
                     * 同步github 标签、接口文档
                     * */
                    vm.loading_syncGithub = false;
                    function syncGithub() {

                        swal({
                            title: "是否确认发布?",
                            buttons: true,
                        })
                            .then(willPublish => {
                                if (willPublish) {
                                    if (vm.loading_syncGithub == true) { return; }

                                    vm.loading_syncGithub = true;

                                    openapis.IdentityServer4MicroServiceClient.CodeGenSyncGithub(
                                        vm.id).then(x => {
                                            $timeout(function () {
                                                vm.loading_syncGithub = false;
                                            }, 1);
                                            if (x.code == 200) {
                                                alert('提交同步任务成功');
                                            }
                                            else {
                                                toastr.error(x.message);
                                            }
                                        });
                                }
                            });
                    }
                    vm.syncGithub = syncGithub;


                    /**
                    * 包市场增,删,改,查
                    * */
                    vm.loading_packages = false;
                    vm.packagePlatforms = ['npm', 'nuget', 'gradle', 'spm', 'postman'];
                    vm.package = {
                        showIndex: 0,
                        packagePlatform: 'npm',
                        publisher: 'unkonw'
                    };
                    function getApiResourcePackages() {
                        if (vm.loading_packages == true) { return; }

                        vm.loading_packages = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourcePackages(
                            vm.id).then(x => {
                                if (x.code != 200) {
                                    toastr.error(x.message);
                                }
                                $timeout(function () {
                                    vm.loading_packages = false;
                                    vm.packages = x.data;
                                }, 1);
                            });
                    }
                    function postApiResourcePackage() {
                        if (vm.loading_packages == true) { return; }

                        vm.loading_packages = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourcePostPackage(
                            vm.id, vm.package).then(x => {

                                $timeout(function () {
                                    vm.loading_packages = false;
                                }, 1);

                                if (x.code != 200) {
                                    toastr.error(x.message);
                                }

                                vm.getApiResourcePackages();
                            });
                    }
                    function delApiResourcePackage(rowKey) {
                        if (vm.loading_packages == true) { return; }

                        vm.loading_packages = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourceDeletePackage(
                            vm.id, rowKey).then(x => {

                                $timeout(function () {
                                    vm.loading_packages = false;
                                }, 1);

                                if (x.code != 200) {
                                    toastr.error(x.message);
                                }

                                vm.getApiResourcePackages();
                            });
                    }
                    function putApiResourcePackage(entity) {
                        if (vm.loading_packages == true) { return; }

                        vm.loading_packages = true;

                        openapis.IdentityServer4MicroServiceClient.ApiResourcePutPackage(
                            vm.id, entity.rowKey, entity).then(x => {

                                $timeout(function () {
                                    vm.loading_packages = false;
                                }, 1);

                                if (x.code != 200) {
                                    toastr.error(x.message);
                                }

                                vm.getApiResourcePackages();
                            });
                    }
                    vm.getApiResourcePackages = getApiResourcePackages;
                    vm.postApiResourcePackage = postApiResourcePackage;
                    vm.delApiResourcePackage = delApiResourcePackage;
                    vm.putApiResourcePackage = putApiResourcePackage;


                    /**
                   * 获取发包渠道基本配置
                   * */
                    vm.loading_getCommonOptions = false;
                    function getCommonOptions(languageKey) {
                        if (vm.loading_getCommonOptions == true) { return; }

                        vm.loading_getCommonOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenCommonOptions(vm.id).then(r => {
                            $timeout(function () {
                                vm.loading_getCommonOptions = false;

                                if (r.code == 200) {
                                    vm.commonOptions = r.data;
                                }
                                else {
                                    toastr.error(r.message);
                                }
                            }, 1);
                        });
                    }
                    vm.getCommonOptions = getCommonOptions;

                    /**
                     * 更新发包渠道配置
                     * */
                    function setCommonOptions() {
                        if (vm.loading_getCommonOptions == true) { return; }

                        vm.loading_getCommonOptions = true;

                        openapis.IdentityServer4MicroServiceClient.CodeGenPutCommonOptions(vm.id, vm.commonOptions).then(r => {
                            $timeout(function () {
                                vm.loading_getCommonOptions = false;
                            }, 1);

                            if (r.code == 200) {
                                alert('更新成功');
                            }
                            else {
                                toastr.error(r.message);
                            }

                        });
                    }
                    vm.setCommonOptions = setCommonOptions;

                    if (vm.id > 0) {
                        vm.getVersions();
                    }
                }]
        });

})();
