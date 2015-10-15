angular.module('ionic-nodeclub')

.config ($stateProvider, $urlRouterProvider, tabs) ->

  $stateProvider
    .state 'app',
      url: '/app'
      abstract: true
      templateUrl: 'app/main/main.html'
      controller: 'MainCtrl'

    .state 'app.topics',
      url: '/topics/:tab'
      historyRoot: true
      views:
        mainContent:
          templateUrl: 'app/topics/topics.html'
          controller: 'TopicsCtrl'

    .state 'app.topic',
      url: '/topic/:topicId'
      views:
        mainContent:
          templateUrl: 'app/topic/topic.html'
          controller: 'TopicCtrl'

    .state 'app.replies',
      url: '/replies/:topicId'
      views:
        mainContent:
          templateUrl: 'app/replies/replies.html'
          controller: 'RepliesCtrl'

    .state 'app.user',
      url: '/user/:loginname'
      views:
        mainContent:
          templateUrl: 'app/user/user.html'
          controller: 'UserCtrl'

    .state 'app.messages',
      url: '/messages'
      views:
        mainContent:
          templateUrl: 'app/messages/messages.html'
          controller: 'MessagesCtrl'

    .state 'app.settings',
      url: '/settings'
      views:
        mainContent:
          templateUrl: 'app/settings/settings.html'
          controller: 'SettingsCtrl'

  $urlRouterProvider.otherwise "/app/topics/#{tabs[0].value}"

