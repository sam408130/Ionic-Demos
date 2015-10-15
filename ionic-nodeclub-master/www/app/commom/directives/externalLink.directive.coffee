angular.module('ionic-nodeclub')

.directive 'externalLink', ->

  (scope, element, attrs) ->
    element.on 'click', (event) ->
      target = attrs.target ? '_system'
      url = attrs.externalLink
      window.open(url, target)

