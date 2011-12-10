

	var WIDTH = context.canvas.width;
	var HEIGHT = context.canvas.height;

	var images = {};

	//mx my modify

	var mapX = 0;
	var mapY = 0;

	function drawImage2(drawContext, img, x, y) {
		drawContext.drawImage(img, x, y);
	}

	function drawImage(img, x, y, drawContext) {
		if (!img) {
			alert('[warn] drawImage ' + x + ' ' + y + ' ' + alpha);
			return;
		}

		if (x > mapX - WIDTH && x < mapX + WIDTH && y > mapY - HEIGHT && y < mapY + HEIGHT) {
			//alert(1);
			drawContext = drawContext || context;
			drawContext.drawImage(img, x-mapX+0xA0, y-mapY+0x70);
		}
	}


	//显示单字符, 主要是某些文本符号
	function drawText(word, x, y, drawContext1, color, fontSize) {
		var context1 = drawContext1 || context;
		//if (word !== '') {
			context1.fillStyle = color || '#888888';
			context1.font = (fontSize||6) + 'px';
			context1.fillText(word, x - mapX + 0xA0, y - mapY + 0x70);
		//}

	}

	//显示单字符, 主要是某些文本符号
	function drawRect(x, y, drawContext1, color) {
		var context1 = drawContext1 || context;
		//if (word !== '') {
			context1.fillStyle = color || '#888888';
			context1.strokeRect(x - mapX + 0xA0, y - mapY + 0x70, 16, 16);
		//}

	}

	//显示单字符, 主要是某些文本符号
	function drawCircle(x, y, drawContext1, color) {
		var context1 = drawContext1 || context;
		//if (word !== '') {
			context1.fillStyle = color || '#888888';
			context1.beginPath();
			context1.arc(x - mapX + 0xA0, y - mapY + 0x70, 8, 0, 7);
			context1.stroke();
			context1.closePath();
		//}

	}

	//显示单字符, 主要是某些文本符号
	function drawRhombus(x, y, drawContext1, color) {
		var context1 = drawContext1 || context;
		var cx = x - mapX + 0xA0;
		var cy = y - mapY + 0x70;

		context1.fillStyle = color || '#888888';
		context1.beginPath();
		context1.moveTo(cx, cy - 8);
		context1.lineTo(cx + 16, cy);
		context1.lineTo(cx, cy + 8);
		context1.lineTo(cx - 16, cy);
		context1.lineTo(cx, cy - 8);
		context1.stroke();
		context1.closePath();

	}

	//loadMap();
	function drawGop(mapId, tileId, posX, posY, drawContext) {
		var img = loadGop(mapId, tileId);
		drawImage(img, posX - 16, posY - 8, drawContext);
	}

	var mx = 8;
	var my = 14;

	var nextSceneId = 0;
	var mapId = 12;
	var startEventId = 0;
	var endEventId = 0x20;

	function drawMapAll() {
		//0c 号地图
		var data = loadMap(mapId);

		//showHex('console', data);
		//console.log('map.length = ' + data.length);

		//载入地图背景层
		for(var y = 0; y < 128; y++) {
			for(var x = 0; x < 128; x++) {
				var posX = 16 * x;
				var posY = 16 * y + (x % 2 == 0 ? 0 : 8);
				var index = y * 128 + x;

				var tileId1 = u9s(data, index);
				//drawGop(mapId, tileId1, posX, posY, backContext);
				var img1 = loadGop(mapId, tileId1);
				mapContext.drawImage(img1, posX - 16, posY - 8);

				var tileId2 = u9s(data, index, 2);
				tileId2--;
				if (tileId2 == -1) {
					continue;
				}
				//drawGop(mapId, tileId2, posX, posY, backContext);

				var img2 = loadGop(mapId, tileId2);
				mapContext.drawImage(img2, posX - 16, posY - 8);
			}
		}
	}

	function drawMapBack() {
		var offsetX = mapX - 0xA0;
		var offsetY = mapY - 0x70;

		if (offsetX >= 0 && offsetY >= 0) {
			backContext.drawImage(mapContext.canvas, offsetX, offsetY, 320, 200, 0, 0, 320, 200);
		}
	}


	var tiles = [];			//输入tiles, 

	function drawEventObject() {

		//载入event object
		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];

			//drawText(o.id+'.'+o.state+'.'+o.trigMode, o.x, o.y, tempContext);

			//if (!o || o.state == 0 || o.roleId == 0) {
			if (!o || o.roleId == 0) {		//o.state 放在draw中判断
				continue;
			}

			var mgo = loadMgo(o.roleId, o.frame);
			if (!mgo) {
				continue;
			}
			//drawImage(mgo, o.x - mgo.width/2, o.y - mgo.height + 7);
			o.tile = mgo;
			tiles.push(o);
		}

	}

	function drawMapFront() {
		//0c 号地图
		var data = loadMap(mapId);

		//载入地图背景层
		for(var y = my - 7; y < my + 7; y++) {
			for(var x = mx*2-10; x < mx*2+10; x++) {
				var index = y * 128 + x;
				var tileId1 = u9s(data, index);
				var tileId2 = u9s(data, index, 2);
				var zindex = u3s(data, index);
				var zindex2 = u3s(data, index, 2);

				var mapX = mx * 32 + mhalf * 16;		//mhalf, 则加一半
				var mapY = my * 16 + mhalf * 8;

				var posX = 16 * x;
				var posY = 16 * y + (x % 2 == 0 ? 0 : 8);

				if (zindex > 0) {		//z-index
					//if ((posY - mapY)/8 + zindex > 0) {				//用 y-my+zindex>2 多多少少有问题
					//	drawGop(mapId, tileId1, posX, posY, frontContext);
					//}
					var img = loadGop(mapId, tileId1);
					tiles.push({
						type : 'tile',
						x : posX,
						y : posY,
						layer : zindex,
						tile : img,
						z : 0
					});
				}

				tileId2--;
				if (tileId2 == -1) {
					continue;
				}
				if (zindex2 > 0) {		//z-index
					//if ((posY - mapY)/8 + zindex2 > 0) {
					//	drawGop(mapId, tileId2, posX, posY, frontContext);
					//}
					var img = loadGop(mapId, tileId2);
					tiles.push({
						type : 'tile',
						x : posX,
						y : posY,
						layer : zindex2,
						tile : img,
						z : 1					//当层级一样时, 再比较z
					});
				}
			}
		}
	}

	
	function drawRole() {
		//角色显示
		var role = roles[0];
		var tile = role.tileId;

		//role.frame = -1 的时候, 不显示
		var roleImg = loadMgo(role.tileId, role.frame);
		role.tile = roleImg;

		tiles.push(role);
		//drawImage(roleImg, role.x - roleImg.width/2 , role.y -roleImg.height + 4);

		//console.log('role ' + mapX + ' ' + mapY + ' ' + src);
	}

	
	function drawEventObjectPos() {

		//载入event object
		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];

			if (o.state > 0) {
				drawText(o.id+'.'+o.state+'.'+o.trigMode+'.'+o.x+'.'+o.y, o.x, o.y);
			}
		}
	}


	function drawMiddle() {
		tiles.sort(function(a, b) {			//层级核心算法
			var al = a.layer > 256 ? a.layer - 65536 : a.layer;
			var bl = b.layer > 256 ? b.layer - 65536 : b.layer;
			return (a.y - b.y) / 8 + (al - bl) || a.y - b.y || ((a.z || 0) - (b.z||0));
		});

		for(var i = 0; i < tiles.length; i++) {
			var o = tiles[i];
			if (o.type == 'tile') {
				drawImage(o.tile, o.x - o.tile.width/2 , o.y - o.tile.height + 7);				//-16, -8
			} else if (o.type == 'npc') {
				if (o.state == 1 || o.state == 2) {
					drawImage(o.tile, o.x - o.tile.width/2 , o.y - o.tile.height + 7);
				}
			} else if (o.type == 'role') {
				drawImage(o.tile, o.x - o.tile.width/2 , o.y - o.tile.height + 4);
			} else {
				alert('drawMiddle' + ' ' + o.type + ' ' + o.state);
			}

			if (TRACE) {
				var l = o.layer > 256 ? o.layer - 65536 : o.layer;
				drawText(i, o.x, o.y, tempContext);
			}
		}
	}
	
	var updateCount = [0, 0, 0];

	function update(refreshBack) {
		tempContext.clearRect(0, 0, tempContext.canvas.width, tempContext.canvas.height);

		if (refreshBack) {
			updateCount[0]++;
			drawMapBack();
		}

		tiles = [];
		drawEventObject();
		drawRole();
		drawMapFront();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		drawMiddle();

		//drawCanvas();
		//drawCanWalk();
		window.DEBUG && drawEventArea();
		window.TRACE && drawEventObjectPos();
		updateCount[1]++;
	}

	function updateTalk() {			//only talk
		talkContext.clearRect(0, 0, talkContext.canvas.width, talkContext.canvas.height);
		updateCount[2]++;
	}


	//0能走, 1不能走
	function canWalk(x, y, half) {
		var data = loadMap(mapId);
		var bool = data.getByte((x*2+(half?1:0)+y*128)*4+1) & 0x20;
		if (!bool) {
			var mx = 32 * x + 16 * half;
			var my = 16 * y + 8 * half;
			for(var i = startEventId+1; i <= endEventId; i++) {
				var o = eventObjects[i];
				if (mx == o.x && my == o.y) {
					if (o.state == 2) {
						return 1;
					}
				}
			}
		}
		return bool;
	}




	function drawMenu(drawContext, text, x, y, color) {
		for(var i = 0; i < text.length; i++) {

			var fonId = text.charCodeAt(i);
			var img = loadFon(fonId);
			img && drawContext.drawImage(img, x + i * 16, y);		//TODO: 加色

		}
	}


	
	function drawCanWalk() {
		//0c 号地图
		var data = loadMap(mapId);
		
		//载入地图背景层
		for(var y = 0; y < 128; y++) {
			for(var x = 0; x < 128; x++) {
				var posX = 16 * x;
				var posY = 16 * y + (x % 2 == 0 ? 0 : 8);

				drawText(canWalk(x, y, x % 2), posX, posY);
			}
		}
	}
	
	function drawEventArea() {
		drawRhombus(roles[0].x, roles[0].y);
		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];
			//console.log('drawEventArea' + ' ' + o.x + ' ' + o.y);
			drawRhombus(o.x, o.y);
		}
	}

