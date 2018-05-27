(function () {
    'use strict';

    angular
        .module('h5')
        .component('phoneDetail',
        {
            templateUrl: 'phone-detail/phone-detail.template.html',
            controller: ['$routeParams',
                function PhoneDetailController($routeParams) {
                    this.phoneId = $routeParams.phoneId;
                }]
        });

})();
