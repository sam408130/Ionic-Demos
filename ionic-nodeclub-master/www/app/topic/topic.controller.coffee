angular.module('ionic-nodeclub')

.controller 'TopicCtrl', (
  API
  toast
  $scope
  $state
  $timeout
  $ionicModal
  authService
  userService
  topicService
  $stateParams
  $ionicPopover
  messageService
  $ionicActionSheet
) ->

  collectTopic = ->
    authService.withAuthUser (authUser) ->
      if $scope.isCollected
        userService.deCollectTopic($scope.topic, authUser)
          .then ->
            $scope.isCollected = false
            toast '已取消收藏'
      else
        userService.collectTopic($scope.topic, authUser)
          .then ->
            $scope.isCollected = true
            toast '收藏成功'

  loadTopic = (refresh) ->
    $scope.loading = true
    topicService.getDetail $stateParams.topicId, refresh
      .then (topic) ->
        $scope.topic = topic
      .catch (error) ->
        $scope.error = error
      .finally ->
        $scope.loading = false
        $scope.$broadcast('scroll.refreshComplete')

  angular.extend $scope,
    loading: false
    isCollected: false
    error: null
    topic: null
    msg: messageService

    doRefresh: ->
      loadTopic(refresh = true)

    showTopicAction: ->
      $ionicActionSheet.show
        buttons: [
          text: '在浏览器中打开'
        ,
          text: '重新加载'
        ,
          text: '关于作者'
        ,
          text: if !$scope.isCollected then '收藏话题' else '取消收藏'
        ,
          text: '回复话题'
        ]
        buttonClicked: (index) ->
          switch index
            when 0
              window.open "#{API.server}/topic/#{$stateParams.topicId}", '_system'
            when 1
              loadTopic(refresh = true)
            when 2
              $state.go 'app.user', loginname: $scope.topic.author.loginname
            when 3
              collectTopic()
            else
              $state.go 'app.replies', topicId:$stateParams.topicId
          return true

  # 我在获取这个主题的内容
  # 这里不强制刷新，允许从缓存里面拿
  loadTopic(refresh = false)

  # 我在检查用户是否收藏了这个主题
  userService.getDetail($scope.me?.loginname)
    .then (dbUser) ->
      isCollected = _.find(dbUser.collect_topics, id:$stateParams.topicId)?
      $scope.isCollected = isCollected

