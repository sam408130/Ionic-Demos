// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.constant('DB_NAME', 'ghost.db').constant('AES_ENCRYPT_KEY', 'sfd234feff82sd')

.run(function($http, $rootScope, $state, $ionicPlatform, $ionicPopup, $ionicHistory, $cordovaToast) {
  $rootScope.blog = {
    settings: {},
    posts: [],
    tags: [],
    users: [],
    site: null,
    modal: {login: null, isLoginShow: false}
  };
  $rootScope.user = {username: null, password: null, token: null};

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  function showToast() {
    $rootScope.backButtonPressedOnceToExit = true;
    $cordovaToast.showShortBottom('再按一次退出系统');
    setTimeout(function () {
      $rootScope.backButtonPressedOnceToExit = false;
    }, 1000);
  }

  //双击退出
  $ionicPlatform.registerBackButtonAction(function(e) {
    if ($rootScope.user.password && $rootScope.blog.modal.isLoginShow) {
      // 登录时并且模态框打开时关闭模态框
      $rootScope.blog.modal.login.hide();
    } else if ($state.includes('app.posts') || !$rootScope.user.password) {
      // 未登录时或者在首页时双击退出
      if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      } else {
        showToast();
      }
    }
    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    } else {
      showToast();
    }
    e.preventDefault();
    return false;
  }, 201);

  $rootScope.$on('$stateChangeSuccess', function () {
    if (!$rootScope.user.password && $rootScope.blog.modal.login) {
      // 未登录时弹出登录框
      $rootScope.blog.modal.login.show();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.posts', {
    url: "/posts?filter&id&name",
    views: {
      'menuContent': {
        templateUrl: "templates/posts.html",
        controller: 'PostsCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/posts/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'PostCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/posts');
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.interceptors.push('authInterceptor');
})

.factory('authInterceptor', function( $q, $rootScope, $injector) {
  function clearAndShowLogin() {
    var $ionicLoading = $injector.get('$ionicLoading');
    var $cordovaToast = $injector.get('$cordovaToast');
    var $cordovaSplashscreen = $injector.get('$cordovaSplashscreen');
    var GhostDB = $injector.get('GhostDB');
    $ionicLoading.hide();
    $cordovaSplashscreen.hide();
    $cordovaToast.showShortBottom('登录信息失效，请重新登录');
    // 清除登录信息
    $rootScope.user = {};
    GhostDB.removeUserInfo();
    // 弹出登录框
    if ($rootScope.blog.modal.login) {
      $rootScope.blog.modal.login.show();
    }
  };

  return {
    // Add authorization token to headers
    request: function (config) {
      config.default = 5000;
      config.headers = config.headers || {};
      if ($rootScope.user.password && $rootScope.user.token) {
        config.headers['Authorization'] = 'Bearer ' + $rootScope.user.token.access_token;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      // 登录身份过期
      if(response.status === 401) {
        // 401后重新发送登录请求，成功后再次执行之前的请求，如果还是错误，则登录信息失效
        var GhostOauth = $injector.get('GhostOauth');
        var $http = $injector.get('$http');
        var defer = $q.defer();
        GhostOauth.loginWidthStored().then(defer.resolve, function() {
          clearAndShowLogin();
          return defer.promise;
        }).then(function() {
          return $http(response.config);
        });
        return defer.promise;
      }
      else {
        // 统一处理，未做详细区别
        clearAndShowLogin();
        return $q.reject(response);
      }
    }
  };
});