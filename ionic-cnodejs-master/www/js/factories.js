angular.module('starter.factories', [])
	.factory('CacheFactory', function($window){
		var append = function(key, value){
		};
		var save = function(key, value){
			$window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value);
		};
		var get = function(key){
			return $window.localStorage.getItem(key) || null;
		};
		var remove = function(key){
			$window.localStorage.removeItem(key);
		};
		return {
			append: append,
			save: save,
			get: get,
			remove: remove
		};
	})

	.factory('SettingFactory', function(CacheFactory){
		var setting = JSON.parse(CacheFactory.get('setting'));
		var get = function(key){
			return !!key ? (setting[key] || null) : setting;
		};
		var save = function(){
			if ( arguments.length > 1 ) {
				setting[arguments[0]] = arguments[1];
			} else {
				setting = arguments[0];
			}
			CacheFactory.save('setting', setting);
		};
		var remove = function(key){
			save(key, null);
		};
		return {
			save: save,
			get: get,
			remove: remove
		};
	})

	.factory('HttpFactory', function($http, $ionicPopup, $ionicLoading, CacheFactory){

		/**
		 * method – {string} – HTTP method (e.g. 'GET', 'POST', etc)
		 * url – {string} – Absolute or relative URL of the resource that is being requested.
		 * params – {Object.<string|Object>} – Map of strings or objects which will be turned to ?key1=value1&key2=value2 after the url. If the value is not a string, it will be JSONified.
		 * data – {string|Object} – Data to be sent as the request message data.
		 * headers – {Object} – Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent.
		 * xsrfHeaderName – {string} – Name of HTTP header to populate with the XSRF token.
		 * xsrfCookieName – {string} – Name of cookie containing the XSRF token.
		 * transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version. See Overriding the Default Transformations
		 * transformResponse – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http response body and headers and returns its transformed (typically deserialized) version. See Overriding the Default Transformations
		 * cache – {boolean|Cache} – If true, a default $http cache will be used to cache the GET request, otherwise if a cache instance built with $cacheFactory, this cache will be used for caching.
		 * timeout – {number|Promise} – timeout in milliseconds, or promise that should abort the request when resolved.
		 * withCredentials - {boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
		 * responseType - {string} - see requestType.
		 */
		var send = function(config){

			!!config.scope && ( config.scope.loading = true);

			!!config.mask && $ionicLoading.show({
				template: typeof config.mask == "boolean" ? '请稍等...' : config.mask
			});

			config.method == 'post' && ( config.data = config.data || {} ) && ionic.extend(config.data, {
				accesstoken: CacheFactory.get('accessToken')
			});

			ionic.extend(config, {
				timeout: ERROR.TIME_OUT
			});

			var http = $http(config);

			http.catch(function(error){
				if ( error.status == 0 ) {
					error.data = {
						template: !navigator.onLine || error.data == '' ?
							'哥们，不是我瞎说，你断网了...' :
							'等了' + error.config.timeout + '毫秒都没有响应，所以我把请求取消了...'
					}
				} else if ( error.data.error_msg == ERROR.WRONG_ACCESSTOKEN || status == 403 ) {
					error.data = {
						template: '好像是鉴权失效了，该不会是<b>@alsotang</b>的API有啥问题吧？'
					}
				} else {
					error.data = {
						template: '喏，响应信息都在这了：' + JSON.stringify(error.data)
					}
				}
				$ionicPopup.alert({
					title: '擦，悲剧了...',
					template: error.data.template,
					buttons: [
						{
							text: '算了',
							type: 'button-balanced'
						}
					]
				});
			});

			http.finally(function(){
				!!config.scope && ( config.scope.loading = false);
				!!config.mask && $ionicLoading.hide();
			});

			return http;
		};

		return {
			send: send
		}

	});
