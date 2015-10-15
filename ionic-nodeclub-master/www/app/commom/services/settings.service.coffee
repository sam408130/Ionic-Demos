angular.module('ionic-nodeclub')

.factory 'settings', ($window, API) ->

  localStorage = $window.localStorage

  if !localStorage.settings
    localStorage.settings = JSON.stringify
      popRepliesVisible: true
      latestRepliesDesc: true

  get: ->
    value = localStorage.getItem 'settings'
    JSON.parse(value)

  set: (value) ->
    value = JSON.stringify value
    localStorage.setItem('settings', value)
