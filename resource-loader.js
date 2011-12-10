//用于提取数据

	var base = 'pal/';		//当前目录
	var files = [
		['sss.mkf', 5],			//核心数据
		['pat.mkf', 9],			//调色板
		['wor16.asc'],			//码表
		//['wor16.fon', 0],		//繁体字库
		['jianti.fon', 0],		//简体字库
		['word.dat'],			//短语

		['fbp.mkf', 72],		//背景图

		['map.mkf', 226],		//地图
		['gop.mkf', 226, (location.hostname!='localhost')],		//图元
		['mgo.mkf', 637],		//角色
		['rgm.mkf', 92],		//头像
		['m.msg', 0],			//对话数据

		['data.mkf'],			//数据类
		['abc.mkf'],			//
		['ball.mkf'],			//物品类
		//['map.bin.mkf'];
	];


/*  load resource */

	var file_caches = {};		//key -> Uint8Array

	//提前加载需要的资源文件, 防止大量的相同的异步请求
	function ready(callback) {
		console.log('init ready start');

		var queue = Queue.create();

		for(var i = 0; i < files.length; i++) {

			(function(c) {
				var end = files[c][2] ? files[c][1] * 4 : undefined;
				queue.add(function() {
					loadUrl(files[c][0], 0, end, function(byteArray, url) {
						save(url, byteArray);
						queue.remove();
					}, true);
				});
			})(i);
		}

		queue.finish(callback);
	}

	function load(url) {
		var file = file_caches[url];
		if (!file) {
			alert('未加载 ' + url);
			return;
		}
		return file;
	}

	function save(url, byteArray) {
		file_caches[url] = byteArray;
	}



	//ajax load
	function loadUrl(url, start, end, callback) {
		
		document.getElementById('info').innerHTML += '正在下载 : ' + url + ' ' + (start||'') + ' ' + (end||'') + '<br/>';
		console.log('正在下载资源文件 : ' + url + ' ');

		if (callback) {
			Lang.ajaxByteArray(url, start, end, function(ret, url) {
				//document.getElementById('info').innerHTML += '下载完成 (' + ret.length + ')';
				console.log('下载完成 ' + url + '(' + ret.length + ')');
				return callback && callback(ret, url);
			});
		} else {
			var ret = Lang.ajaxByteArray(url, start, end);
			//document.getElementById('info').innerHTML += '下载完成 (' + ret.length + ')';
			console.log('下载完成 ' + url + '(' + ret.length + ')');
			return ret;
		}
	}
	
	/**************    load Mkf file  ***********/
	var loadMkfCount = 0;

	//仙剑的mkf打包格式
	function loadMkf(file, index) {
		var data = load(file);
		var start = data.getInt(index * 4);
		var end = data.getInt(index * 4 + 4);
			
		//console.log('read mkf ' + (loadMkfCount++) + ' : ' + file + ' ' + index + ' -> ' + toHex4(start) + ' ' + toHex4(end));

		if (data.length < end) {
			var f = file_caches[file + '_' + index];
			if (!f) {
				f = loadUrl(file, start, end);
				file_caches[file + '_' + index] = f;
			}
			return f;
		}

		if (end-start > 655360) {
			//alert('overflow : ' + file + ' ' + index + ' ' + (end-start));
			return ;
		}

		return data.slice(start, end);		//返回子视图
	}




