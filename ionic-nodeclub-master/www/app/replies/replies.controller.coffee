angular.module('ionic-nodeclub')

.controller 'RepliesCtrl', (
  focus
  toast
  config
  $scope
  $state
  $filter
  $window
  settings
  authService
  $ionicModal
  $stateParams
  topicService
  $ionicLoading
  $cordovaClipboard
  $ionicActionSheet
  $ionicScrollDelegate
) ->

  curSettings = settings.get()

  loadReplies = (refresh) ->
    $scope.loading = true
    topicService.getReplies($stateParams.topicId, refresh)
      .then (topic) ->
        $scope.topic = topic
        # 我设置最新的回复
        $scope.latestReplies =
          if curSettings.latestRepliesDesc
            topic.replies.reverse()
          else
            topic.replies
        # 我设置最赞的回复
        if curSettings.popRepliesVisible and $scope.latestReplies.length > config.POP_REPLIES_TRIGGER_NUM
          $scope.popReplies = _($scope.latestReplies) # 我用lodash的chaining链式调用
            .filter (reply) -> reply.ups.length > 0   # 我过滤出有赞的回复
            .sortBy (reply) -> -reply.ups.length      # 我把比较赞的回复排在前面
            .value()
      .catch (error) ->
        $scope.error = error
      .finally ->
        $scope.loading = false
        $scope.$broadcast('scroll.refreshComplete')

  angular.extend $scope,
    loading: false
    error: null
    topic: null
    config: config
    nLatest: config.LATEST_REPLIES_DEFAULT_NUM
    replyModal: null
    popReplies: null
    allReplies: null
    latestReplies: null
    scrollDelegate: $ionicScrollDelegate.$getByHandle('replies-handle')
    newReply:
      content: ''

    doRefresh: ->
      if $scope.loading then return
      $scope.scrollDelegate.scrollTop(true)
      $scope.error = null
      $scope.nLatest = config.LATEST_REPLIES_DEFAULT_NUM
      loadReplies(refresh = true)

    displayMore: ->
      $scope.nLatest = $scope.latestReplies.length

    toggleLike: (reply) ->
      authService.withAuthUser (authUser) ->
        topicService.toggleLikeReply(reply, authUser)
          .then (action) ->
            toast '已赞' if action is 'up'
          .catch (error) ->
            toast error.error_msg


    replyAuthor: (reply) ->
      authService.withAuthUser (authUser) ->
        $scope.newReply.content = "@#{reply.author.loginname} "
        $scope.newReply.reply_id = reply.id
        focus('focus.newReplyInput')

    clearNewReply: ->
      $scope.newReply.content = ''
      $scope.newReply.reply_id = null

    showReplyAction: (reply) ->
      $ionicActionSheet.show
        buttons: [
          text: '复制'
        ,
          text: '引用'
        ,
          text: '@Ta'
        ,
          text: '作者'
        ]
        buttonClicked: (index) ->
          switch index
            # copy content
            when 0
              text = $filter('toMarkdown')(reply.content)
              if $window.cordova
                $cordovaClipboard
                  .copy text
                  .then ->
                    toast '已拷贝到粘贴板'
              else
                console.log 'copy...' + text
            # quote content
            when 1
              quote = $filter('toMarkdown')(reply.content)
              quote = '\n' + quote.trim().replace(/([^\n]+)\n*/g, '>$1\n>\n')
              content = $scope.newReply.content + "#{quote}"
              $scope.newReply.content = content.trim() + '\n\n'
              focus('focus.newReplyInput')
            # @ someone
            when 2
              content = $scope.newReply.content
              content += " @#{reply.author.loginname}"
              $scope.newReply.content = content.trim() + ' '
              focus('focus.newReplyInput')
            # about author
            else
              $state.go('app.user', loginname: reply.author.loginname)
          return true

    sendReply: ->
      authService.withAuthUser (authUser) ->
        $ionicLoading.show()
        topicService.sendReply($stateParams.topicId, $scope.newReply, authUser)
          .then ->
            $scope.clearNewReply()
            $scope.doRefresh()
          .finally ->
            $ionicLoading.hide()

    showSendAction: ->
      $ionicActionSheet.show
        buttons: [
          text: '发送'
        ,
          text: '预览'
        ]
        buttonClicked: (index) ->
          switch index
            when 0
              $scope.sendReply()
            else
              if $scope.replyModal?
                $scope.replyModal.show()
              else
                $ionicLoading.show()
                $ionicModal
                  .fromTemplateUrl('app/replies/reply-preview-modal.html', scope: $scope)
                  .then (modal) ->
                    $scope.replyModal = modal
                    $scope.replyModal.show()
                  .finally ->
                    $ionicLoading.hide()
          return true

  loadReplies(refresh = true)

  $scope.$on '$destroy', ->
    $scope.replyModal?.remove()

