angular.module('starter.controller', [])




.controller("DemoCtrl", function($scope, $ionicActionSheet, $timeout, $state, $ionicLoading, $cordovaImagePicker, Camera, Upyun) {
	$scope.image = '';
	
	
	// 图片选择项
	$scope.showImageUploadChoices = function(prop) {
		var hideSheet = $ionicActionSheet.show({
			buttons: [{
				text: '<b>拍照</b> 上传'
			}, {
				text: '从 <b>相册</b> 中选'
			}],
			titleText: '图片上传',
			cancelText: '取 消',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				// 相册文件选择上传
				if (index == 1) {
					$scope.readalbum(prop);
				} else if (index == 0) {
					// 拍照上传
					$scope.taskPicture(prop);
				}
				return true;
			}
		});

	};


	// 读用户相册
	$scope.readalbum = function(prop) {
		if (!window.imagePicker) {
			alert('目前您的环境不支持相册上传。')
			return;
		}

		var options = {
			maximumImagesCount: 1,
			width: 800,
			height: 800,
			quality: 80
		};

		$cordovaImagePicker.getPictures(options).then(function(results) {
			var uri = results[0],
				name = uri;
			if (name.indexOf('/')) {
				var i = name.lastIndexOf('/');
				name = name.substring(i + 1);
			}

			// 获取UPYUN的token数据
			Upyun.token(name, 1000).then(function(resp) {
				localStorage.setItem('STREAM_UPLOAD_UPYUN', JSON.stringify(resp.data));
				$scope.uploadimage(uri, prop);
			}).finally(function() {
			});
		}, function(error) {
			alert(error);
		});
	};

	// 拍照
	$scope.taskPicture = function(prop) {
		if (!navigator.camera) {
			alert('请在真机环境中使用拍照上传。')
			return;
		}

		var options = {
			quality: 75,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false
		};
		Camera.getPicture(options).then(function(imageURI) {
			$scope.uploadimage(imageURI);
			var name = imageURI;
			if (name.indexOf('/')) {
				var i = name.lastIndexOf('/');
				name = name.substring(i + 1);
			}

			// 获取UPYUN的token数据
			Upyun.token(name, 1000).then(function(resp) {
				localStorage.setItem('STREAM_UPLOAD_UPYUN', JSON.stringify(resp.data));
				$scope.uploadimage(imageURI, prop);
			}).finally(function() {});

		}, function(err) {
			alert("照相机：" + err);
		});

	}

	// 上传到又拍云
	$scope.uploadimage = function(uri, prop) {
		var fileURL = uri;
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		options.chunkedMode = true;

		var upyun = JSON.parse(localStorage.getItem('STREAM_UPLOAD_UPYUN'));
		var params = {
			bucket: upyun['bucket'],
			expiration: upyun['expiration'],
			'save-key': upyun['save-key'],
			policy: upyun['policy'],
			signature: upyun['signature']
		}

		options.params = params;

		var ft = new FileTransfer();
		$ionicLoading.show({
			template: '上传中...'
		});
		ft.upload(fileURL, upyun['host'], function(data) {
			// 设置图片新地址
			var resp = JSON.parse(data.response);
			var link = upyun['domain'] + resp.url;
			console.log(link)
			$scope.image = link;
			var element = document.getElementsByName("AssistImageName");
			element[0].src = link;
			element[1].src = link;

			$ionicLoading.hide();
		}, function(error) {
			alert(JSON.stringify(error));
			$ionicLoading.hide();
		}, options);
	}

})


;