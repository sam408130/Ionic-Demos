angular.module('ionic-nodeclub')

.factory 'toast', (
  config
  $window
  $timeout
  $ionicLoading
  $cordovaToast
) ->

  (message, duration = 'short') ->

    if $window.plugins?.toast?
      $cordovaToast.show message, duration, 'center'
    else
      # 我加$timeout, 避免同时调用$ionicLoading.hide的时候toast也被关掉
      if duration is 'long'
        duration = config.TOAST_LONG_DELAY
      else
        duration = config.TOAST_SHORT_DELAY
      $timeout ->
        $ionicLoading.show
          template: message
          duration: duration
          noBackdrop: true
