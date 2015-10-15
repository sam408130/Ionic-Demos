angular.module('starter.services', ['starter.factories'])

	.service('ImageService', function(SettingFactory){

		var image = SettingFactory.get('image');

		/**
		 * 补全协议 && 优化七牛的图片 && 顺便判断要不要显示
		 * @see API http://developer.qiniu.com/docs/v6/api/reference/fop/image/
		 *
		 * @before <img src="//dn-cnode.qbox.me/xxx" alt="xxx.png">
		 * @after <img src="http://dn-cnode.qbox.me/xxx?imageView2/0/w/128/h/128" alt="xxx.png">
		 */
		var fixUrl = function(string){
			return ('' + string).replace(/"\/\/[^\s^"]*/g, function(match){
				return !image.enabled ? '"' + STATIC.HOLDER : ( '"http:' + match.substring(1) + (image.hd ? '' : STATIC.QINIU_API) )
			});
		};

		/**
		 * @before <img src="//dn-cnode.qbox.me/xxx" alt="xxx.png">
		 * @after <img src="img/holder.png" alt="xxx.png">
		 */
		var replaceUrlString = function(string){
			return fixUrl(!image.enabled ? string.replace(/src="[a-zA-z]+:\/\/[^\s]*/g, 'src="' + STATIC.HOLDER + '"') : string);
		};

		return {
			fixUrl: fixUrl,
			replaceUrlString: replaceUrlString
		};

	});