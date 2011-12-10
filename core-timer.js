/** Timer **/

(function(){

	var Timer = {
		queue : queue, 
		start : start,
		stop : stop
	}
	Timer.__defineGetter__('DEBUG', function() {
		return {
			anims : anims,
			animIndex : animIndex
		}
	});


	var frameCount = 6;		//调整游戏速度
	var anims = [];				//animCallback
	var animIndex = 0;		//纯计数

	//如果是 npc, 只能在主线程等待时执行
	function setTimer(func) {
		var index = animIndex++;
		anims[index] = func;
		return index;
	}

	function clearTimer(index) {
		delete anims[index];
	}

	//进入队列, 并且执行多少次
	function queue(total, func, callback, force) {
		var timer = setTimer(function(c) {
			func && func(c);
			if (c >= total && total != -1) {
				clearTimer(timer);
				if (force) {
					Timer.stop();
				}
				callback && callback();

			}
		});

		if (force) {
			Timer.start();
		}
	}

	var pause = true;

	//start Draw
	function draw() {
		setInterval(function() {

			if (pause) {
				return ;
			}
			
			var start = new Date().getTime();
			drawLoop();
			var end = new Date().getTime();
			//console.log('timer ' + (end-start) + 'ms');

		}, 1000 / frameCount);
	}


	var drawCount = 0;

	function drawLoop() {

		//console.log('[drawLoop] ' + (drawCount++))

		var c = 0;
		for(var key in anims) {
			var func = anims[key];
			var index = func.index || 0;
			func(index+1);
			func.index = index + 1;

			c++;
		}
		c && update();
	}

	function start() {
		update();		//update一次, 主要用于场景中触发脚本执行完后, 没有timer脚本
		pause = false;
	}

	function stop() {
		pause = true;
	}

	window.Timer = Timer;

	draw();
})();