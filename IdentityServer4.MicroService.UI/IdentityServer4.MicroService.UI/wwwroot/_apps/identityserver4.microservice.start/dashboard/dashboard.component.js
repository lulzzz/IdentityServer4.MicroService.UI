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
                $scope.tabIndex = 1;
                vm.apps = [];
                activate();

                function activate()
                {
                    $timeout(function () {
                        var _apps = [];
                        for (var k in parent.apps) {
                            _apps.push({
                                PackageName: k,
                                Name: parent.apps[k].Name,
                                DefaultApp: parent.apps[k].DefaultApp ? true : false,
                                Icon: parent.apps[k].Icon,
                                Description: parent.apps[k].Description
                            });
                        }
                        vm.apps = _apps;
                    }, 500);

                    vm.loading = false;
                }

                function removeApp(packageName) {

                    if (!confirm('是否确认删除？')) { return; }

                    $.post('/Home/RemoveApp', { packageName: packageName }, function (r) {

                        alert('删除成功！');
                    });
                } 
                vm.removeApp = removeApp;

                function registerApp() {
                    if (!confirm('是否确认发布？')) { return; }
                    var appIcon = $('#inputAppIcon').val();
                    var appName = $('#inputAppName').val();
                    var packageName = $('#inputPackageName').val();
                    var appDesc = $('#inputAppDescription').val();

                    $.post('/Home/RegisterApp', { packageName: packageName, menuName: appName, appIcon: appIcon, appDesc:appDesc }, function (r)
                    {

                    });
                }
                vm.registerApp = registerApp;

                vm.openApp = function (packageName) {
                    parent.openApp(packageName);
                };
            }]
        });

})();
