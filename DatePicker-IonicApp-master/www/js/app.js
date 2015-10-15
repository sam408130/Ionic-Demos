// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'asianbattery' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'asianbattery.controllers' is found in controllers.js
angular.module('datepickerapp', ['ionic','datepickerapp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.datepicker', {
      url: "/datepicker",
      views: {
        'menuContent' :{
          templateUrl: "templates/datepicker.html",
          controller: 'DatepickerCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/datepicker');
});