var app = angular.module('starter');
app.controller('SearchCtrl',['$scope','$http','MathService','userService','$ionicPopup', function($scope, $http, MathService,userService,$ionicPopup) {
    //$scope.numOne = 4;
    //$scope.numTwo = 5;
    $scope.resultNum = 0;
    $scope.data = {
        numOne: 4,
        numTwo: 5,
        operation: "+"
    };

    $scope.count = 1;
    //$scope.$watch('count', function() {
    //    //$scope.showAlert();
    //});
    //$scope.$watch('numOne',function(){
    //    $scope.showAlert();
    //});
    $scope.greeting = {"id":$scope.count,"content":"Static Data"};

    $scope.HelloCall = function () {
        $scope.count++;
        $scope.result = MathService.add(2,4);
        $scope.user = userService.users[1];
        $http.get('http://rest-service.guides.spring.io/greeting')
            .then(function(resp) {
                console.log('Success', resp);
                $scope.greeting = resp.data;
                // For JSON responses, resp.data contains the result
            }, function(err) {
                console.error('ERR', err);
                // err.status will contain the status code
            })

    };

    $scope.performArithmeticOperation =function(){
          if($scope.data.operation == "+"){
              $scope.getSum();
          }else if($scope.data.operation == "-"){
              $scope.performSubstraction();
          }else if($scope.data.operation == "x"){
              $scope.perfromMulitplication();
          }else if($scope.data.operation == "/"){
              $scope.perfromDivision();
          }
    }

    $scope.getSum = function(){
        console.log("num1:"+$scope.data.numOne + " num2:"+$scope.data.numTwo);
        $scope.resultNum = MathService.add($scope.data.numOne,$scope.data.numTwo);
        console.log("sum="+$scope.resultNum);
    }
    $scope.performSubstraction = function(){
        console.log("num1:"+$scope.data.numOne + " num2:"+$scope.data.numTwo);
        $scope.resultNum = MathService.subtract($scope.data.numOne,$scope.data.numTwo);
        console.log("substraction="+$scope.resultNum);
    }
    $scope.perfromMulitplication = function(){
        console.log("num1:"+$scope.data.numOne + " num2:"+$scope.data.numTwo);
        $scope.resultNum = MathService.multiply($scope.data.numOne,$scope.data.numTwo);
        console.log("multiply="+$scope.resultNum);
    }
    $scope.perfromDivision = function(){
        console.log("num1:"+$scope.data.numOne + " num2:"+$scope.data.numTwo);
        $scope.resultNum = MathService.divide($scope.data.numOne,$scope.data.numTwo);
        console.log("divide="+$scope.resultNum);
    }

    $scope.DecrementCount = function () {
        $scope.count--;
    };

    // An alert dialog
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

    $scope.HelloCall();
}]);