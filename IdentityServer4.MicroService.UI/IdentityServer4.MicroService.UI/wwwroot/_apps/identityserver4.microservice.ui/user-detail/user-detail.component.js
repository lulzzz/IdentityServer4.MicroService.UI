(function () {
    'use strict';

    angular
        .module('h5')
        .component('userDetail',
        {
            templateUrl: 'user-detail/user-detail.template.html',
            controller: ['$routeParams', '$timeout', '$location',
                function UserDetailController($routeParams, $timeout, $location)
                {
                    var vm = this;
                    vm.uploadFileType = 0;
                    vm.FileTypes = [
                        { id: 0, name: '图片' },
                        { id: 1, name: '视频' },
                        { id: 2, name: '文档' }];

                    vm.id = parseInt($routeParams.id);
                    vm.data = {
                        claims: [],
                        roles: []
                    }
                    vm.defaultClaims = [
                        'permission',
                        'permission.ui'
                    ];

                    vm.defaultClaims.forEach(x => {
                        vm.data.claims.push(
                            { id: 0, userId: vm.id, claimType: x, claimValue: '' }
                        );
                    });

                    vm.loading_getDetail = false;
                    function getUserDetail() {
                        if (vm.loading_getDetail == true) { return; }

                        vm.loading_getDetail = true;

                        openapis.IdentityServer4MicroServiceClient.UserDetail(vm.id).then(r => {
                            $timeout(function () {

                                vm.loading_getDetail = false;
                                if (r.data) {
                                    vm.data = r.data;
                                    vm.selectedRoles = r.data.roles.map(x => parseInt(x.roleId)).sort();
                                }
                            }, 1);
                        });
                    }
                    vm.getUserDetail = getUserDetail;

                    vm.loading_getRole = false;
                    function getRole() {
                        if (vm.loading_getRole == true) { return; }

                        vm.loading_getRole = true;

                        openapis.IdentityServer4MicroServiceClient.RoleGet().then(r => {
                            $timeout(function () {
                                vm.loading_getRole = false;
                                if (r.data) {
                                    vm.roles = r.data;

                                    setTimeout(function () {
                                        $('#UserRolesInput').select2();
                                    }, 300);

                                }
                            }, 1);
                        });
                    }
                    vm.getRole = getRole;

                    if (vm.id > 0) {
                        vm.getUserDetail();
                    }

                    function addClaim() {
                        vm.data.claims.push({
                            id: 0,
                            userId: vm.id,
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

                    function addProperty() {
                        vm.data.properties.push({
                            id: 0,
                            userId: vm.id,
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

                        var currentRoles = vm.data.roles.map(x => parseInt(x.roleId)).sort().join('&');

                        if (currentRoles != vm.selectedRoles.join('&')) {
                            vm.data.roles = vm.selectedRoles.map(x => { return { userId: vm.id, roleId: x } });
                        }

                        if (vm.id > 0) {
                            openapis.IdentityServer4MicroServiceClient.UserPut(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success' });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            });
                        }
                        else {
                            openapis.IdentityServer4MicroServiceClient.UserPost(vm.data).then(r => {
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

                    vm.getRole();

                    $(function () {

                        $('#customFileLang').change(function () {
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
                                                    vm.data.avatar = r.data;
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

                        $('#uploadUserFile').change(function ()
                        {
                            if (this.files.length < 1) { return; }
                            var file = this.files[0];
                            var formdata = new FormData();
                            formdata.append("value", file);

                            swal({
                                title: "是否确认上传?",
                                buttons: true,
                            })
                                .then(confirmUpload =>
                                {
                                    if (confirmUpload)
                                    {
                                        var action = vm.uploadFileType == 0 ? openapis.IdentityServer4MicroServiceClient.FileImage(formdata)
                                            : openapis.IdentityServer4MicroServiceClient.FilePost(formdata);

                                        action.then(r => {

                                            if (r.code == 200) {
                                                $timeout(() => {

                                                    vm.data.files.push({
                                                        id:0,
                                                        fileType: vm.uploadFileType,
                                                        files: r.data
                                                    });

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
