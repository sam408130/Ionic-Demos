angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filter'])

.run(function($ionicPlatform, $state, $rootScope, loginService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // 首次运行时开启通知，之后只能通过 设置 通知 中更改
    window.plugin.notification.local.hasPermission(function (granted) {
      if(!granted) {
        window.plugin.notification.local.promptForPermission();
      }
    });

    // init
//    window.plugin.notification.local.cancelAll();
//    window.localStorage.clear();


  });

    // 所有的模态窗注册在此
    $rootScope.modals = {};

    $ionicPlatform.on('pause', function() {
      var password = loginService.getPassword();
      if(password != '') {
        // 移除所有模态框
        for(var key in $rootScope.modals) {
          $rootScope.modals[key].remove();
        }
        $state.go('login');
      }
    })
})

  // config里无法注入service
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.recordlists', {
      url: "/recordlists/:categoryId",
      views: {
        'menuContent' : {
          templateUrl : "templates/recordlists.html",
          controller : 'RecordListCtrl'
        }
      }
    })

    .state('app.editrecord', {
      url: "/editrecord/:recordId",
      views: {
        'menuContent' : {
          templateUrl : "templates/recordedit.html",
          controller : 'EditRecordCtrl'
        }
      }
    })

    .state('login', {
      url: "/login",
      templateUrl: 'templates/setpassword.html',
      controller: 'loginCtrl'
    });

    $urlRouterProvider.otherwise('/login');
//    var password = loginService.getPassword();
//    if(password != '') {
//      $urlRouterProvider.otherwise('/app/login');
//    } else {
//      // if none of the above states are matched, use this as the fallback
//      $urlRouterProvider.otherwise('/app/recordlists/0');
//    }

});

