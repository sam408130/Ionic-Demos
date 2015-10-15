angular.module('ionic-nodeclub')

.controller 'MessagesCtrl', (
  toast
  $scope
  $stateParams
  $ionicLoading
  messageService
) ->

  loadMessages = (refresh) ->
    $scope.loading = true
    messageService.getMessages refresh
      .then (data) ->
        $scope.has_read_messages = data.has_read_messages
        $scope.hasnot_read_messages = data.hasnot_read_messages
      .catch (error) ->
        $scope.error = error
      .finally ->
        $scope.loading = false
        $scope.$broadcast('scroll.refreshComplete')

  angular.extend $scope,
    has_read_messages: null
    hasnot_read_messages: null
    loading: false
    error: null
    doRefresh: ->
      loadMessages(refresh = true)
    markAsRead: ->
      $ionicLoading.show()
      messageService.markAllAsRead()
        .then ->
          $ionicLoading.hide()
          toast $scope.hasnot_read_messages.length + '个消息被标记为已读'
          loadMessages(refresh = true)
        .catch ->
          $ionicLoading.hide()

  loadMessages(refresh = false)
