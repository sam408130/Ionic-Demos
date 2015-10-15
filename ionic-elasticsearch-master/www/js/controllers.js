angular.module('starter.controllers', ['ngCordova', 'elasticsearch'])

.controller('MapCtrl', function($scope, $cordovaGeolocation, $http, ESService, NSService, $localstorage) {
	var map_center = [12119653.781323666,4054689.6824535457];
	if($localstorage.get('map_center')) {
		var mapCenter = $localstorage.get('map_center').split(",");
		map_center = [mapCenter[0], mapCenter[1]];
	}
	var view = new ol.View({
		center: map_center,
		zoom: 4
	});

	var controls = ol.control.defaults({rotate: false});
	var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

	var map = new ol.Map({
		controls: controls,
		interactions: interactions,
		layers: [
			new ol.layer.Tile({
				source: new ol.source.BingMaps({
					key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
					culture: 'zh-CN',
					imagerySet: 'Road'
				})
			})
		],
		renderer: NSService.exampleNS.getRendererFromQueryString(),
		target: 'map',
		view: view
	});

	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	$cordovaGeolocation
		.getCurrentPosition(posOptions)
		.then(function (position) {
			var pos = new ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');

			$localstorage.set('position', [position.coords.latitude, position.coords.longitude].toString());
			$localstorage.set('map_center', pos);

			view.setCenter(pos);
		}, function (err) {
			console.log(err)
		});

	ESService.search("", 0).then(function(results){
		var vectorSource = new ol.source.Vector({ });
		$.each(results, function(index, result){
			var position = result.location.split(",");
			var pos = ol.proj.transform([parseFloat(position[1]), parseFloat(position[0])], 'EPSG:4326', 'EPSG:3857');

			var iconFeature = new ol.Feature({
					geometry: new ol.geom.Point(pos),
					name: result.title,
					phone: result.phone_number,
					distance: result.distance
			});
			vectorSource.addFeature(iconFeature);
		});

		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.75,
				src: 'img/icon.png'
			}))
		});

		var vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: iconStyle
		});
		map.addLayer(vectorLayer);

		var element = document.getElementById('popup');

		var popup = new ol.Overlay({
			element: element,
			positioning: 'bottom-center',
			stopEvent: false
		});
		map.addOverlay(popup);

		map.on('click', function(evt) {
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function(feature, layer) {
					return feature;
				});

			if (feature) {
				var geometry = feature.getGeometry();
				var coord = geometry.getCoordinates();
				popup.setPosition(coord);
				$(element).popover({
					'placement': 'top',
					'html': true,
					'content': "<h4>商品:" + feature.get('name') + "</h4>" + '' +
					'<a ng-href="tel: {{result.phone_number}}" class="button button-calm button-outline icon-left ion-ios-telephone">' + feature.get('phone') + '</a>' +
						"<p class='icon-left ion-ios-navigate'> " + feature.get('distance') + "公里</p>"
				});
				$(element).popover('show');
			} else {
				$(element).popover('destroy');
			}
		});
	});
})

.controller('ListsCtrl', function($scope, $http, ESService, $cordovaGeolocation, $localstorage) {
	$scope.results = [];

	var posOptions = {timeout: 10000, enableHighAccuracy: true};
	$cordovaGeolocation
		.getCurrentPosition(posOptions)
		.then(function (position) {
			var pos = new ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');

			$localstorage.set('position', [position.coords.latitude, position.coords.longitude].toString());
			$localstorage.set('map_center', pos);

			ESService.search("", 0).then(function(results){
				$scope.results = results;
			});
		}, function (err) {
			ESService.search("", 0).then(function(results){
				$scope.results = results;
			});
		});
})

.controller('SearchCtrl', function($scope, ESService) {
	$scope.query = "";
	var doSearch = ionic.debounce(function(query) {
		ESService.search(query, 0).then(function(results){
			$scope.results = results;
		});
	}, 500);

	$scope.search = function(query) {
		doSearch(query);
	}
})

.controller('CreateCtrl', function($scope, $http, $localstorage, $ionicPopup) {
	$scope.data = {};
	$scope.info = {};

	$scope.newPost = function() {
		$localstorage.setObject('data', $scope.data);
		var url = $localstorage.get('api_server');

		var res = $http.post(url, $scope.data);
		res.success(function (data) {
			var alertPopup = $ionicPopup.alert({
				title: '创建成功',
				template: '标题' + data.title + '; 简介' + data.body
			});
			alertPopup.then(function(res) {
				console.log('Thank you for not eating my delicious ice cream cone');
			});
		});
		res.error(function (data) {
			var keys = [];
			$.each(data, function (key) {
				keys.push(key);
			});

			var alertPopup = $ionicPopup.alert({
				title: '请填写下面的字段',
				template: keys.toString()
			});
			alertPopup.then(function(res) {
				console.log('Thank you for not eating my delicious ice cream cone');
			});
		});
	}
})

.controller('SettingCtrl', function($scope, $state, $localstorage) {
		$scope.data = {};
		$scope.placeholder = {
			api_server: $localstorage.get('api_server'),
			es_server: $localstorage.get('es_server'),
			es_index: $localstorage.get('es_index')
		};

		$scope.setting =  function () {
			$scope.data = angular.extend($scope.placeholder, $scope.data);
			$localstorage.set('api_server', $scope.data.api_server);
			$localstorage.set('es_server', $scope.data.es_server);
			$localstorage.set('es_index', $scope.data.es_index);
			$state.go('tab.lists');
		}
});
