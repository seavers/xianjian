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
	ajaxByteArray : function(url, callback) {
		var req = new XMLHttpRequest();
		req.url = url;

		req.open('GET', base + url, true);  
		req.responseType = "arraybuffer";

		//req.overrideMimeType('text/plain; charset=x-user-defined');
		req.onreadystatechange = function (ev) {
			if (req.readyState == 4) {
				if(req.status == 200) {
					var byteArray = new ByteArray(new Uint8Array(req.response));
					callback && callback(byteArray, url);		//返回字节数组
				} else {
					alert('资源下载失败');
				}
			}
		};
		req.send(null);

		return req;
	}
};

