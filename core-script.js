
	Script = {};

	Script.Moment = 0;		//等待0秒, 即延迟一下
	Script.Wait = -1;
	Script.Finish = -2;



	Script.all = [];
	Script.total = 0;
	
	//这里启动的是场景, 不是自动或者触发脚本
	Script.startScene = function(scene) {

		Script.all = [];

		Script.start(scene.enterScriptId, scene, 'scene');

		//载入event object
		for(var i = startEventId+1; i <= endEventId; i++) {
			var o = eventObjects[i];

			if (!o || o.state == 0 || o.roleId == 0) {
				continue;
			}

			if (o.autoScr) {
				Script.start(o.autoScr, o, 'auto');
			}
		}
	}

	Script.startAutoScript = function(obj) {
		Script.start(obj.autoScr, obj, 'auto');
	}
	Script.startTrigScript = function(obj) {
		Script.start(obj.trigScr, obj, 'trig');
	}
	Script.startItemScript = function(obj) {
		Script.start(obj.useScr, obj, 'item');
	}

	//启动脚本, 因脚本需并行执行, 所以, 需存在多实例的情况
	Script.start = function(scriptId, obj, type) {

		if (type != 'auto') {
			Timer.stop();
		}


		var script = new Thread(scriptId, obj, type);

		script.index = Script.total;
		Script.all[Script.total++] = script;

		script.start();
	}

	//实现在thread.js中了, 用于break循环
	Script.finish = function() {
		var thread = Thread.currentThread;
		thread.stop();
	}

	Script.stop = function(scriptId) {
		var thread = Thread.currentThread;
		scriptId = scriptId || thread.scriptId;

		if (thread.type == 'auto') {
			thread.obj.autoScr = scriptId;
		} else if (thread.type == 'scene') {
			thread.obj.enterScriptId = scriptId;
		} else if (thread.type == 'trig') {
			thread.obj.trigScr = scriptId;
		}

		//更新脚本状态时, 检查是否, 可执行自动脚本
		if (thread.type == 'auto' && thread.obj.state == 2) {
			//thread.scriptId = thread.obj.autoScr;		//重置, 这样写, 会死循环
		}
		thread.stop();

		if (thread.type != 'auto') {
			Timer.start();
		}
	}

	Script.next = function(scriptId) {
		var thread = Thread.currentThread;
		thread.scriptId = scriptId;
	}


	Script.sub = function(scriptId) {
		var thread = Thread.currentThread;
		thread.wait();
		var sub = new Thread(scriptId, thread.obj, thread.type, function() {
			thread.notify();
		});
		sub.parent = thread;
		sub.start();
	}


	Script.isExec = function() {
		//return Thread.currentThread && !Script.isAuto(Thread.currentThread);
		for(k in Script.all) {
			var script = Script.all[k];
			if (!script.finish && script.type != 'auto') {
				return true;
			}
		}
		return false;
	}

	Script.isAuto = function(thread) {
		return thread.type == 'auto';
	}





	//等待几秒
	Script.sleep = function(time) {
		//增加等待动画
		//updateScript(script);

		var thread = Thread.currentThread;
		var force = thread.type != 'auto';		//非自动脚本为force, 否则进入队列

		thread.wait();
		Timer.queue(time, undefined, function() {
			thread.notify();	
		}, force);
		
	}

	Script.draw = function(total, func) {
		var thread = Thread.currentThread;
		var force = thread.type != 'auto'

		thread.wait();
		Timer.queue(total, func, function() {
			thread.notify();	
		}, force);

	}




