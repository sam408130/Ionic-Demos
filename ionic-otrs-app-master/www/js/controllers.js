//控制器
'use strict';

angular.module('otrsapp.controllers', [])

.controller('TicketCreateCtrl', function ($scope, $http, $state, $window, $ionicPopup, $ionicLoading, $ionicModal, TicketService) {
  $scope.createTicket = function (title, body) {
    if (typeof title == 'undefined' || typeof body == 'undefined') {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: '联系方式和内容不能为空！'
      });
      alertPopup.then(function (res) {
        console.log('require');
      });
      return;
    }
    TicketService.createTicket($http, $window.localStorage.auth,
      $window.localStorage.username, title, body).then(function (data) {
      var createTicketSuccess = $ionicPopup.alert({
        title: '提示',
        template: '问题提交完成。'
      });
      createTicketSuccess.then(function (res) {
        $state.go($state.current, {}, {
          reload: true
        });
        $scope.modal.hide();
      });
    }, function (err) {
      var createTicketSuccess = $ionicPopup.alert({
        title: '提示',
        template: err
      });
      createTicketSuccess.then(function (res) {
        console.log(err);
      });
    });
  }
})

.controller('TicketIndexCtrl', function ($scope, $http, $state, $window, $ionicPopup, $ionicLoading, $ionicModal, TicketService) {
  var init = function () {
    $scope.start = 0;
    $scope.end = 7;
    $scope.step = 7;
    $scope.max = 0;
    $scope.tickets = [];
  };

  var showLoading = function () {
    $ionicLoading.show({
      content: '<i class="icon ion-loading-c"></i>',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 300
    });
  };
  var hideLoading = function () {
    $ionicLoading.hide();
  };

  $scope.getByStartAndEnd = function (reset) {
    if (reset) {
      init();
    }
    if ($scope.end <= $scope.max) {
      return;
    }
    showLoading();
    TicketService.getByStartAndEnd($http, $window.localStorage.auth,
      $window.localStorage.username, $scope.start, $scope.end).then(function (data) {
      $scope.max = $scope.end;
      if ($scope.tickets.length != 0) {
        $scope.tickets = $scope.tickets.concat(data);
      } else {
        $scope.tickets = data;
      }
      $scope.$broadcast('scroll.refreshComplete');
      hideLoading();
    }, function (error) {
      hideLoading();
      $state.go('login');
    });
  };

  $scope.getByStartAndEnd(true);

  $ionicModal.fromTemplateUrl('ticket-create.html', function (modal) {
    $scope.modal = modal;
  }, {
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $scope.setPriority = function (ticket) {
    TicketService.updateTicket($http, ticket.id,
      $window.localStorage.auth, $window.localStorage.username, '加急').then(function (data) {
      var setPrioritySuccess = $ionicPopup.alert({
        title: '提示',
        template: '加急处理完成。'
      });
      setPrioritySuccess.then(function (res) {
        //
        console.log('error');
      });
    });
  };

  $scope.stepIt = function () {
    $scope.start += $scope.step;
    $scope.end += $scope.step;
    $scope.getByStartAndEnd(false);
  };

  $scope.showMoreButton = function () {
    return ($scope.tickets.length >= $scope.step);
  };
})

.controller('TicketDetailCtrl', function ($scope, $http, $stateParams, $window, $ionicPopup, $timeout, TicketService) {
  $scope.getTicket = function () {
    TicketService.get($http, $stateParams.ticketId, $window.localStorage.auth).then(function (data) {
      $scope.ticket = data;
    });
  }
  $scope.getTicket();

  $scope.selectChange = function (value) {
    $scope.reason = value;
  }
  $scope.andArticle = function (article) {
    $scope.reason = "服务态度差";
    $scope.choice = 'B';

    var articleType =
      '<ion-radio ng-model="choice" ng-value="A" ng-click="selectChange(\'处理不及时\')">处理不及时</ion-radio>' +
      '<ion-radio ng-model="choice" ng-value="B" ng-click="selectChange(\'服务态度差\')">服务态度差</ion-radio>' +
      '<ion-radio ng-model="choice" ng-value="C" ng-click="selectChange(\'未正确处理\')">未正确处理</ion-radio>' +
      '<ion-radio ng-model="choice" ng-value="D" ng-click="selectChange(\'其它\')">其它</ion-radio>' +
      '<input type="text" ng-model="reason"></input>';

    var addPopup = $ionicPopup.show({
      template: articleType,
      title: '投诉原因',
      subTitle: '请选择',
      scope: $scope,
      buttons: [
        {
          text: '放弃'
        },
        {
          text: '<b>保存</b>',
          type: 'button-positive',
          onTap: function (e) {
            return {
              ticketId: article.TicketID.Text,
              reason: article.FromRealname.Text + ' ' +
                $scope.reason
            };
          }
      },
    ]
    });
    addPopup.then(function (res) {
      if (typeof (res) != "undefined") {
        TicketService.updateTicket($http, res.ticketId,
          $window.localStorage.auth, $window.localStorage.username, res.reason).then(function (data) {
          $scope.getTicket();
        });
      }
    });
    $timeout(function () {
      addPopup.close();
    }, 30000);
  }
})

.controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $ionicPopup, $window, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.credentials.username = $window.localStorage.username;
  $scope.login = function (credentials) {
    AuthService.login($http, credentials).then(function (data) {
      $window.localStorage.auth = data;
      $window.localStorage.username = credentials.username;
      $state.go('tab.ticket-index');
    }, function (err) {
      delete $window.localStorage.auth;
      var loginError = $ionicPopup.alert({
        title: '登录错误',
        template: '用户名或口令错误！<br>' + err.ErrorMessage.Text
      });
      loginError.then(function (res) {
        //
        console.log('error');
      });
    });
  }

  $scope.logout = function () {
    AuthService.logout($window);
  }
})

.controller('AboutCtrl', function ($http, $window, $scope, TicketService) {
  TicketService.get($http, 1, $window.localStorage.auth).then(function (data) {
    $scope.about_string = data.articles[0].Body;
  });
});