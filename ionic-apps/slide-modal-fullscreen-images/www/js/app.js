angular.module('ionicApp', ['ionic'])

.controller('MainCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate',
	function($scope, $ionicModal, $ionicSlideBoxDelegate) {

		$scope.aImages = [{
			'src': 'http://ionicframework.com/img/ionic-logo-blog.png',
			'msg': 'Swipe me to the left. Tap/click to close'
		}, {
			'src': 'http://ionicframework.com/img/ionic_logo.svg',
			'msg': ''
		}, {
			'src': 'http://ionicframework.com/img/homepage/phones-weather-demo@2x.png',
			'msg': ''
		}];

		$ionicModal.fromTemplateUrl('image-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$scope.openModal = function() {
			$ionicSlideBoxDelegate.slide(0);
			$scope.modal.show();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hide', function() {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
			// Execute action
		});
		$scope.$on('modal.shown', function() {
			console.log('Modal is shown!');
		});

		// Call this functions if you need to manually control the slides
		$scope.next = function() {
			$ionicSlideBoxDelegate.next();
		};

		$scope.previous = function() {
			$ionicSlideBoxDelegate.previous();
		};

		$scope.goToSlide = function(index) {
			$scope.modal.show();
			$ionicSlideBoxDelegate.slide(index);
		}

		// Called each time the slide changes
		$scope.slideChanged = function(index) {
			$scope.slideIndex = index;
		};
	}
]);