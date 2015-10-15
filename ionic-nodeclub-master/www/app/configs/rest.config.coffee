angular.module('ionic-nodeclub')

.config (RestangularProvider, API) ->
  RestangularProvider.setBaseUrl(API.server + API.path + API.version)
  RestangularProvider.setRestangularFields(id: 'id')

.config ($httpProvider) ->
  $httpProvider.interceptors.push ($q, storage) ->
    request: (config) ->
      config
    responseError: (rejection) ->
      #if rejection.status is 403
        #storage.remove 'user'
      $q.reject rejection

