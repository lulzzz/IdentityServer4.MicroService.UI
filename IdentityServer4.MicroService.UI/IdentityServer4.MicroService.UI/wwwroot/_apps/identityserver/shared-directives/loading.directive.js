(function () {
    'use strict';

    angular
        .module('h5')
        .directive('loading', function () {
            return {
                restrict: 'E',
                template: `
<div class="mdui-spinner mdui-spinner-colorful">
	<div class="mdui-spinner-layer mdui-spinner-layer-1">
		<div class="mdui-spinner-circle-clipper mdui-spinner-left">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-gap-patch">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-circle-clipper mdui-spinner-right">
			<div class="mdui-spinner-circle">
			</div>
		</div>
	</div>
	<div class="mdui-spinner-layer mdui-spinner-layer-2">
		<div class="mdui-spinner-circle-clipper mdui-spinner-left">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-gap-patch">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-circle-clipper mdui-spinner-right">
			<div class="mdui-spinner-circle">
			</div>
		</div>
	</div>
	<div class="mdui-spinner-layer mdui-spinner-layer-3">
		<div class="mdui-spinner-circle-clipper mdui-spinner-left">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-gap-patch">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-circle-clipper mdui-spinner-right">
			<div class="mdui-spinner-circle">
			</div>
		</div>
	</div>
	<div class="mdui-spinner-layer mdui-spinner-layer-4">
		<div class="mdui-spinner-circle-clipper mdui-spinner-left">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-gap-patch">
			<div class="mdui-spinner-circle">
			</div>
		</div>
		<div class="mdui-spinner-circle-clipper mdui-spinner-right">
			<div class="mdui-spinner-circle">
			</div>
		</div>
	</div>
</div>`
            };
        });
})();


(function () {
    'use strict';

    angular
        .module('h5')
        .filter('range', function () {
            return function (max) {
                var i, result = new Array;
                for (i = 0; max > i; i++) result.push(i);
                return result;
            };
        });
})();

