angular.module('starter.service', [])



/**
 * 拍照功能
 */
.factory('Camera', function($q) {
	return {
		getPicture: function(options) {
			var q = $q.defer();
			navigator.camera.getPicture(function(result) {
				// Do any magic you need
				q.resolve(result);
			}, function(err) {
				q.reject(err);
			}, options);

			return q.promise;
		}
	}
})


/**
 * Upyun认证数据
 */
.factory('Upyun', function($http) {
	return {
		token: function(name, size) {
			return $http.jsonp("http://transfer.impress.pw/upyun?callback=JSON_CALLBACK", {
				cache: false
			});
		}
	}
})


;