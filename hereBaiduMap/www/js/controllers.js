angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      alert("a")
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    function onSuccess(position) {
      var geolocation = new BMap.Geolocation();
    	geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          var marker = new BMap.Marker(r.point);
          $scope.map.addOverlay(marker);
          $scope.map.panTo(r.point);
          $scope.loading.hide();
          //alert('您的位置：'+r.point.lng+','+r.point.lat);
        }
        else {
          alert('failed'+this.getStatus());
        }
      },{enableHighAccuracy: true});
    }

    function onError(error) {
      alert('Unable to get location: ' + error.message);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };
});
