angular.module('ionic-nodeclub')

.directive 'focusOn', ($timeout) ->

  (scope, element, attrs) ->
    scope.$on 'focusOn', (event, name) ->
      $timeout ->
        if name is attrs.focusOn
          element[0].focus()
