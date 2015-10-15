angular.module('ionic-nodeclub')

.controller 'UserCtrl', (
  $scope
  userService
  authService
  $stateParams
  messageService
) ->

  userService.getDetail($stateParams.loginname, true)
    .then (user) ->
      $scope.user = user
      $scope.displayTopics =
        if $scope.isCollectVisible()
          'collect_topics'
        else
          'recent_topics'

  angular.extend $scope,
    user: null
    displayTopics: null
    auth: authService
    msg: messageService
    $stateParams: $stateParams

    isCollectVisible: ->
      isMyDetail = $scope.user and $scope.me?.loginname is $scope.user?.loginname
      hasCollectedTopics = $scope.user?.collect_topics.length
      isMyDetail or hasCollectedTopics

    changeType: (type) ->
      $scope.displayTopics = type

