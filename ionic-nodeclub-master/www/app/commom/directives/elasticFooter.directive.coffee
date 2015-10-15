angular.module('ionic-nodeclub')

.directive 'elasticFooter', ($document, $timeout) ->
  restrict: 'E'
  controller: '$ionicHeaderBar'
  compile: ($element, $attrs) ->
    $element.addClass 'bar bar-footer elastic-footer'

    pre: ($scope, $element, $attrs) ->

      $scope.$watch (-> $element[0].className) , (value) ->
        isShown = value.indexOf('ng-hide') is -1
        isSubfooter = value.indexOf('bar-subfooter') isnt -1
        $scope.$hasFooter = isShown and !isSubfooter
        $scope.$hasSubfooter = isShown and isSubfooter

      $scope.$on '$destroy', ->
        delete $scope.$hasFooter
        delete $scope.$hasSubfooter

      $scope.$watch '$hasTabs', (val) ->
        $element.toggleClass('has-tabs', !!val)

      # update content view bottom position
      $scope.$watch (-> $element[0].clientHeight), (newHeight) -> $timeout ->
        contentQuery = $document[0].getElementsByClassName('has-footer')
        contentElement = angular.element(contentQuery)
        contentElement?.css('bottom', newHeight + 'px')

