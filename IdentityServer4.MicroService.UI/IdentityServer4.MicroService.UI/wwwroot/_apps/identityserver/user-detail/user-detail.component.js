(function () {
    'use strict';

    angular
        .module('h5')
        .component('userDetail',
        {
            templateUrl: 'user-detail/user-detail.template.html',
            controller: ['$routeParams',
                function UserDetailController($routeParams) {
                    this.id = $routeParams.id;
                }]
        });

})();
