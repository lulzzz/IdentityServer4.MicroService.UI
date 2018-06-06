(function () {
    'use strict';

    angular
        .module('h5')
        .directive('pager', function () {
            return {
                restrict: 'E',
                scope: !1,
                templateUrl: 'shared-directives/pager.directive.html'
            };
        });
})();
