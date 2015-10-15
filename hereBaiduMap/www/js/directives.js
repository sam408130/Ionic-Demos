angular.module('starter.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        var map = new BMap.Map($element[0]);
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        $scope.onCreate({map: map});
      }

      window.onload = initialize;
    }
  }
});
