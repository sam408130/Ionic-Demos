angular.module('ionic-nodeclub')

.factory 'userService', (
  $q
  Restangular
) ->

  cache = {}

  reset: ->
    cache = {}

  getDetail: (loginname, reload = false) ->
    $q (resolve, reject) ->
      if _.isEmpty(loginname)
        return reject('错误的 loginname: ' + loginname)
      if !reload and cacheUser = cache[loginname]
        return resolve cacheUser
      Restangular
        .one('user', loginname)
        .get()
        .then (resp) ->
          dbUser = resp.data
          cache[loginname] = dbUser
          resolve dbUser
        .catch reject

  collectTopic: (topic, authUser) ->
    $q (resolve, reject) ->
      Restangular
        .all('topic/collect')
        .post(accesstoken: authUser?.token, topic_id: topic.id)
        .then (resp) ->
          # 更新已经被cache的user信息
          if cacheUser = cache[authUser.loginname]
            cacheUser.collect_topics.push topic
          resolve resp
        .catch reject

  deCollectTopic: (topic, authUser) ->
    $q (resolve, reject) ->
      Restangular
        .all('topic/de_collect')
        .post(accesstoken: authUser?.token, topic_id: topic.id)
        .then (resp) ->
          # 更新已经被cache的user信息
          if cacheUser = cache[authUser.loginname]
            _.remove(cacheUser.collect_topics, id: topic.id)
          resolve resp
        .catch reject

