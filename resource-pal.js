
	/***********  common  inner function  *********/
	
	var caches = {};

	function fromCache(key, callback) {
		var cache = caches[key];
		if (!cache) {
			cache = callback(key);
			caches[key] = cache;

			//console.log('cache : ' + key);
		}
		return cache;
	}
	function createImage(image, width, height) {
		return Canvas.create(image, width, height);
	}
	function mkf2Count(file, index) {
		var data = loadMkf(file, index);
		return data.getShort(0);
	}

	//mkf格式内的, 子打包, 其实已经不属于mkf了
	function loadMkf2(data, index) {
		var start = data.getShort(index * 2) * 2;		//地址要乘以2的, 这样的话, data 最大为 64k*2
		var end = data.getShort(index * 2 + 2) * 2;
		if (start >= end && end != 0) {
			console.log('[warn] : mkf2' + start + ' ' + end);
			return ;
		}
		return data.slice(start, end);
	}



	/****   load resource   ****/

	function loadSss(sssId) {
		var data = loadMkf('sss.mkf', sssId);
		return data;
	}

	function loadMap(mapId) {
		return fromCache('map_' + mapId, function(key) {
			var data = loadMkf('map.mkf', mapId);
			var dd = deyj(data);
			//alert(dd.length);
			return dd;
		});
	}

	function loadPal(palId) {
		return fromCache('pal_' + palId, function(key) {
			var data = loadMkf('pat.mkf', palId);

			var palette = [];			//256个

			for (var i = 0; i < 256; i++) {
				//palette[i] = 
					//(data[3*i+2] << 2  &  0x000000ff) +
					//(data[3*i+1] << 10 &  0x0000ff00) +
					//(data[3*i+0] << 18 &  0x00ff0000) +
					//(0xff000000) ;							//alpha, 不透明		
				palette[i] = 
					(data.getByte(3*i+2) << 2  &  0x000000ff) +
					(data.getByte(3*i+1) << 10 &  0x0000ff00) +
					(data.getByte(3*i+0) << 18 &  0x00ff0000) +
					(0xff000000) ;							//alpha, 不透明		
			}

			return palette;
		});
	}




	//这里不能使用异步, 否则会发起N多文件请求
	function loadGop(mapId, gopId) {
		var key = 'gop_' + mapId + '_' + gopId;
		return fromCache(key, function(key) {
			var gops = loadMkf('gop.mkf', mapId);
			var gop = loadMkf2(gops, gopId);
			var img = createRleImage(gop);

			//alert('gop_cache ' + key + ' ' + img);
			return img;
		});
	}

	function loadMgo(roleId, frame) {
		var key = 'mgo_' + roleId + '_' + frame;
		return fromCache(key, function(key) {
			var mgos = loadMkf('mgo.mkf', roleId);
			var dmgos = deyj(mgos);
			var mgo = loadMkf2(dmgos, frame);
			return createRleImage(mgo);
		});
	}

	function loadMgoCount(roleId) {
		var mgos = loadMkf('mgo.mkf', roleId);
		var dmgos = deyj(mgos);
		return dmgos.getShort(0) - 1;		//从1开始
	}

	function loadRgm(rgmId) {
		var key = 'rgm_' + rgmId;
		return fromCache(key, function(key) {
			var rgm = loadMkf('rgm.mkf', rgmId);
			var img = createRleImage(rgm, true);
			return img;
		});
	}

	function loadFbp(fbpId) {
		var key = 'fbp_' + fbpId;
		return fromCache(key, function(key) {
			var fbp = loadMkf('fbp.mkf', fbpId);
			var dfbp = deyj(fbp);
			var img = createPalImage(dfbp, 320, 200);		//应该是静态的pal图片
			return img;
		});
	}









	// 下面开始是调色板相关

	//返回的是调色板数据
	var globalPalletteId = 0;
	function createRleImage(data, isPal) {
		if (!data) return;

		var view = data.toDataView();
		var palId = isPal ? view.nextInt() : globalPalletteId;		//返回2不能用调色板id, 很怪~~
		var palette = loadPal(globalPalletteId);

		var width = view.nextShort();
		var height = view.nextShort();

		if (width > 200 || height > 200 || width <= 0 || height <= 0) {
			console.log('[warn] : rle ' + width + ' ' + height);
			return;
		}

		var result = [];
		while(result.length < width * height) {
			var n = view.nextByte();
			if (n > 0x80) {
				for(var i = 0; i < n - 0x80; i++) {
					result.push(0x00000000);
				}
			} else {
				for(var i = 0; i < n; i++) {
					var palId = view.nextByte();
					result.push(palette[palId]);
				}
			}
		}

		return createImage(result, width, height);
		/*
		return {
			data : result,
			width: width,
			height:height
		};
		*/
	}

	function createPalImage(data, width, height) {
		if (!data) return;

		var palId = globalPalletteId;		//返回2不能用调色板id, 很怪~~
		var palette = loadPal(globalPalletteId);

		var result = [];
		for(var i = 0; i < width * height; i++) {
			var palId = data.getByte(i);
			result.push(palette[palId]);
		}

		return createImage(result, width, height);


	}


	//***** 载入对话 ********/

	function loadMsg(msgId) {
		var talk = loadMkf('sss.mkf', 3);

		var start = talk.getInt(msgId * 4);
		var end = talk.getInt(msgId * 4 + 4);

		var msg = load('m.msg');
		var m = msg.slice(start, end);

		return m;

		//var str = '';
		//for(var i = 0; i < m.length/2; i++) {
		//	var h = m[i*2];
		//	var l = m[i*2+1];
		//	str += gbks[h*256+l];
		//}
		//return str;
	}

	//返回第index个汉字的tile
	function loadText(text, index) {
		var charCode = text.getShort(index);
		return loadWord(charCode);
	}

	function loadWord(charCode, color) {
		var fonId = _charCode2FonId(charCode);
		return loadFon(fonId, color);
	}

	function _charCode2FonId(code) {
		var file = load('wor16.asc');
		for(var i = 0; i < file.length/2; i++) {
			if (file.getShort(i*2+0) == code) {
				var pos = i;
				return pos;
			}
		}
	}

	var bbb = 1665;

	//获取第index个字
	function loadFon(fonId, color) {
		if (color) {
			return loadFon2(fonId, color);
		}

		var index = fonId
		var key = 'word_' + index;
		return fromCache(key, function(key) {
			var fon = load('jianti.fon');
			var base = bbb + index * 30;

			var data = fon.slice(base, base + 30);		//点阵数据, 16*15/8=30字节
			var view = data.toDataView();


			var width = 16;
			var height = 15;

			var pixels = [];
			for(var i = 0; i < width * height; i++) {
				var pos = i % 16 < 8 ? i+16 : i;		//16x15 -> 16x16, 纠正左右不对称的问题
				if (view.nextBits(1)) {
					pixels[pos] = 0xFFFFFFFF;
				} else {
					pixels[pos] = 0x00000000;
				}

			}

			return createImage(pixels, width, height);
			//return pixels;
		});
	}

	//获取第index个字
	//2仅仅是为了支持color
	function loadFon2(fonId, color) {
		var index = fonId

		var fon = load('jianti.fon');
		var base = bbb + index * 30;

		var data = fon.slice(base, base + 30);		//点阵数据, 16*15/8=30字节
		var view = data.toDataView();


		var width = 16;
		var height = 15;

		var pixels = [];
		for(var i = 0; i < width * height; i++) {
			var pos = i % 16 < 8 ? i+16 : i;		//16x15 -> 16x16, 纠正左右不对称的问题
			if (view.nextBits(1)) {
				pixels[pos] = color | 0xFF000000;	//最高字节为0xFF
			} else {
				pixels[pos] = 0x00000000;
			}

		}

		return createImage(pixels, width, height);
	}


	//获取第index个字, 但处理了颜色

	function loadPic(picId) {
		var pics = loadMkf('data.mkf', 9);
		var pic = loadMkf2(pics, picId - 1);
		return createRleImage(pic);


	}

	function loadAbc(abcId) {
		var abc = loadMkf('abc.mkf', abcId);
		dabc = deyj(abc);
		return createRleImage(dabc);
	}

	function loadBall(ballId) {
		var ball = loadMkf('ball.mkf', ballId);
		return createRleImage(ball, true);
	}


	function loadDat() {
		return load('word.dat');
	}











	//仙剑特定的获取方式


	//以int为单位, 返回 9bit 的整数, (用于MapTileId, 特殊点在于, 高位的1, 从0x10, 而非0x01取)
	function u9s(data, index, offset) {
		offset = offset || 0;

		var lowIndex = data.getByte(4 * index + offset + 0);
		var highIndex = data.getByte(4 * index + offset + 1);
		var tileIndex = lowIndex + ((highIndex & 0x10) << 4);
		return tileIndex;

	}

	function u3s(data, index, offset) {
		offset = offset || 0;

		var highIndex = data.getByte(4 * index + offset + 1);
		var zIndex = (highIndex & 0xCf);
		return zIndex;

	}


