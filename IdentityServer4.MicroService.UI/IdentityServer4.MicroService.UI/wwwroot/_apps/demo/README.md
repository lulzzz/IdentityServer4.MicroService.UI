结构说明
--
```txt
* 开发环境：wwwroot/_apps/{项目名称}
* 发布环境：wwwroot/apps/{项目名称}

* 打包：
    1，cmd 定位到解决方案根目录 
    2，gulp vendor.crowdfunding

* 安装引用第三方库：
    1，cmd 定位到 wwwroot/_apps/{项目名称}, 
    2，npm i {包名称}
    3，wwwroot/_apps/{项目名称}/index.html 
        <!-- build:js dist/vendor.min.js --> 
        这里把引用的文件拖入进来，比如：
        <script src="node_modules/jquery/dist/jquery.min.js"></script>
        <!-- endbuild -->

* 获取当前登录的用户/token/角色/权限等信息
    oidc.getUser().then(r => {})
```

路由配置
--
```javascript
// app.route.js

 $routeProvider.
  when('/phones', {
      template: '<phone-list></phone-list>'
  }).
  //when('/phones/:phoneId', {
  //    template: '<phone-detail></phone-detail>'
  //}).
  otherwise('/phones');
```

接收参数
---
```javascript
controller: ['$http', '$routeParams',
  function PhoneDetailController($http, $routeParams) {
    var self = this;

    self.setImage = function setImage(imageUrl) {
      self.mainImageUrl = imageUrl;
    };

    $http.get('phones/' + $routeParams.phoneId + '.json').then(function(response) {
      self.phone = response.data;
      self.setImage(self.phone.images[0]);
    });
  }
]
```

访问 AppController对象
---

```html
// index.html
<p>{{app.ProductName}}</p>

// child.html
<p>{{$parent.app.ProductName}}</p>
```


访问 Controller对象
---
```html
<p>$ctrl.ProductName</p>
```

循环/if/show/hide
---
```html
<p ng-repeat="x in [1,2,3,4,5,6,7,8,9,10]">{{x}}</p>
<p ng-repeat="x in [1,2,3,4,5,6,7,8,9,10]" ng-show="x>3">{{x}}</p>
<p ng-repeat="x in [1,2,3,4,5,6,7,8,9,10]" ng-hide="x>3">{{x}}</p>
<p ng-repeat="x in [1,2,3,4,5,6,7,8,9,10]" ng-if="x>3">{{x}}</p>
```


引用的UI库参考
--
* https://www.mdui.org/
* https://material.io/tools/icons/?icon=games&style=outline