angular.module('ionic-nodeclub')

.factory 'topicService', (
  $q
  config
  Restangular
) ->

  cache = {}

  reset: ->
    cache = {}

  getTopics: (tab, from = 0) ->
    $q (resolve, reject) ->
      page = ~~(from / config.TOPICS_PAGE_LIMIT) + 1
      Restangular
        .one('topics')
        .get(page: page, limit: config.TOPICS_PAGE_LIMIT, tab: tab)
        .then (resp) ->
          newTopics = resp.data
          # 更新cache topics
          _.each newTopics, (topic) ->
            cache[topic.id] = topic
          resolve
            topics: newTopics
            hasMore: newTopics.length is config.TOPICS_PAGE_LIMIT
        .catch resolve

  postNew: (data, authUser) ->
    newTopic = angular.extend(accesstoken: authUser?.token, data)
    Restangular
      .all('topics')
      .post(newTopic)

  getDetail: (topicId, reload) ->
    $q (resolve, reject) ->
      if !reload and topic = cache[topicId]
        return resolve topic
      Restangular
        .one('topic', topicId)
        .get()
        .then (resp) ->
          dbTopic = resp.data
          cache[topicId] = dbTopic
          resolve dbTopic
        .catch reject

  getReplies: (topicId, reload = false) ->
    $q (resolve, reject) ->
      if !reload and topic = cache[topicId]
        return resolve topic if topic?.replies
      Restangular
        .one('topic', topicId)
        .get()
        .then (resp) ->
          dbTopic = resp.data
          cache[topicId] = dbTopic
          resolve dbTopic
        .catch reject

  sendReply: (topicId, data, authUser) ->
    newReply = angular.extend(accesstoken: authUser?.token, data)
    Restangular
      .one('topic', topicId)
      .post('replies', newReply)

  toggleLikeReply: (reply, authUser) ->
    $q (resolve, reject) ->
      Restangular
        .one('reply', reply.id)
        .post('ups', accesstoken: authUser?.token)
        .then (resp) ->
          switch resp.action
            when 'up'
              reply.ups.push authUser.id
            when 'down'
              _.pull(reply.ups, authUser.id)
            else
              reject(resp)
          resolve resp.action
        .catch reject

