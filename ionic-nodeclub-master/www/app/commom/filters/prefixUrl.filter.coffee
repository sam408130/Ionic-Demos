angular.module('ionic-nodeclub')

.filter 'prefixUrl', (API) ->

  (input) ->
    if /^http/gi.test(input)
      return input
    if /^\/\//gi.test(input)
      return 'https:' + input
    API.server + input
