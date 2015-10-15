angular.module('starter.controllers', [])

.controller('AppCtrl', ['$q', '$scope', '$rootScope', '$ionicPlatform', '$ionicLoading', '$ionicModal', '$cordovaSplashscreen', 'GhostDB', 'GhostOauth',
    function($q, $scope, $rootScope, $ionicPlatform, $ionicLoading, $ionicModal, $cordovaSplashscreen, GhostDB, GhostOauth) {
  $scope.showTags = false;
  $scope.showUsers = false;
  $scope.toggleTags = function() {$scope.showTags = !$scope.showTags;};
  $scope.toggleUsers = function() {$scope.showUsers = !$scope.showUsers;};
  $scope.showSetting = function() {$rootScope.blog.modal.login.show();};
  $scope.closeSetting = function() {$rootScope.blog.modal.login.hide();};
  function getBlogInfo() {
    var settingPromise = GhostOauth.getSetting().then(function (setting) {
      var settings = setting.settings;
      for (var i = 0; i < settings.length; i++) {
        if (settings[i].key === 'cover' && settings[i].value) {
          $rootScope.blog.settings[settings[i].key] = settings[i].value.replace(/^(?!(http|https))/, $rootScope.blog.site);
        } else {
          $rootScope.blog.settings[settings[i].key] = settings[i].value;
        }
      }
    });
    var tagPromise = GhostOauth.getTags().then(function(tags) {
      Array.prototype.push.apply($rootScope.blog.tags, tags.tags);
    });
    var userPromise = GhostOauth.getUsers().then(function(users) {
      Array.prototype.push.apply($rootScope.blog.users, users.users);
    });
    $q.all([settingPromise, tagPromise, userPromise]).then(function() {
      $scope.$broadcast('app.setting.complete');
    });
  };

  $ionicPlatform.ready(function() {
    // 程序初始化
    GhostDB.setup().then(function (inited) {
      // 如果DB没有初始化，则执行初始化操作
      if (!inited) {
        return GhostDB.init();
      } else {
        $ionicLoading.show({
          template: '<ion-spinner icon="crescent" class="spinner-positive"></ion-spinner></br>Loading...'
        });
        // 如果DB已经初始化，则读取DB数据
        return GhostDB.getSaved().then(function (data) {
          // 将取出来的数据放到根作用域下
          $rootScope.blog.site = data.blog.site;
          $rootScope.user = data.user;
          if (data.user.password !== '') {
            // 用DB里面取出来的数据登录
            GhostOauth.login(data.user.username, data.user.password).then(function (token) {
              // 登录成功后保存token信息并跳转至首页
              $rootScope.user.token = token;
              getBlogInfo();
            });
          } else {
            $ionicLoading.hide();
          }
        }).catch(function (error) {
          alert(JSON.stringify(error));
        });
      }
    }).finally(function () {
      // 最终关闭启动画面
      $cordovaSplashscreen.hide();

      $ionicModal.fromTemplateUrl('templates/setting.html', {
        scope: $scope
      }).then(function(modal) {
        $rootScope.blog.modal.login = modal;
        // 如果未登录，则弹出登录模态框
        if (!$rootScope.user.password) {
          modal.show();
        } else {
          modal.hide();
        }
      });
    });
  });

  $scope.$on('setting.complete', function() {
    GhostDB.updateLoginInfo($rootScope.user.username, $rootScope.user.password);
    getBlogInfo();
  });

  $scope.$on('modal.hidden', function() {
    $rootScope.blog.modal.isLoginShow = false;
  });
  $scope.$on('modal.removed', function() {
    $rootScope.blog.modal.isLoginShow = true;
  });
}])

.controller('PostsCtrl', function($scope, $rootScope, $stateParams, $location, $cordovaToast, $ionicLoading, GhostOauth) {
  function getPosts(tag, user) {
    // TODO: 只查询某个标签或者某个作者的文章
    return GhostOauth.getPosts().then(function(posts) {
      posts = posts.posts;
      $rootScope.blog.posts.length = 0;
      for (var i = 0; i < posts.length; i++) {
        // 添加图片前缀
        if (posts[i].image) {
          posts[i].image = posts[i].image.replace(/^(?!(http|https))/, $rootScope.blog.site);
        }
        $rootScope.blog.posts.push(posts[i]);
      }
      $ionicLoading.hide();
    }).catch(function(error) {
      $cordovaToast.showLongBottom(JSON.stringify(error));
      $ionicLoading.hide();
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  $scope.doRefresh = function() {
    getPosts().then(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  if ($stateParams.filter) {
    // 有筛选条件(标签/用户)
    $scope.filter = {
      id: $stateParams.id,
      type: $stateParams.filter,
      name: $stateParams.name
    };
  } else {

  }

  $scope.$on('app.setting.complete', function() {
    $rootScope.blog.modal.login.hide();
    getPosts();
  });
})

.controller('PostCtrl', function($scope, $rootScope, $sce, $stateParams, $timeout, $state, $ionicLoading, $cordovaToast, GhostOauth) {
  // 视图加载完成后请求数据
  $scope.$on('$ionicView.afterEnter', function(){
    GhostOauth.getPost($stateParams.id).then(function(data) {
      var post = data.posts[0];
      if (post.html) {
        post.html = post.html.replace(/src="(?!(http:\/\/|https:\/\/))/g, 'src="' + $rootScope.blog.site);
      }
      if (post.image) {
        post.image = post.image.replace(/^(?!(http|https))/, $rootScope.blog.site);
      }
      $scope.post = post;
      $scope.post.html = $sce.trustAsHtml(post.html);
      $timeout(function () {
        // 代码高亮
        var codes = document.querySelectorAll('pre code');
        for (var i = 0; i < codes.length; i++) {
          window.hljs.highlightBlock(codes[i]);
        }
      });
    }).catch(function() {
      $cordovaToast.showLongBottom('获取文章失败，请重试');
    });
  });
})

.controller('SettingCtrl', function($scope, $rootScope, $ionicLoading, $cordovaToast, GhostOauth, GhostDB) {
    var msg = '';
    $scope.removeDB = function() {
      GhostDB.removeDB();
    };
    $scope.setBlogSite = function(form) {
      if (form.$error.url) {
        msg = '你输入的博客地址不对哦~';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      if (!$scope.login.site) {
        msg = '请输入博客地址，格式为http(s)://xxx.xxx.xxx';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      $ionicLoading.show({
        template: '<ion-spinner icon="crescent" class="spinner-positive"></ion-spinner>'
      });
      GhostOauth.checkSite($scope.login.site).then(function() {
        GhostDB.updateSite($rootScope.blog.site = $scope.login.site);
        $cordovaToast.showLongBottom('请设置GHOST博客登录的用户名和密码');
      }).catch(function(msg) {
        $cordovaToast.showLongBottom(msg);
      }).finally(function() {
        $ionicLoading.hide();
      });
    };
    $scope.login = function(form) {
      if (form.$error.email) {
        msg = '你输入的邮箱不对哦~格式应该是youmail@mail.site';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      if (form.$error.minlength) {
        msg = '请输入至少8位数的密码';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      if (!$scope.login.username) {
        msg = '请输入用户名，GHOST用户名是邮箱格式';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      if (!$scope.login.password) {
        msg = '请输入登录密码';
        $cordovaToast.showLongBottom(msg);
        return;
      }
      $ionicLoading.show({
        template: '<ion-spinner icon="crescent" class="spinner-positive"></ion-spinner><br/>登录请求中'
      });
      GhostOauth.login($scope.login.username, $scope.login.password).then(function(token) {
        $rootScope.user.token = token;
        $ionicLoading.show({
          template: '<ion-spinner icon="crescent" class="spinner-positive"></ion-spinner><br/>登录成功，准备获取数据'
        });
        $rootScope.user.username = $scope.login.username;
        $rootScope.user.password = $scope.login.password;
        $scope.$emit('setting.complete');
      }).catch(function(error) {
        $cordovaToast.showShortBottom(JSON.stringify(error));
      });
    };

    $scope.login.site = $rootScope.blog.site || '';
    $scope.login.username = $rootScope.user.username || '';
});