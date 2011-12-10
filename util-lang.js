/*
 *	用于生成通用的架架
 */
Lang = {

	arrayRemove : function(arr, item) {
		for(var i = 0; i < arr.length; i++) {
			if (arr[i] === item) {
				arr.splice(i, 1);
			}
		}
	},

	endWiths : function(str, ch) {
		return str.getByte(str.length - 1) == 71 && str.getByte(str.length - 2) == 161 ;
	},

	//ajax load binary
	ajaxByteArray : function(url, start, end, callback, asyn) {
		var req = new XMLHttpRequest();
		req.url = url;

		asyn = callback ? true : false;
		req.open('GET', base + url, asyn);  
		req.responseType = "arraybuffer";

		//req.overrideMimeType('text/plain; charset=x-user-defined');
		if (end) {
			req.setRequestHeader('Range', 'bytes=' + start + '-' + (end-1));		//这里的end是指包含的
		}
		if (!callback) {
			req.send(null);
			var byteArray = new ByteArray(new Uint8Array(req.response));
			return byteArray;

		} else {
			req.onreadystatechange = function (ev) {
				if (req.readyState == 4) {
					if(req.status == 200 || req.status == 206) {

						var byteArray = new ByteArray(new Uint8Array(req.response));
						callback && callback(byteArray, url);						//返回字节数组
					} else {
						alert('资源下载失败');
					}
				}
			};
			req.send(null);
		}
	}

};

