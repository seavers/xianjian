		

	talkUp = Talk.talkUp;
	talkDown = Talk.talkDown;
	talkTips = Talk.talkTips;
	talkMessage = Talk.talkMessage;		//alert
	clearTalk = Talk.clearTalk;



	var scriptCodes = [];
	scriptCodes[0x00] =	{func:finishCode, desc:'停止指令'};
	scriptCodes[0x01] =	{func:stopCode, desc:'停止指令, 并将调用地址,改为下一条指令'};
	scriptCodes[0x02] =	{func:changeScript, desc:'中断, 改写指令'};
	scriptCodes[0x03] =	{func:gotoScript, desc:'call gotoScript'};
	scriptCodes[0x04] =	{func:subScript, desc:'call subScript'};
	scriptCodes[0x05] =	{func:updateScreen, desc:'屏幕重绘'};
	scriptCodes[0x06] =	{func:randomScript, desc:'几率继续, 随机继续'};

	scriptCodes[0x0B] =	{func:setSouthDir, desc:'本对象面向南边'};
	scriptCodes[0x0C] =	{func:setWestDir, desc:'本对象面向西边'};
	scriptCodes[0x0D] =	{func:setNorthDir, desc:'本对象面向北边'};
	scriptCodes[0x0E] =	{func:setEastDir, desc:'本对象面向东边'};
	scriptCodes[0x0F] =	{func:setNpcDir, desc:'设置Npc方向'};

	scriptCodes[0x43] =	{func:setMusic, desc:'播放音乐'};
	scriptCodes[0x45] =	{func:setFightMusic, desc:'设置战斗音乐'};
	scriptCodes[0x47] =	{func:null, desc:'设置音效'};
	scriptCodes[0x46] =	{func:setRolePos, desc:'设置队员块位置'};
	scriptCodes[0x65] =	{func:setRoleTile, desc:'设置队员形象'};
	scriptCodes[0x15] =	{func:setRoleIndex, desc:'设置队员方向/帧'};
	scriptCodes[0x75] =	{func:setRoleGroup, desc:'设置组队'};
	scriptCodes[0x3B] =	{func:talkTips, desc:'显示tips'};
	scriptCodes[0x3C] =	{func:talkUp, desc:'上部显示'};
	scriptCodes[0x3D] =	{func:talkDown, desc:'下部显示'};
	scriptCodes[0x3E] =	{func:talkMessage, desc:'显示信息'};
	scriptCodes[0x09] =	{func:updateScreenAndWait, desc:'屏幕重绘并等待'};
	scriptCodes[0x16] =	{func:setNpcTile, desc:'设置Npc形象'};
	scriptCodes[0x8E] =	{func:clearTalk, desc:'清空对话'};
	scriptCodes[0x49] =	{func:setObjectStatus, desc:'设置对象状态'};
	scriptCodes[0x70] =	{func:roleWalk, desc:'移动主角位置'};
	scriptCodes[0x73] =	{func:clearWithEffect, desc:'动画清除'};

	scriptCodes[0x6C] =	{func:npcWalk, desc:'Npc移动距离'};
	scriptCodes[0x10] =	{func:npcWalk2, desc:'Npc移动至指定位置x10'};
	scriptCodes[0x11] =	{func:npcWalk3, desc:'Npc移动至指定位置x11'};

	scriptCodes[0x59] =	{func:setScene, desc:'修改场景id'};
	scriptCodes[0x50] =	{func:toggleScene, desc:'切换场景'};
	scriptCodes[0x40] =	{func:setTrigMode, desc:'设置对象触发方式'};
	scriptCodes[0x85] =	{func:waitSecond, desc:'waitSecond'};

	scriptCodes[0x24] =	{func:setNpcAutoScr, desc:'设置对象自动脚本  (开始子脚本) '};
	scriptCodes[0x25] =	{func:setNpcTrigScr, desc:'设置对象触发脚本'};

	scriptCodes[0x1E] =	{func:setMoney, desc:'金钱改变指令'};
	scriptCodes[0x1F] =	{func:obtain, desc:'获得物品'};

	scriptCodes[0x6E] =	{func:walkHeroByOffset, desc:'主角移动指定距离'};
	scriptCodes[0x14] =	{func:setNpcFrame, desc:'改变形状指令'};
	scriptCodes[0x87] =	{func:walkAtPlace, desc:'在当前地方, 来回走动'};
	scriptCodes[0x6F] =	{func:replaceObject, desc:'replaceObject'};

	scriptCodes[0xFFFF] =	{func:talk, desc:'显示对话'};




	var mx, my, mhalf;//, mapX, mapY;


	///角色相关
	var roles = [{
		type   : 'role',
		x : 0,
		y : 0,
		layer : 0,
		tileId : 0,
		frame : 0,
		index : 0,
		count : 0
	}];


	var ownItems = [];


	function setRolePos(sx, sy, shalf) {
		mx = sx;
		my = sy;
		mhalf = shalf;

		calcMap();
	}

	//0x65 = 101 设置队员形象
	function setRoleTile(roleId, tileId, bool) {
		roles[roleId].tileId = tileId;
	}

	//0x15 = 21  设置队员方向/帧
	function setRoleIndex(dir, frame, roleId) {
		roles[roleId].dir = dir;
		roles[roleId].frame = frame;
		roles[roleId].count = -1;

		if (dir) {
			refreshRoleCount(roles[roleId]);
		}
	}

	function calcMap() {
		mapX = mx * 32 + mhalf * 16;		//mhalf, 则加一半
		mapY = my * 16 + mhalf * 8;

		roles[0].x = mapX;
		roles[0].y = mapY;

		update(true);
	}

	//走时时, 可在1.2之间切换
	function refreshRoleCount(role) {
		role.count = role.count === undefined ? -1 : role.count;			//默认为 -1

		var count = role.count++;

		var frame = count == -1 ? 0 : (count % 2 + 1);
		switch (role.dir) {
			case 0 :			//down:
				frame += 0;
				break;
			case 1 :			//left :
				frame += 3;
				break;
			case 2 :			//up :
				frame += 6;
				break;
			case 3 :			//right :
				frame += 9;
				break;
		}

		role.frame = frame;

	}

	//0x75
	function setRoleGroup() {

	}

	//0x70 移动主角位置, 要地图更新的
	function roleWalk(sx, sy, shalf, context) {
		var current = this;

		mx = sx;
		my = sy;
		mhalf = shalf;

		Npc.anim(roles[0], sx, sy, shalf, 4);
	}

	//0x73 动画清除
	function clearWithEffect() {

	}

	function walkHeroByOffset(dx, dy) {
		if (dx <= 65536/2) {
			mapX += dx;
		} else {
			mapX -= 65536 - dx;
		}
		if (dy <= 65536/2) {
			mapY += dy;
		} else {
			mapY -= 65536 - dy;
		}

		roles[0].x = mapX;
		roles[0].y = mapY;

		mx = Math.floor(mapX/32);
		my = Math.floor(mapY/16);
		mhalf = Math.round((mapX - mx * 32) / 16)

		refreshRoleCount(roles[0]);
		update(true);		//update back
	}

	//0x16 修改NPC状态
	function setNpcTile(objId, dir, frame) {		//roleId, 似乎没有
		//roleId && eventObjects[objId].roleId = roleId;
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.dir = dir;
		obj.frame = frame;
		obj.count = -1;		//重置count
		if (dir) {
			refreshRoleCount(obj);
		}
	}

	//0x49 设置对象状态
	function setObjectStatus(objId, state) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.state = state;
		if (state == 2) {			//自动触发脚本
			Script.startAutoScript(obj);
		}
	}

	function startEventTrig(obj) {
		Script.startTrigScript(obj);
	}

	//0x40
	function setTrigMode(objId, trigMode) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		obj.trigMode = trigMode;
	}

	//0x6c Npc移动, 静态物品, 不可修改frame
	function npcWalk(objId, dx, dy) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];

		var x = obj.x;
		var y = obj.y;

		if (dx <= 65536/2) {
			x += dx;
		} else {
			x -= 65536 - dx;
		}
		if (dy <= 65536/2) {
			y += dy;
		} else {
			y -= 65536 - dy;
		}

		//Npc.anim2(obj, x, y, 1);
		obj.x = x;
		obj.y = y;
	}

	//0x0E   only this
	function setEastDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
	}
	//0x0C   only this
	function setWestDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}
	//0x0D   only this
	function setNorthDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}
	//0x0B  only this
	function setSouthDir(objId) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];
		Script.sleep(2);
		
	}

	//0x0F
	function setNpcDir(dir) {
		if (loadMgoCount(this.roleId) < 12) {
			this.frame = dir;
		} else {
			this.dir = dir;
			refreshRoleCount(this);
		}
	}

	//0x10 当前对象移动
	function npcWalk2(x, y, half, context) {
		Npc.anim(this, x, y, half, 6);	//(this.id==0x0b?6:3));
	}

	//0x11 等待npc移动
	function npcWalk3(x, y, half) {
		Npc.anim(this, x, y, half, 2);
	}

	//0x87
	function walkAtPlace() {
		loadFrameCount(this);

		this.frame = Math.floor(Math.random() * this.frameCount);

		//var context = arguments[3];
		//context.stop();		//todo:
	}

	function loadFrameCount(obj) {
		if (!obj.frameCount) {
			obj.frameCount = loadMgoCount(obj.roleId);
		}
	}

	//0x6F
	function replaceObject() {
		//var context = arguments[3];
		//context.stop();		//todo:

		//TODO:
		Thread.currentThread.stop();
	}

	//0x24
	function setNpcAutoScr(objId, autoScr) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];			//0x13d6 有FFFF
		obj.autoScr = autoScr;
		Script.startAutoScript(obj);
	}

	//0x25 设置对象触发脚本
	function setNpcTrigScr(objId, trigScr) {
		var obj = objId == 0xFFFF ? this : eventObjects[objId];			//0x12C0

		obj.trigScr = trigScr;

		//alert('setNpcTrigScr 这里直接触发了, 不合适再看');
		//Script.startTrigScript(obj);		//不能直接触发
	}

	//0x14 改变当前事件的图像
	function setNpcFrame(frame) {
		this.frame = frame;

		return Script.Moment;
	}

	//0x43 播放音乐
	function setMusic() {

	}

	//0x45
	function setFightMusic() {

	}

	//0x59
	function setScene(sceneId) {
		nextSceneId = sceneId;
	}

	//0x50
	function toggleScene() {
		var scene = scenes[nextSceneId];
		mapId = scene.mapId;
		nextScriptId = scene.enterScriptId;
		startEventId = scene.startEventId;
		endEventId = scene.endEventId;

		console.log('切换场景 : ' + nextSceneId + ' ' + mapId + ' ' + nextScriptId + ' ' + startEventId + ' ' + endEventId);

		anims = {};			//清空动画
		drawMapAll();
		update(true);		//目前来看, 只有第一屏是不需要刷新的, 因为那时什么数据还没有呢,

		//如果是脚本触发, 则需要异步, 否则有重入问题
		setTimeout(function() {
			Script.startScene(scene);
		});
	}

	function finishCode() {
		Script.finish();
	}

	//0x01		//停止指令, 将调用地址, 改为下一条命令
	function stopCode() {
		Script.stop();		//todo:
	}

	//0x02
	var c = 0;
	function changeScript(scriptId, count) {
		//Script.stop(scriptId);		//todo:
		if (c++ <= count) {
			Script.next(scriptId);
		}
	}

	//0x03 无条件跳转
	function gotoScript(scriptId) {
		Script.next(scriptId);		//todo:
	}

	//0x04 执行子脚本, 之后, 需返回
	function subScript(scriptId) {
		Script.sub(scriptId);		//todo:
		//this.scriptId = scriptId;
	}

	//0x06  随机继续
	function randomScript() {
		//...
	}



	//0xFFFF 显示对话
	function talk(msgId, y, z) {
		Talk.drawTalk(msgId);
	}
	
	//0x05	重绘屏幕
	//最后一个参数, 为是否执行当前物品的脚本, 如桂花酒, 0x9AEC
	function updateScreen(arg1, arg2, isExecItemScr) {
		update();
	}

	//0x09 重绘并等待, 100毫秒
	function updateScreenAndWait(time, y, z) {
		//update();

		Script.sleep(time);
	}

	//0x85	wait
	function waitSecond(time, y, z, context) {
		//update();

		Script.sleep(time);
	}



	function checkTalk() {
		alert('global checkTalk');
	}




	////////////////////////////////////////////////

	//0x1E 得到金钱
	function setMoney(add, other) {		//add 增加的金币, other, 不够的地址
		
	}

	//0x1F 获得物品
	function obtain(ballId) {
		ownItems.push(ballId);

	}











	//******  脚本引擎  ******/
	function executeExample() {

		//脚本
		//setMusic(31, 0, 0);				//1. 
		//setFightMusic(37, 0, 0);			//2.
		setRolePos(0x29, 0x12, 0);			//3.	46.	设置pos: 41, 18
		setRoleTile(0, 0x2, 0);			//4.	65. 设置形象00, C1
		setRoleIndex(0, 0, 0);				//5.	15. 设置方向0
		setRoleGroup(1);					//6.	75  分组
		//updateScreen();						//7.	05. 屏幕重绘
		//talk(31);							//8		31号对话



		//setInterval(update, 1000);
	}



