
	//场景与事件从1记数, 其它从0计数,与脚本中的id对应
	var eventObjects = [];

	function initEventObject() {
		var sssId = 0;
		var data = loadSss(sssId);

		var view = data.toDataView();

		eventObjects[0] = null;

		var num = data.length / 32;	//每个32字节
		for(var i = 0; i < num; i++) {
			var obj = {
				type : 'npc',
				id : i+1,						//base 1
				nouse : view.nextShort(),
				x : view.nextShort(),
				y : view.nextShort(),
				layer : view.nextShort(),
				trigScr : view.nextShort(),
				autoScr : view.nextShort(),
				state : view.nextShort(),
				trigMode : view.nextShort(),
				roleId : view.nextShort(),
				frame: view.nextShort(),
				dir : view.nextShort(),
				unknown1 : view.nextShort(),
				unknown2 : view.nextShort(),
				modsRef : view.nextShort(),
				unknown3 : view.nextShort(),
				unknown4 : view.nextShort()
			};
			if (i < 2) {
				console.log('event : ' + i + ' ' + toHex(obj.x) + ' ' + toHex(obj.y));
			}
			eventObjects[i+1] = obj;
		}
	}


	var scripts = [];
	function initScript() {
		var sssId = 4;
		var data = loadSss(sssId);
		var view = data.toDataView();

		var num = data.length / 8;	//每个32字节
		for(var i = 0; i < num; i++) {
			var script = {
				id   : i,
				code : view.nextShort(),
				param1 : view.nextShort(),
				param2 : view.nextShort(),
				param3 : view.nextShort()
			};
			if (i < 2) {
				console.log('script: ' + i + ' => ' + toHex(script.code) + ' ' + toHex(script.param1) + ' ' + toHex(script.param2) + ' ' + toHex(script.param3));
			}
			scripts.push(script);
		}
	}


	var scenes = [];
	function initScene() {
		var sssId = 1;
		var data = loadSss(sssId);

		scenes[0] = null;
		var num = data.length/8;
		for(var i = 0; i < num; i++) {
			scenes[i+1] = {
				sceneId : i+1,
				mapId : data.getShort(i * 8 + 0),
				enterScriptId : data.getShort(i * 8 + 2),
				exitScriptId : data.getShort(i * 8 + 4),
				startEventId : data.getShort(i * 8 + 6),
				endEventId : data.getShort(i * 8 + 8 + 6)
			}
		}
	}


	//物品总表
	var items = [];
	function initItem() {
		var sssId = 2;
		var data = loadSss(sssId);

		var num = data.length / 12;	//每个32字节
		for(var i = 0; i < num; i++) {
			var item = {
				id   : i,
				roleId : data.getShort(i * 12 + 0),
				gold : data.getShort(i * 12 + 2),
				useScr : data.getShort(i * 12 + 4),
				equScr : data.getShort(i * 12 + 6),
				dropScr : data.getShort(i * 12 + 8),
				flags : data.getShort(i * 12 + 10)
			};

			//console.log('[item] : ' + i + ' ' + hex(item.roleId) + ' ' + hex(item.gold) + ' ' + hex(item.flags));
			items.push(item);
		}

	}


	var words = [];
	function initDat() {
		var data = loadDat();

		var num = data.length / 10;	//每个32字节
		for(var i = 0; i < num; i++) {
			var d = data.slice(i * 10, i * 10 + 10);
			words.push(d);
		}
	}
