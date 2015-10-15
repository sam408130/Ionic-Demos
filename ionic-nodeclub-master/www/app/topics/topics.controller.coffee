angular.module('ionic-nodeclub')

.controller 'TopicsCtrl', (
  API
  tabs
  toast
  $scope
  $state
  $window
  $timeout
  $ionicModal
  authService
  $stateParams
  topicService
  $ionicPopover
  messageService
  $ionicActionSheet
  $ionicScrollDelegate
) ->

  $ionicModal
    .fromTemplateUrl 'app/topics/new-topic-modal.html',
      scope: $scope
    .then (modal) ->
      $scope.newTopicModal = modal

  $ionicPopover
    .fromTemplateUrl 'app/topics/more-popover.html',
      scope: $scope
    .then (popover) ->
      $scope.morePopover = popover

  selectedTab = $stateParams.tab ? tabs[0].value

  loadTopics = (refresh) ->
    $scope.loading = true
    from = if refresh then 0 else $scope.topics?.length ? 0
    topicService.getTopics selectedTab, from
      .then (resp) ->
        if refresh or !$scope.topics
          $scope.topics = []
        $scope.topics = $scope.topics.concat(resp.topics)
        $scope.hasMore = resp.hasMore
      .catch (error) ->
        $scope.error = error
      .finally ->
        $scope.loading = false
        $scope.$broadcast('scroll.refreshComplete')
        $scope.$broadcast('scroll.infiniteScrollComplete')

  mkNewTopic = ->
    tab: selectedTab
    content: ''
    title: ''

  # Export Properties
  angular.extend $scope,
    hasMore: true
    loading: false
    error: null
    topics: null
    auth: authService
    msg: messageService
    selectedTab: selectedTab
    tabs: _.filter(tabs, (t) -> t.value isnt 'all')
    newTopic: mkNewTopic()
    newTopicModal: null
    morePopover: null
    scrollDelegate: $ionicScrollDelegate.$getByHandle('topics-handle')

    createNewTopic: ->
      authService.withAuthUser (user) ->
        $scope.newTopicModal.show()

    doPostTopic: ->
      return toast('发布失败：请先选择一个板块。') if _.isEmpty($scope.newTopic.tab)
      return toast('发布失败：请先输入标题。'    ) if _.isEmpty($scope.newTopic.title)
      return toast('发布失败：话题内容不能为空。') if _.isEmpty($scope.newTopic.content)

      authService.withAuthUser (user) ->
        topicService.postNew $scope.newTopic, user
          .then ->
            $scope.scrollDelegate.scrollTop(false)
            $scope.newTopic = mkNewTopic()
            $scope.newTopicModal.hide()
            $timeout $scope.doRefresh
          .catch (error) ->
            toast('发布失败: ' + error?.data?.error_msg, 'long')

    switchNodeclub: ->
      $ionicActionSheet.show
        buttons: _.map API.allServers, (s) ->
          if s is API.server
            text: "<span class='positive'>#{s} (当前)</span>"
          else
            text: s
        buttonClicked: (index) ->
          localStorage.server = API.allServers[index]
          $state.go('app.topics', tab:'all')
          $window.location.reload(false)
          return true

    doRefresh: ->
      if $scope.loading then return
      $scope.error = null
      $scope.hasMore = true
      loadTopics(refresh = true)

    loadMore: ->
      if $scope.loading or $scope.error then return
      loadTopics(refresh = false)

  $scope.$on '$destroy', ->
    $scope.newTopicModal?.remove()
    $scope.morePopover?.remove()

