angular.module('mySuperApp', [ 'ionic' ])

.controller('MyCtrl', function($scope, $ionicSlideBoxDelegate, $timeout) {
	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	}
});