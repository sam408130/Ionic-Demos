/**
 * Created by Amit.Gupta on 3/10/2015.
 */
var app = angular.module('starter');

app.controller('employeeListCtrl', ['$scope', 'Employee', function ($scope, Employee) {
    $scope.employees = Employee.query()

    $scope.filterEmployeesByName = function (item) {
        if (!$scope.searchKey) {
            return true;
        } else {
            var keywords = $scope.searchKey.toLowerCase().split(' ');
            for (var i in keywords) {
                var k = keywords[i];
                if (item.firstName.toLowerCase().indexOf(k) >= 0 || item.title.toLowerCase().indexOf(k) >= 0) {
                    return true;
                }
            }
            return false;
        }
    };
}]);
