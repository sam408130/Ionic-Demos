angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,$ionicPopup, $timeout,$rootScope) {
  // Form data for the login modal
  $scope.loginData = {};
        $scope.loginMsg = "";
        $rootScope.isLogedIn = false;
        $rootScope.AppCount = 1;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
      $scope.loginMsg = "";
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
      if(($scope.loginData.username == undefined || $scope.loginData.username == "") || ($scope.loginData.password == undefined || $scope.loginData.password == "")){
          $scope.loginMsg = "Please enter username -> test and password -> test";
      }else
      if(($scope.loginData.username != undefined && $scope.loginData.username == "test") && ($scope.loginData.password != undefined && $scope.loginData.password == "test")){
          $scope.loginMsg = "success";
          $rootScope.isLogedIn = true;
          // Simulate a login delay. Remove this and replace with your login
          // code if using a login system
          $timeout(function() {
              $scope.closeLogin();
          }, 1000);
      }else {
          $scope.loginMsg = "failure";
      }
  };

            $scope.doLogout = function() {
                console.log('show popup');
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Logout',
                    template: 'Are you sure you want to logout?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        console.log('You are sure');
                        $rootScope.isLogedIn = false;
                    } else {
                        console.log('You are not sure');
                    }
                });
            };

})



.controller('browserCtrl', function($scope, $stateParams, $rootScope) {
      $rootScope.AppCount = 1;

      $scope.incrementCount = function () {
        $rootScope.AppCount++;
      };
    });
