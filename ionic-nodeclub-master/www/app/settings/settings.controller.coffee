angular.module('ionic-nodeclub')

.controller 'SettingsCtrl', (
  $scope
  settings
  Restangular
  $cordovaAppVersion
) ->

  versionCompare = (v1, v2) ->
    return 0 if !v1 or !v2
    v1parts = v1.split('.').map(Number)
    v2parts = v2.split('.').map(Number)
    if v1parts.length > v2parts.length
      return 1
    if v1parts.length < v2parts.length
      return -1
    for i in [0...v1parts.length]
      if v1parts[i] is v2parts[i]
        continue
      else if v1parts[i] > v2parts[i]
        return 1
      else
        return -1
    return 0

  angular.extend $scope,
    settings: settings.get()
    appVersion: null
    newVersionData: null
    updateSettings: ->
      settings.set($scope.settings)

  if window.cordova
    $cordovaAppVersion.getAppVersion()
      .then (version) ->
        $scope.appVersion = version
        Restangular
          .oneUrl('getNewVersion', 'http://fir.im/api/v2/app/version/5540b7aefe9978f3100002f4')
          .get()
          .then (newVersionData) ->
            $scope.newVersionData = newVersionData
            newVersion = $scope.newVersionData.versionShort
            curVersion = $scope.appVersion
            $scope.hasNewVersion = versionCompare(newVersion, curVersion) > 0

