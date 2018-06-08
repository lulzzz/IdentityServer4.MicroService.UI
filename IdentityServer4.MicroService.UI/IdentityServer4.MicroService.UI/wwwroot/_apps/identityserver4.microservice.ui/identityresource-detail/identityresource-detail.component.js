(function () {
    'use strict';

    angular
        .module('h5')
        .component('identityresourceDetail',
        {
            templateUrl: 'identityresource-detail/identityresource-detail.template.html',
            controller: ['$routeParams', '$timeout', '$location',
                function IdentityresourceDetailController($routeParams, $timeout, $location)
                {
                    var vm = this;
                    vm.id = parseInt($routeParams.id);
                    vm.data = {
                        userClaims: []
                    };

                    vm.loading_getDetail = false;
                    function getIdentityresourceDetail() {
                        if (vm.loading_getDetail == true) { return; }

                        vm.loading_getDetail = true;

                        openapis.IdentityServer4MicroServiceClient.IdentityResourceDetail(vm.id).then(r => {
                            $timeout(function () {

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
                    vm.getIdentityresourceDetail = getIdentityresourceDetail;

                    if (vm.id > 0) {
                        vm.getIdentityresourceDetail();
                    }

                    function addClaim() {
                        vm.data.userClaims.push({ id: 0, type: "" });
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

                    function createOrUpdate() {
                        if (vm.id > 0) {
                            openapis.IdentityServer4MicroServiceClient.IdentityResourcePut(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success' });
                                }
                                else {
                                    swal({ title: r.message, icon: 'error' });
                                }
                            });
                        }
                        else {
                            openapis.IdentityServer4MicroServiceClient.IdentityresourcePost(vm.data).then(r => {
                                if (r.code == 200) {
                                    swal({ title: '成功', icon: 'success', closeOnClickOutside: false }).then(() => {
                                        $timeout(() => {
                                            $location.path('/identityresources');
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
