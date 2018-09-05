(function () {
    'use strict';

    angular
        .module('h5')
        .component('dashboard',
        {
            templateUrl: 'dashboard/dashboard.template.html',
            controller: ['$scope', '$timeout', function DashboardController($scope, $timeout) {
                var vm = this;
                vm.loading = true;
                vm.versions = [];
                vm.apps = [];
                vm.icons = mduiicons;
                $scope.tabIndex = 1;
                activate();

                function activate()
                {
                    $timeout(function () {
                        var _apps = [];

                        for (var k in parent.apps) {
                            _apps.push($.extend({ PackageName: k, OnVersioning: true, OnUpdatingApp: false, OnRemoveApp: false }, parent.apps[k]));
                        }

                        vm.apps = _apps;

                        vm.apps.forEach(pkg => {
                            appVersions(pkg.PackageName);
                        });

                    }, 500);

                    vm.loading = false;
                }

                function removeApp(packageName,appItem) {

                    if (!confirm('是否确认删除？')) { return; }
                    $timeout(function () {
                        appItem.OnRemoveApp = true;
                    });

                    $.post('/Home/RemoveApp', { packageName: packageName }, function (r) {

                        alert('删除成功！');
                        $timeout(function () {
                            appItem.OnRemoveApp = false;
                        }, 1);
                    });
                } 
                vm.removeApp = removeApp;

                $scope.inputPackageName = '';
                $scope.OnRegisterApp = false;
                function registerApp() {
                    if (!confirm('是否确认发布？')) { return; }

                    $scope.OnRegisterApp = true;

                    $.post('/Home/RegisterApp', {
                        packageName: $('#inputPackageName').val(),
                        menuName: $scope.inputAppName,
                        appIcon: $scope.inputAppIcon,
                        appDesc: $scope.inputAppDescription
                    }, function (r) {
                        $timeout(function () {
                            $scope.OnRegisterApp = false;
                        }, 1);
                    });
                }

                vm.registerApp = registerApp;

                function appVersions(packageName)
                {
                    $.get('/Home/AppVersions?packageName=' + packageName, function (r) {
                        $timeout(function () {
                            vm.apps.forEach(pkg => {
                                if (pkg.PackageName == packageName)
                                {
                                    pkg.versions = r.msg;
                                    pkg.OnVersioning = false;
                                }
                            });
                        }, 1);
                    });
                }
                vm.appVersions = appVersions;

                function updateApp(packageName, appItem) {

                    $timeout(function () {
                        appItem.OnUpdatingApp = true;
                    });

                    $.post('/Home/UpdateApp?packageName=' + packageName, function (r) {
                        $timeout(function () {
                            appItem.OnUpdatingApp = false;
                        }, 1);
                    });
                }
                vm.updateApp = updateApp;

                $scope.onAppSearch = false;
                function appSearch()
                {
                    $scope.onAppSearch = true;
                    $.get('/Home/AppSearch?packageName=' + $scope.packageQuery, function (r) {
                        $timeout(function () {
                            $scope.onAppSearch = false;
                            $scope.searchResult = JSON.parse(r.msg);
                        }, 1);
                    });
                }
                vm.appSearch = appSearch;

                function setIcon(iconName)
                {
                    $scope.inputAppIcon = iconName;
                    $('#iconModal').modal('hide');
                }
                vm.setIcon = setIcon;
                
                $scope.$watch('packageQuery', function (newValue, oldValue) {
                    if ($scope.onAppSearch) { return; }

                    if (newValue != undefined && newValue.length > 3 && newValue != oldValue) {
                        vm.appSearch();
                    }
                });

                vm.openApp = function (packageName) {
                    parent.openApp(packageName);
                };
            }]
        });

})();
