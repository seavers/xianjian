	//ajax load
	function ajax(url, callback) {
		var req = new XMLHttpRequest();
		req.url = url;
		req.open('GET', url, false);  
		//req.overrideMimeType('text/plain; charset=x-user-defined');
		req.send(null);

		//alert('load asyn ' + url + ' ' + req.status);
		if (req.status != 200) return '';
		callback(req.response, url);						//返回字节数组
	}

var old = null;
setInterval(function() {
	ajax('remote.txt', function(data) {
		if (old != data) {
			var value = eval('(' + data + ')');
			console.log('[remote] ' + data + ' = ' + value);
			old = data;
		}
	});

	
}, 1000);