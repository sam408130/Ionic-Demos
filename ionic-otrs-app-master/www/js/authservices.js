//Auth服务实现，业务逻辑
'use strict';

angular.module('otrsapp.authservices', []).factory('AuthService', function ($q, CommonService) {

  return {
    login: function ($http, credentials) {
      var deferred = $q.defer();
      var request = $http({
        method: "post",
        url: wsUrl,
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
          'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
          '<soapenv:Header/>' +
          '<soapenv:Body>' +
          '<SessionCreate>' +
          '  <tic:CustomerUserLogin>' + credentials.username + '</tic:CustomerUserLogin>' +
          '  <tic:Password>' + credentials.password + '</tic:Password>' +
          '</SessionCreate>' +
          '</soapenv:Body>' +
          '</soapenv:Envelope>'
      });
      request.success(
        function (html) {
          var domParser = new DOMParser();
          var xml = domParser.parseFromString(html, 'text/xml')
            .childNodes[0]
            .childNodes[0]
            .childNodes[0]
            .childNodes[0];
          if (xml.nodeName == 'Error') {
            deferred.reject(CommonService.xml2json(xml));
          } else {
            console.log(CommonService.xml2json(xml).Text);
            deferred.resolve(CommonService.xml2json(xml).Text);
          }
        }
      ).error(function (status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },
    logout: function ($window) {
      if (typeof $window.localStorage.auth != 'undefined') {
        delete $window.localStorage.auth;
      }
    },
    isLoggedIn: function ($window) {
      if (typeof $window.localStorage.auth == 'undefined') {
        return false;
      } else {
        return true;
      }
    }
  }
});