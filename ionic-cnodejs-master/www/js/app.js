// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories'])

	.run(function($ionicPlatform, SettingFactory, $http){
		$ionicPlatform.ready(function(){
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if ( window.cordova && window.cordova.plugins.Keyboard ) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if ( window.StatusBar ) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
		// 初始化 设置
		if ( !SettingFactory.get() || window.SETTING.version != SettingFactory.get('version') || window.SETTING.reset ) {
			SettingFactory.save(window.SETTING);
		}
	})

	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'AppCtrl'
			})

			.state('app.topics', {
				url: "/topics",
				views: {
					'content': {
						templateUrl: "templates/topics.html",
						controller: 'TopicsCtrl'
					}
				}
			})

			.state('app.topic', {
				url: "/topic/:id",
				views: {
					'content': {
						templateUrl: "templates/topic.html",
						controller: 'TopicCtrl'
					}
				}
			});
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/topics');
	});

