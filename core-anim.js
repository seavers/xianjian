(function() {

	Npc = {
		anim : anim,
		anim2 : anim2
	}

	function anim(o, x, y, half, speed) {
		//最后一个参数用于计算, 是否在等待时执行, 用于自动动画
		//非context.trig, 表示, 是context.autoScr
		//////////////////////////////////////////////////

		var cx = o.x;
		var cy = o.y;
		var zx = x * 32 + half * 16;		//half, 则加一半
		var zy = y * 16 + half * 8;

		var s = Math.max(Math.abs(zx - cx), Math.abs(zy - cy));		//距离

		var step = Math.ceil(s);		//几步
		var current = 0;
		var total = Math.ceil(step/speed);

		var timer = Script.draw(total, function() {
			calcNpcDir(o, zx, zy);

			current += speed;

			if (step != 0) {
				o.x = (zx - cx) * current / step + cx;
				o.y = (zy - cy) * current / step + cy;
			}

			//s = 32 , speed = 3 时的情况, 不整除的情况
			if (Math.abs(current) >= s) {					//当 s= 0时, 会有>的情况
				o.x = zx;
				o.y = zy;
			}

		});	

	}

	function anim2(o, x, y, speed) {
		//最后一个参数用于计算, 是否在等待时执行, 用于自动动画
		//非context.trig, 表示, 是context.autoScr
		//////////////////////////////////////////////////

		var cx = o.x;
		var cy = o.y;
		var zx = x;		//half, 则加一半
		var zy = y;

		var s = Math.max(Math.abs(zx - cx), Math.abs(zy - cy));		//距离

		var step = Math.ceil(s);		//几步
		var current = 0;
		var total = Math.ceil(step/speed);

		var timer = Script.draw(total, function() {
			calcNpcDir(o, zx, zy);

			current += speed;

			if (step != 0) {
				o.x = (zx - cx) * current / step + cx;
				o.y = (zy - cy) * current / step + cy;
			}

			//s = 32 , speed = 3 时的情况, 不整除的情况
			if (Math.abs(current) >= s) {					//当 s= 0时, 会有>的情况
				o.x = zx;
				o.y = zy;
			}

			o.x = Math.floor(o.x);
			o.y = Math.floor(o.y);

		});	

	}

	function calcNpcDir(o, x, y) {
		if (x > o.x && y > o.y) {
			o.dir = 3;
		} else if (x > o.x && y < o.y) {
			o.dir = 2;
		} else if (x < o.x && y > o.y) {
			o.dir = 0;
		} else if (x < o.x && y < o.y) {
			o.dir = 1;
		} else {
			//alert('calcNpcDir');		苗人首领出现过, 不明白
		}
		refreshRoleCount(o);
	}

})();


