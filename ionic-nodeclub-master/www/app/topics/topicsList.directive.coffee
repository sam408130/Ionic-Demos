angular.module('ionic-nodeclub')

.directive 'topicsList', ->
  restrict: 'E'
  templateUrl: 'app/topics/topicsList.html'
  scope:
    topics: '='
    selectedTab: '='
