# 关于

--------------------------------------------------------------   
使用HTML5和CSS来开发手机应用，一直是广大前端开发者的理想，并且已经有不少解决方案了。例如
- PhoneGap（用javascript来调用设备原生API）
- JQuery Mobile（UI库）
- Titanium（混合方式）
- AppCan（国产的开发工具）

Ionic是一个轻量的手机UI库，具有速度快，界面现代化、美观等特点。为了解决其他一些UI库在手机上运行缓慢的问题，它直接放弃了IOS6和Android4.1以下的版本支持，来获取更好的使用体验。

<!-- more -->

[资源](http://learn.ionicframework.com/resources/)
[案例展示](http://showcase.ionicframework.com/)
[实例](http://ionicframework.com/examples/)


# 快速开始

--------------------------------------------------------------
## 安装环境

首先应该安装好 node.js (略)，然后安装cordova、ionic等
```bash
sudo npm install -g cordova ionic ios-sim
```
## 创建不同类型的项目

目前可以用blank，tabs，sidemenu三种
```bash
ionic start myApp tabs
```

## 常用插件

cordova plugin add com.ionic.keyboard &&
cordova plugin add org.apache.cordova.console &&
cordova plugin add org.apache.cordova.device &&
cordova plugin add org.apache.cordova.device-motion &&
cordova plugin add org.apache.cordova.file &&
cordova plugin add org.apache.cordova.file-transfer &&
cordova plugin add org.apache.cordova.geolocation &&
cordova plugin add org.apache.cordova.inappbrowser &&
cordova plugin add org.apache.cordova.network-information &&
cordova plugin add org.apache.cordova.splashscreen &&
cordova plugin add org.apache.cordova.camera &&
cordova plugin add com.google.cordova.admob

## 测试运行

```bash
cd myApp
ionic platform add ios
ionic build ios
ionic emulate ios #会打开ios的模拟器
ionic run andoird #真机测试，需要先platform add andoird和build android
ionic serve #也可以先在浏览器里看效果，如果chrome安装了livereload插件，可以实现代码编辑时界面即时变化
```   

## 直接编辑IOS或Android工程   

可以直接用xcode或其他IDE来编辑 /platforms/xxxx/ 下的工程，但要注意的是，应该以项目根目录下的 /www/ 文件为主，而不要编辑/platforms/ios/www/ 里的文件。
运行下面的命令会自动用 /www/ 覆盖 /platforms/ios/www 里的文件
```bash
cordova prepare ios
```

www文件夹结构与文件分析


开发项目


发布应用
在生成之前，去掉不需要的插件
```bash
cordova plugin rm org.apache.cordova.console 
```
发布到android
<application android:debuggable="true" android:hardwareAccelerated="true" android:icon="@drawable/icon" android:label="@string/app_name">
未完
签名。



# 常用/关键代码

-------------------------------------------------------------- 
## sidemenu布局

框架主界面 menu.html
```html
<ion-side-menus>
 
  <ion-pane ion-side-menu-content>
    <ion-nav-bar class="bar-positive nav-title-slide-ios7" animation="no-animation">
      <ion-nav-back-button class="button-clear"><i class="icon ion-ios7-arrow-back"></i> 返回</ion-nav-back-button>
    </ion-nav-bar>
    <ion-nav-view name="menuContent" animation="slide-left-right"></ion-nav-view>
  </ion-pane>
 
  <ion-side-menu side="left">
    <header class="bar bar-header bar-light">
      <h1 class="title">导航</h1>
    </header>
    <ion-content class="has-header">
      <div class="list">
        <div class="item item-divider">更多</div>
        <a class="item item-icon-left" nav-clear menu-close ng-href="#/app/setting">
          <i class="icon ion-android-settings"></i>
          设置
        </a>
      </div>
 
    </ion-content>
  </ion-side-menu>
</ion-side-menus>
```
关键：
1. 页面整体用`<ion-side-menus>`容器包裹
2. 主界面容器用`<ion-pane ion-side-menu-content>`包裹，内部用`<ion-nav-view>`来实现多个界面切换（ 注意这个属性name="menuContent"在app.js的.state方法里使用）。
3. 显示导航条`<ion-nav-bar>` 和内部的`<ion-nav-back-button>`返回按钮（默认只有在进入二级界面时才显示，在子页面模板里通过 `<ion-nav-buttons side="left">`来“注入”一个“展开菜单”的按钮）
4. 侧滑菜单容器用`<ion-side-menu side="left">`包裹，side表示方向，注意内部的元素加上 nav-clear menu-close  属性，确保点击后会触发隐藏侧滑菜单
5. 可以设置ion-nav-view的animation属性实现界面切换的动画效果（设为no-animation提高性能）

然后在 `templates/` 目录里添加多个用于切换的模板文件，通过 `app.js` 里的路由来设置切换逻辑
模板文件的标准格式为：（以一个带导航条按钮和底部tab的模板为例），如果是次一级的页面，不要添加 `ion-nav-buttons` 元素，系统会默认显示在 menu.html 里定义好了的 返回按钮
```html
<ion-view title="{{typeDetail.title}}">

  <ion-nav-buttons side="left">
    <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
  </ion-nav-buttons>

  <ion-content class="has-header">
    内部
  </ion-content>
 
  <div class="tabs-top tabs-striped tabs-background-positive tabs-color-light">
    <div class="tabs tabs-icon-top">
      <a class="tab-item active">
        <i class="icon ion-home"></i>
        正在使用
      </a>
    </div>
  </div>
 
</ion-view>
```

## app.js 参考

```javascript
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    //主框架（侧滑菜单）
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    //物品详情
    .state('app.item-detail', {
      url: "/itemDetail/:typeId/:itemId",
      views: {
        'menuContent' :{
          templateUrl: "templates/itemDetail.html",
          controller: 'ItemDetailCtrl'
        }
      }
    })
```

__注意`app.item-detail`页面__
- 设置了url格式`url: "/itemDetail/:typeId/:itemId",`，表示可以可以传入两个参数，名称分别为typeId和itemId。
- 在该页面对应的 controller `ItemDetailCtrl `中，可以通过`$stateParams.typeId`来获取参数的值；另外在html模板中，href要设置成类似`<a  ng-href="#/app/itemDetail/{{typeDetail.id}}/{{item.id}}">`格式，参数的位置要对应准确
- `views`的 `menuContent` 键值，和模板`menu.html`中 `<ion-nav-view name="menuContent"></ion-nav-view>` ，ion-nav-view 的name属性值是对应、相等的。


## service.js 参考

用sublime text的angular自动完成插件，智能完成的 .factory 方法代码无法运行，必须按如下的格式

```javascript
angular.module('babyThings.services', [])
.factory('Types', function() {
  var types = [
    {id: 1, title: '食品与喂养', icon: 'android-battery'},
    {id: 3, title: '尿裤湿巾', icon: 'woman'},
    {id: 4, title: '喂养用品', icon: 'woman'},
  ];
 
  return {
    all:function(){
      return types;
    },
    getLastActiveTypeIndex: function(){
      return parseInt(window.localStorage['lastActiveTypeIndex']) || 0;
    },
    setLastActiveTypeIndex: function(index){
      window.localStorage['lastActiveTypeIndex'] = index;
    },
    getTypeDetail: function(typeid){
      return types[typeid-1];
    },
    allDefault: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
  };
})
```

注意`newProject `的return，返回了一个比较复杂一点的对象。`allDefault `还处理了默认返回空数组。

## controllers.js参考

__controller参考__
```javascript
angular.module('babyThings.controllers', [])
.controller('ItemsCtrl', function($scope, $stateParams, Types, Items) {
  var storedTypeId= Types.getLastActiveTypeIndex();
 
  var selectTypeId = $stateParams.typeId;
  console.log('typeid:', selectTypeId);
 
  $scope.typeDetail = Types.getTypeDetail(selectTypeId);
  $scope.items = Items.getItemsOfType(selectTypeId);
 
})
```
在浏览器控制台输出参数`console.log('typeid:', selectTypeId);`
读取url里传递过来的参数 `var selectTypeId = $stateParams.typeId;`，参数名在 app.js 里和 ng-href="" 里要名称对应（见后面）

__定时消失的modal对话框__
```javascript
.controller('AppCtrl', function($scope, $ionicModal, $timeout, Types) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() { 
      $scope.closeLogin();
    }, 1000);
  };
})
```

## 一些关键代码

### 跨域解决

服务器端CORS（php为例，注意不要有代码错误，如果代码错了，下面的跨域处理会无效）
header("Access-Control-Allow-Origin: *");
echo json_encode($data);

ionic内可以用$.ajax（jQuery），也可以用$http.get来发出请求

# 颜色、图标、padding、动画

--------------------------------------------------------------  
按钮、toggle、footer、导航条背景等可以通过修改class来实现几种通用的颜色

可赋予颜色的元素，以蓝色 `positive`为例
- Tab背景 class="tab tabs-top tabs-background-positive"
- 按钮、toggle 颜色 class="button button-positive",  class="toggle toggle-assertive"
- 数值拉动条 class="item range range-positive"
- 顶部/底部通栏条 class="bar bar-header  bar-positive"（或 bar-footer）
- 文本/链接字颜色 class="item positive" 

__颜色后缀__
- 不带任何后缀   默认
- light   白色
- stable 浅灰色
- positive 蓝色
- calm 青色
- balanced 绿色
- energized 黄
- assertive 橙/红
- royal 紫
- dark 黑

__图标__
显示方式：通过 `<i class="icon ion-[图标名称]"></i>` 来显示

图标名称来源
1. 打开 [ionicon的图标库页面](http://ionicons.com/) ，点击页面里的图标找到名称
2. 还可以下载上面页面里的 ionicons-1.5.2.zip 压缩包，解压后找到里面的 png/512 对着文件名来修改

__padding__
可以为元素增加padding
padding
padding-vertical
padding-horizontal
padding-top Adds
padding-right
padding-bottom
padding-left

__动画效果__
fade-in
nav-title-slide-ios7
no-animation
reverse
slide-in-left
slide-in-right
slide-in-up
slide-left-right-ios7
slide-left-right
slide-out-left
slide-out-right
slide-right-left-ios7
slide-right-left

# 样式

--------------------------------------------------------------  
## 头部与底部

头部带大标题，可修改颜色

```html
<div class="bar bar-header">
  <h1 class="title">bar-assertive</h1>
</div>
```

子头部（在头部下面）

```html
<div class="bar bar-subheader">
  <h2 class="title">Sub Header</h2>
</div>
```

底部/底部带按钮、标题，如果只有一个居右的按钮，需要给button的class添加一个pull-right属性
```html
<div class="bar bar-footer">
  <button class="button button-clear">Left</button>
  <div class="title">Title</div>
  <button class="button button-clear">Right</button>
</div>
```

## 按钮

```html
<button class="button">button</button><!--普通，添加 button-[颜色] 实现不同色彩 -->
<button class="button button-block">button</button><!--有padding的全宽按钮-->
<button class="button button-full">button</button><!--无padding的全宽按钮-->
<button class="button button-small">button</button><!--尺寸不同的按钮 button-large-->
<button class="button button-outline">button</button><!--只有边框色，无背景色-->
<button class="button button-clear">button</button><!--只显示文本，没有边框和背景的干净按钮-->
<button class="button icon-left ion-home">button</button><!--带图标、文本的按钮，ion-chevron-left，ion-chevron-right用于显示一个小箭头-->
<button class="button icon ion-navicon"></button><!--放在bar-header中的头部导航按钮-->
<button class="button icon ion-gear-a"></button><!--纯图标，没有文本的按钮（但有边框）-->
<a class="button button-icon icon ion-settings"></a><!--纯图标，且没有边框-->
<div class="button-bar"><a class="button">First</a><a class="button">Second</a></div><!--按钮组-->
```

## 列表

普通列表（无padding）通过`<div class="list">`容器来包裹
有padding和边框的list，通过`<div class="list list-inset">`容器包裹
有“卡片”的边框阴影效果的list，通过`<div class="list card">`容器包裹

```html
<div class="item item-divider">  <!--不同组列表项之间的分割条-->
<a class="item" href="#">Butterfinger </a> <!--普通-->
<a class="item item-icon-left" href="#"><i class="icon ion-email"></i>Text </a> <!--带左侧图标-->
<a class="item item-icon-left item-icon-right" href="#"><i class="icon ion-email"></i>Text <i class="icon ion-email"></i></a> <!--带左侧、右侧两个图标-->
<a class="item item-icon-left" href="#"><i class="icon ion-email"></i>Text <span class="item-note">note</span></a> <!--带左侧图标、右侧灰色文本-->
<a class="item item-icon-left" href="#"><i class="icon ion-email"></i>Text <span class="badge badge-assertive">0</span></a> <!--带左侧图标、右侧彩色badge-->
<div class="item item-button-right">Call Me <button class="button button-positive"><i class="icon ion-ios7-telephone"></i></button></div><!--带右侧按钮-->
<a class="item item-avatar" href="#"><img src="venkman.jpg"><h2>Venkman</h2> <p>Back off, man. I'm a scientist.</p></a><!--头像/用户名/简介列表外观-->
<a class="item item-thumbnail-left" href="#"><img src="venkman.jpg"><h2>Venkman</h2> <p>Back off, man. I'm a scientist.</p></a><!--缩略图/用户名/简介列表外观 可改为right-->
```


## 卡片（边框有阴影效果）

下面的例子可以去掉头部和底部，只保留中间部分的文本

```html
<div class="card">
  <div class="item item-divider">  I'm a Header in a Card! </div>
  <div class="item item-text-wrap">
    This is a basic Card with some text.
  </div>
  <div class="item item-divider">  I'm a Footer in a Card! </div>
</div>
```

漂亮的大图片card效果（顶部有个item-avatar的的item，底部有个彩色带图标的item）
实际上来自于list和card的结合改造

```html
<div class="list card">
 
  <div class="item item-avatar">
    <img src="avatar.jpg">
    <h2>Pretty Hate Machine</h2>
    <p>Nine Inch Nails</p>
  </div>
 
  <div class="item item-image">
    <img src="cover.jpg">
  </div>
 
  <a class="item item-icon-left assertive" href="#">
    <i class="icon ion-music-note"></i>
    Start listening
  </a>
 
</div>
```

中间有图、文本结合，底部有功能按钮(如分享)的复杂card，可用于文章显示

```html
<div class="list card">
 
  <div class="item item-avatar">
    <img src="mcfly.jpg">
    <h2>Marty McFly</h2>
    <p>November 05, 1955</p>
  </div>
 
  <div class="item item-body">
    <img class="full-image" src="delorean.jpg">
    <p>
      This is a "Facebook" styled Card. The header is created from a Thumbnail List item,
      the content is from a card-body consisting
    </p>
    <p> <a href="#" class="subdued">1 Like</a> <a href="#" class="subdued">5 Comments</a> </p>
  </div>
 
  <div class="item tabs tabs-secondary tabs-icon-left">
    <a class="tab-item" href="#"> <i class="icon ion-thumbsup"></i>  Like </a>
    <a class="tab-item" href="#"> <i class="icon ion-chatbox"></i> Comment </a>
  </div>
 
</div>
```

## 表单

实际上也是用`<div class="list">`来包裹的，为表单添加缩进和边框`<div class="list list-inset">`

__输入框input、textare__
```html
<label class="item item-input"><input type="text" placeholder="First Name"></label><!--普通输入框，没有左侧文本label-->
<label class="item item-input"><span class="input-label">Username</span><input type="text></label><!--普通输入框，左侧有文本label-->
<label class="item item-input item-stacked-label"><span class="input-label">Username</span><input type="text></label><!--文本label在上，输入框在下-->
<label class="item item-input  item-floating-label"><span class="input-label">Username</span><input type="text></label><!--默认文本label在上，但不显示，输入框在下，输入文本后label出现-->
```
__特殊的外观__
```html
<!--图标label-->
<div class="list list-inset">
  <label class="item item-input">
    <i class="icon ion-search placeholder-icon"></i>
    <input type="text" placeholder="Search">
  </label>
</div>
 
<!--输入框放入item的内部（有个背景色的“块”，而不是前面的“融合”），并可以添加按钮等元素-->
<div class="list">
  <div class="item item-input-inset">
    <label class="item-input-wrapper">
      <input type="text" placeholder="Email">
    </label>
    <button class="button button-small">
      Submit
    </button>
  </div>
</div>
 
<!--bar顶部的搜索框，把上面代码的list和item容器改为bar即可-->
<div class="bar bar-header item-input-inset">xxxxx</div>
```

__toggle__
```html
<li class="item item-toggle">
     HTML5
     <label class="toggle toggle-assertive">
       <input type="checkbox">
       <div class="track">
         <div class="handle"></div>
       </div>
     </label>
  </li>
``` 

__checkbox__
```html
<li class="item item-checkbox">
     <label class="checkbox">
       <input type="checkbox">
     </label>
     Flux Capacitor
  </li>
```
 
__radio__
```html
<label class="item item-radio">
    <input type="radio" name="group">
    <div class="item-content">
      Go
    </div>
    <i class="radio-icon ion-checkmark"></i>
  </label>
```

__range__
```html
<div class="item range range-positive">
    <i class="icon ion-ios7-sunny-outline"></i>
    <input type="range" name="volume" min="0" max="100" value="33">
    <i class="icon ion-ios7-sunny"></i>
  </div>
```

## tab

最完整的顶部、底部都有tab。
可调整的项目：
- 不使用icon的纯文本tab
- 不使用文本的纯图标tab
- icon方向在左边 `<div class="tabs tabs-icon-left">`，上方是 top（默认）

```html
<div class="tabs-striped tabs-top tabs-background-positive tabs-light">
    <div class="tabs">
      <a class="tab-item active" href="#">
        <i class="icon ion-home"></i> Test 
    </a>
      <a class="tab-item" href="#">
        <i class="icon ion-star"></i> Favorites 
    </a>
    </div>
  </div>
  <div class="tabs-striped tabs-background-dark tabs-color-assertive">
    <div class="tabs">
      <a class="tab-item active" href="#">
        <i class="icon ion-home"></i>  Test
      </a>
      <a class="tab-item" href="#">
        <i class="icon ion-star"></i>  Favorites
      </a>
    </div>
  </div>
```

## Grid

好像只有几种标准的比例数字 10,20,25,33,50,67,75,80,90
```html
<div class="row">
  <div class="col col-33 col-offset-67">.col</div>
</div>
```

多个col的对齐设置，可为top、center、bottom
```html
<div class="row row-bottom">
  <div class="col">.col</div>
  <div class="col">.col</div>
  <div class="col">.col</div>
  <div class="col">1<br>2<br>3<br>4</div>
</div>
```

Responsive Grid
没看懂。

## 自定义扩展样式

在开发中经常用到一些ionic没有提供的样式

#### 左侧avatar和大小标题，右侧图标/按钮的列表项
如果右侧是图标
>![](http://itjiaoshou.qiniudn.com/image/mobile/ionic_style_item_avatar_icon.png)

```html
    <a class="item item-avatar-left item-icon-right">
            <img ng-src="img/item_icons/naifen.png">
            <div>
                <h2>美素佳儿3段</h2>
                <p>喂养-奶粉 还能用 3 天</p>
            </div>
            <i class="icon ion-ios7-cart"></i>
        </a>
```

如果右侧是按钮
>![](http://itjiaoshou.qiniudn.com/image/mobile/ionic_style_item_avatar_button.png)

将上面部分代码改成`<a class="item item-avatar-left item-button-right">` 和 `<button classs="button button-clear>按钮</button>`

#### 左侧大小标题，右侧文本标签的列表项（以及强制左右分离的处理）
>![](http://itjiaoshou.qiniudn.com/image/mobile/ionic_style_item_title_right_badge.png)

```html
<a class="item row" ng-href="#/app/buyHistory">
			<span class="col">
				<h2>2014年7月5日</h2>
				<p>婴唯爱母婴店 帮宝适 XXL</p>
			</span>
			<span class="badge badge-positive">324元</span>
		</a>
```

# 技巧

## 如何让tab在某些页面里隐藏

http://stackoverflow.com/questions/23991852/how-do-i-hide-the-tabs-in-ionic-framework

下面的方法有问题，会导致黑屏
I know that this is answered already, but there's a more "angular way" of doing this that might be helpful. It's done by using a custom directive that you can apply on views that you don't want to show the bottom tab bar.

My solution to this on my app was:

1 - Use ng-hide binded to a rootScope variable on the tab bar, so I can hide/show it in any Controller/View of my app:

<ion-tabs ng-hide="$root.hideTabs" class="tabs-icon-only">
    <!-- tabs -->
</ion-tabs>
2 - Create a custom directive that, when present, will hide the tab bar (and will show the tab bar again when the view is destroyed/dismissed:

var module = angular.module('app.directives', []);
module.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});
3 - Apply it to specific views that don't need the tab bar visible:

<ion-view title="New Entry Form" hide-tabs>
    <!-- view content -->
</ion-view>
ps: I think this can be improved even further avoiding the need of the ng-hide on the <ion-tabs> declaration, letting the directive do all the "dirty work".


# 问题

--------------------------------------------------------------    
## 在ionic platform add ios时提示“no such file or directory '/xxxxxxxxx/plugins/ios.json'”

运行
```bash
sudo rm -rf platforms
sudo mkdir plugins
sudo ionic platform add ios
```
## 运行 ionic emulate ios 报错，改用 ios-sim 命令来启动模拟器

#### 错误摘要

>ios-sim[8517:168747] stderrPath:……
……
Usage of '--family' is deprecated in 3.x. Use --devicetypeid instead.
Usage of '--retina' is deprecated in 3.x. Use --devicetypeid instead.
过一段时间后提示 Simulator session timed out

#### 解决步骤

- 清空模拟器数据：
打开模拟器，点击菜单 IOS Simulator - Reset Contents and Settings

- 重装ios-sim 
```bash
sudo npm uninstall -g ios-sim
sudo npm install -g ios-sim
sudo npm install -g ios-deploy #首先安装这个。可能不需要，在查资料实验的过程中发现有网友提到这个，就顺便安装了
```

- 删除 /platform/，重新添加 ios 和 build
```bash
rm -rf platforms
sudo ionic platform remove ios
sudo ionic platform add ios
sudo ionic build ios
```

- 直接使用 ios-sim launch 命令启动app
后来查到 [ios-sim的完整命令行说明](https://github.com/phonegap/ios-sim),
以及网友遇到的 sudo 权限导致无法启动模拟器的问题 [phonegap/ios-sim "Simulator session timed out" error](https://github.com/phonegap/ios-sim/issues/15)
记住，__千万不要使用 sudo __
```bash
ios-sim launch platforms/ios/build/emulator/your_ionic.app
```
发现默认启动了 iPhone4S 模拟器

- 手动指定iphone模拟器的型号/屏幕尺寸
因为我不想使用 iPhone4S 模拟器的3.5寸屏幕来观察应用运行，又不知道怎么调整默认启动的模拟器为4寸的 5S，因此在模拟器管理界面里删掉了 4s 这个设备。
后来发现  ios-sim 命令还有很多参数，其中 --devicetypeid  可以指定设备型号
参考 [查看ios-sim支持的所有的设备型号字符串](http://stackoverflow.com/questions/25799403/ios-sim-command-to-start-iphone-6-or-ipad-6)
我们选5s作为启动的模拟器，而且通过修改这个参数的值，随时可以切换不同的设备
```bash
ios-sim showdevicetypes #会列出所有支持的设备型号字符串
ios-sim launch platforms/ios/build/emulator/tigtag_life.app --devicetypeid com.apple.CoreSimulator.SimDeviceType.iPhone-5s
```
为了方便，你可以把这段命令存为一个 sh 文件，便于快速启动
```bash
echo 'ios-sim launch platforms/ios/build/emulator/tigtag_life.app --devicetypeid com.apple.CoreSimulator.SimDeviceType.iPhone-5 --retina' >> emulate.sh
chmod +x emulate.sh #允许执行
./emulate.sh #在需要启动模拟器的时候
```
希望 ionic 官方尽快解决  ionic emulate ios 命令报错的问题

## ionic build android 报错

在添加了系统变量
ANDROID_HOME
/Applications/android-sdk-macosx/tools/
以及解决ANT找不到问题后
brew update
brew install ant

仍然报错找不到 ANDROID_HOME 目录或 android 命令，但直接运行android -list 命令又正常

找到http://stackoverflow.com/questions/23960763/error-on-adding-platform-in-ionic-framework-on-windows
```bash
>vi .bash_profile
export ANDROID_HOME=/home/coutinho/android-sdk
export ANDROID_TOOLS=/home/coutinho/android-sdk/tools/ 
export ANDROID_PLATFORM_TOOLS=/home/coutinho/android-sdk/platform-tools/
PATH=$PATH:$ANDROID_HOME:$ANDROID_TOOLS:$ANDROID_PLATFORM_TOOLS:.
```

然后删除/platform/android目录，重新add和build即可

## 真机环境下，图片无法加载

把<img src="img/xxxx" 改成  <img ng-src="img/xxxx"即可

## 安装和启动livereload server这个软件后，运行 ionic serve报错

>... Uhoh. Got error listen EADDRINUSE ...
Error: listen EADDRINUSE
    at errnoException (net.js:904:11)
    at Server._listen2 (net.js:1042:14)
    at listen (net.js:1064:10)
    at Server.listen (net.js:1138:5)
    at Server.listen (/usr/local/lib/node_modules/ionic/node_modules/tiny-lr-fork/lib/server.js:138:15)
    at Object.IonicTask.start (/usr/local/lib/node_modules/ionic/lib/ionic/serve.js:157:16) 略

- 可以退出livereload软件，释放端口
- 可以通过 ionic serve 8101 35739 指定端口

## 生成包（product archive）后，使用organizer的验证/提交提示图标错误的问题

主要是提示文件找不到，或itunes store 要求120x120图标的问题

首先使用Appicon(从app store下载)或在线工具，生成所有文件（icons和splash screen）。

删除原cordova自动在resources里生成的文件，替换

在文件管理器里删除原来的文件（因为直接删掉了，变成红色），然后Add Files To,把新文件添加进去

编辑 plist文件，修改原来的iphone和ipad图标、启动图

```xml
<string>appicon.png</string>
    <key>CFBundleIcons</key>
    <dict>
      <key>CFBundlePrimaryIcon</key>
      <dict>
        <key>CFBundleIconFiles</key>
        <array>
            <string>appicon@2x.png</string>
            <string>appicon.png</string>
            <string>appicon-Small.png</string>
            <string>appicon-Small@2x.png</string>
            <string>Default.png</string>
            <string>Default@2x.png</string>
            <string>appicon-72.png</string>
            <string>appicon-72@2x.png</string>
            <string>appicon-Small-50.png</string>
            <string>appicon-Small-50@2x.png</string>
            <string>Default-Landscape.png</string>
            <string>Default-Landscape@2x.png</string>
            <string>Default-Portrait.png</string>
            <string>Default-Portrait@2x.png</string>
            <string>appicon-60.png</string>
            <string>appicon-60@2x.png</string>
            <string>appicon-76.png</string>
            <string>appicon-76@2x.png</string>
        </array>
        <key>UIPrerenderedIcon</key>
        <false/>
      </dict>
    </dict>
    <key>CFBundleIcons~ipad</key>
    <dict>
      <key>CFBundlePrimaryIcon</key>
      <dict>
        <key>CFBundleIconFiles</key>
        <array>
          <string>appicon-Small.png</string>
          <string>appicon-Small-50.png</string>
          <string>appicon-76</string>
          <string>appicon-60</string>
          <string>appicon</string>
          <string>appicon@2x</string>
          <string>appicon-72</string>
          <string>appicon-72@2x</string>
        </array>
        <key>UIPrerenderedIcon</key>
        <false/>
      </dict>
    </dict>
```


在project 和 target 里把 code Sigining修改成发布版、配置文件等

product->scheme->edit scheme ,修改archive的名称，

要上线的app必须application loader提交(先用Organizer的experot导出ipa)，用Organizer的submit，会进入prerelease


## 应用被打回后（例如 APS服务权限未勾选）的一些问题

最新的 itunes connect 用了一个叫“prerelease”，提交上去后，再次打包提交会提示二进制文件版本重复
这个可以通过xcode修改应用的build 版本号（不用改version）来重新打包

有时候修改了证书，重新生成发布配置文件（development和distribution）后，删除旧的发布配置文件后，无法向设备（如iphone）导入distribution发布配置文件（从而导致无法修改 project和target的code signing相关配置)
这时候打开xcode的preference，account，viewDetails，点一下左下角刷新按钮，即可看到实际上已经导入了。