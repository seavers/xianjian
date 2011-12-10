
	var blankCallback = null;

	//只有用户点击空格后, 执行回调
	function registerBlank(callback) {
		blankCallback = callback;
	}

	var bindCallback = null;

	function bind(callback, scope) {
		bindCallback = callback.bind(scope || window);
	}
	function unbind() {
		bindCallback = null;
	}

	document.addEventListener('keydown', function(ev) {
		if (bindCallback) {
			bindCallback(ev);
			return;
		}
		//判断是否在脚本时间
		if (Script.isExec()) {
			if (ev.keyCode !== 32 || !blankCallback) {
				return;
			}
		}


		//alert(ev.keyCode);
		switch(ev.keyCode) {
			case 32: {
				ev.preventDefault();
				onBlank();
				break;	//空格
			}

			case 27: {	//ESC
				ev.preventDefault();
				ESC.onMenu();
				break;
			}

			case 69: {	//E
				ev.preventDefault();
				ESC.onItem();
				break;
			}

			case 65: 						//A
			case 68: 						//D
			case 87: 						//W
			{
				break;
			}
			case 83: 						//下0	S
			{
				ESC.onStatus();
				break;
			}


			case 74: 						//左1	J
			case 37: {						//左1	左
				ev.preventDefault();
				onLeft();
				break;
			}
			case 76: 						//右3	L
			case 39: {						//右3	右
				ev.preventDefault();
				onRight();
				break;
			}
			case 73: 						//上2	I
			case 38: {						//上2	上
				ev.preventDefault();
				onUp();
				break;
			}
			case 75: 						//下0	K
			case 40: {						//下0	下
				ev.preventDefault();
				onDown();
				break;
			}

			case 74: canvas.scale(2, 2);break;
			case 75: canvas.scale(1/2, 1/2);break;
		}
	});

	document.addEventListener('touchmove', function(ev) {
		ev.preventDefault();
	});


	document.addEventListener('touchend', function(ev) {
		//判断是否在脚本时间
		if (!isDrawLoop()) {
			if (!blankCallback) {
				return;
			}
		}

		ev.preventDefault();

		if (blankCallback) {
			blankCallback();
			blankCallback = null;
			return;
		}

		var endX = event.changedTouches[0].pageX;
		var endY = event.changedTouches[0].pageY;

		if (endX < 160 && endY < 100) {
			onLeft();
		} else if (endX < 160 && endY > 100) {
			onDown();
		} else if (endX > 160 && endY > 100) {
			onRight();
		} else if (endX > 160 && endY < 100) {
			onUp();
		}

	});

	function onLeft() {
		var x = mx, y = my, half = mhalf;

		if (half) {
			half = 0;
		} else {
			x--;
			y--;
			half=1;
		}
		roles[0].dir = 1;

		onXY(x, y, half, 1);
	}

	function onRight() {
		var x = mx, y = my, half = mhalf;

		if (!half) {
			half = 1;
		} else {
			x++;
			y++;
			half = 0;
		}
		roles[0].dir = 3;

		onXY(x, y, half, 3);
	}

	function onUp() {
		var x = mx, y = my, half = mhalf;

		if (!half) {
			y--;
			half = true;
		} else {
			x++;
			half = false;
		}
		roles[0].dir = 2;

		onXY(x, y, half, 2);
	}

	function onDown() {
		var x = mx, y = my, half = mhalf;

		if (!half) {
			x--;
			half = true;
		} else {
			y++;
			half = false;
		}
		roles[0].dir = 0;

		onXY(x, y, half, 0);
	}

	function onXY(x, y, half, dir) {
		refreshRoleCount(roles[0]);

		if (canWalk(x, y, half) != 0) {		//0能走, 1不能走
			update();
			return;
		}

		setRolePos(x, y, half);

		var posX = x * 32 + half * 16;
		var posY = y * 16 + half * 8;


		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];
			//console.log('event object ' + o.x + ' ' + o.y + ' ' + x + ' '  + y + ' ' + half);

			var s = Math.abs(o.x - posX) + Math.abs(o.y - posY);

			if (o.state == 0) {
				continue;
			}
			switch(o.trigMode) {

				case 7 :					//远距离触发, 主要是  (得找找了, 第1个应该在市集入口吧)
					if (0 <= s && s < 32) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
					break;
				case 6 :					//远距离触发, 主要是
					if (0 <= s && s < 48) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
					break;
				case 5 :					//中距离触发, 主要是切换场景
					if (0 <= s && s <= 32) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
					break;
				case 4 :					//近距离触发, 如踩机关
					if (posX == o.x && posY == o.y) {
						startEventTrig(o);
					}
					break;
			}
		}
	}




	function onBlank() {
		if (blankCallback) {
			var bcb = blankCallback;
			blankCallback = null;
			bcb();
			return;
		}

		var x = mx, y = my, half = mhalf;

		var posX = x * 32 + half * 16;
		var posY = y * 16 + half * 8;

		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];
			if (o.state == 0) {
				continue;
			}
			switch(o.trigMode) {

				case 3 :					//远距离触发, 需按空格
					if (x * 32 + 32 >= o.x && o.x >= x * 32 - 32
						&& y * 16 + 16 >= o.y && o.y >= y * 16 - 16) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
					break;
				case 2 :					//中距离触发, 需空格, 且需面对面(如苗首领), 或者踩在上面(如李房间地洞)
					if (x * 32 + 32 >= o.x && o.x >= x * 32 - 32
						&& y * 16 + 16 >= o.y && o.y >= y * 16 - 16) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
					break;
				case 1 :					//近距离触发, 需要按空格
					if (x * 32 + 32 >= o.x && o.x >= x * 32 - 32
						&& y * 16 + 16 >= o.y && o.y >= y * 16 - 16) {
						//alert('trigger ' + o.id);
						startEventTrig(o);
					}
			}
		}

	}
