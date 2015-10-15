angular.module('ionic-nodeclub')

.factory 'messageService', (
  $q
  storage
  Restangular
) ->

  cache = {}

  reset: ->
    cache = {}

  getUnreadCount: ->
    cache.unreadCount ? 0

  refreshUnreadCount: ->
    $q (resolve, reject) ->
      user = storage.get 'user'
      Restangular
        .one('message/count')
        .get(accesstoken: user?.token)
        .then (resp) ->
          cache.unreadCount = resp.data
          resolve resp.data
        .catch reject

  getMessages: (reload = false) ->
    $q (resolve, reject) ->
      user = storage.get 'user'
      if !reload and cache.messages
        return resolve cache.messages
      Restangular
        .one('messages')
        .get(accesstoken: user?.token)
        .then (resp) ->
          cache.messages = resp.data
          cache.unreadCount = resp.data?.hasnot_read_messages?.length ? 0
          resolve resp.data
        .catch reject

  markAllAsRead: ->
    user = storage.get 'user'
    Restangular
      .all('message/mark_all')
      .post(accesstoken: user?.token)

