angular.module('ionic-nodeclub', [
  'ionic'
  'ngCordova'
  'restangular'
  'angularMoment'
  'btford.markdown'
  'monospaced.elastic'
])

.run (
  toast
  config
  amMoment
  $timeout
  $rootScope
  authService
  userService
  topicService
  $ionicHistory
  messageService
  $ionicPlatform
  $cordovaKeyboard
  $cordovaStatusbar
  IONIC_BACK_PRIORITY
) ->

  amMoment.changeLocale('zh-cn')

  $ionicPlatform.ready ->
    # Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    # for form inputs)
    if window.cordova
      $cordovaKeyboard.hideAccessoryBar(true)

    if window.StatusBar
      $cordovaStatusBar.style(0)

  #
  # 我要实现按两次返回按钮才能退出APP
  #
  isExitApp = false
  $ionicPlatform.registerBackButtonAction ->
    # 我要先返回上一个页面，如果有的话
    if backView = $ionicHistory.backView()
      return backView.go()

    if isExitApp
      return ionic.Platform.exitApp()

    # 我提示用户再按一次返回按钮会退出APP
    toast '再按一次退出'

    # 我标记这段时间，用户正准备退出APP
    isExitApp = true
    $timeout ->
      isExitApp = false
    , config.TOAST_SHORT_DELAY

  , IONIC_BACK_PRIORITY.view+1

  # 我在修复浏览器刷新/后退导致'nav button'显示异常的BUG
  $rootScope.$on '$stateChangeStart', (event, toState) ->
    # 通过设置historyRoot可以让'nav button'的状态重置
    if toState.historyRoot
      $ionicHistory.nextViewOptions
        historyRoot: true

  #
  # 我在初始化rootScope的变量
  #
  $rootScope.me = null

  $rootScope.$on 'auth.userUpdated', (event, user) ->
    $rootScope.me = user
    messageService.refreshUnreadCount()

  $rootScope.$on 'auth.userLogout', ->
    $rootScope.me = null
    userService.reset()
    topicService.reset()
    messageService.reset()

  authService.init()

