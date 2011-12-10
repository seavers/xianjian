

	//显示单字符, 主要是某些文本符号
	function fillText(word, x, y) {
		
		canvas.fillStyle = '#ffffff';
		canvas.font = '16px';
		canvas.fillText(word, x, y);

	}

	
	
(function() {	

	Talk = {
		talkUp : showUp,
		talkDown : showDown,
		talkTips : showTips,			//有颜色的提示
		talkMessage : showMessage,		//有背景

		drawTalk : drawTalk,
		clearTalk : clearTalk,
		showTalkWait : showTalkWait
	}
	
	
	var talkContext = document.getElementById('talk').getContext('2d');
	
	
	var tx = 0;
	var ty = 0;
	var rgmId = 0;
	var rgm = null;
	var rgmX = 0;
	var rgmY = 0;
	var who = null;
	var tips = false;
	var message = false;
	var color = null;
	var clear = true;
	var line = 0;			//第0行


	//用于一大段话结束
	function resetTalk() {
		rgm = null;
		who = null;
		xx = 80;
		yy = 8;
		clear = true;
		color = null;
		tips = false;
		message = false;
	}

	//0x3c
	function showUp(pRgmId) {
		tx = 80;
		ty = 8;
		rgmId = pRgmId;
		rgmX = 8;
		rgmY = 8;

		rgm = rgmId && loadRgm(rgmId);
		clear = true;
	}

	function showDown(pRgmId) {
		tx = 5;
		ty = 110;
		rgmId = pRgmId;
		rgmX = 230;
		rgmY = 100;

		rgm = rgmId && loadRgm(rgmId);
		clear = true;
	}

	function showTips() {
		tips = true;
		tx = 55;
		ty = 25;
		color = null;
	}

	function showMessage() {
		message = true;
		tx = 160;
		ty = 50;
		color = null;
	}


	function drawTalk(msgId) {
		if (message) {
			message = false;
			drawMessage(msgId);
			return;
		} else if (tips) {
			tips = false;
			drawTips(msgId);
			return;
		}
		var t = Thread.currentThread;
		t.wait();
		drawTalk0(msgId, function() {
			checkTalk(function() {
				t.notify();
			});
		});

		
	}

	function drawTalk0(msgId, callback) {
		//显示对话, Top,  msgId对话
		var text = loadMsg(msgId);
		if (Lang.endWiths(text, ':')) {
			who = text;
			callback();
			return ;
		}

		var x = tx;
		var y = ty;

		//console.log('msg ' + msgId);


		if (clear) {
			rgm && talkContext.drawImage(rgm, rgmX, rgmY);
			who && showLine(who, x, y);
			clear = false;
			line = 0;
		}

		line++;
		drawLine(text, x + 16, y + line * 16, callback);

	}


	function drawWord(charCode, x, y, color) {
		var img = color ? loadWord(charCode, color) : loadWord(charCode);
		img && talkContext.drawImage(img, x, y);
	}


	function drawLine(text, x, y, callback) {
		texts = calcText(text);
		var i = 0;
		var timer = setInterval(function() {
			var charCode = texts[i].charCode;
			drawWord(charCode, x + i * 16, y, texts[i].color);
			i++;

			if (i >= texts.length) {
				clearInterval(timer);

				callback && callback();
			}
		}, 15);
	}


//' '：单引号对中的内容以红色显示   1A
//- -: 减号对中的内容以青色文本显示 8D
//" "：双引号对中的内容以黄色显示   2D
//(：表情，汗滴
//)：表情，爱心
//~n：对话自动中断，不须按空格。n为文字显示完毕后，等待的时间
//$n：文字显示速度，n越大，显示越慢（影响之后的所有文字显示，直至遇另一个$n或重新游戏而改变）
	function calcText(text) {
		var r = [];
		for (var i = 0; i < text.length ; i++) {
			var b = text.getByte(i);

			if (b == 34) {			//"
				color = color == 0xFCDC84 ? null : 0xFCDC84;
			} else if (b == 45) {		//-
				color = color == 0xFFFF00 ? null : 0xFFFF00;
			} else if (b == 39) {		//'
					color = color == 0x0000FF ? null : 0x0000FF;
			} else {
				r.push({
					charCode : text.getShort(i++),
					color : color
				});
			}
		}

		return r;
	}

	function showLine(text, x, y, callback) {
		texts = calcText(text);
		for(var i = 0; i < texts.length; i++) {
			drawWord(texts[i].charCode, x + i * 16, y, texts[i].color);
		}
	}

	//0x8E,  一般只有超3行才需要换屏, 但有时需要提前换屏, 因此有了这个命令
	function clearTalk() {
		updateTalk();				
	}

	//空格不一定会清除对话, 如上下对话, 同时出现
	function updateTalk() {
		talkContext.clearRect(0, 0, talkContext.canvas.width, talkContext.canvas.height);
		clear = true;
	}

	function showTalkWait() {
		var msg = '>';						//显示继续符号
		fillText(msg, 70, 100);
	}


	//检查用户是否已经确认了对话
	//1. 如果已超过3条, 必须确认,   (这里的逻辑需要确认, 是不是要放在isNextTalk里)
	//2. 如果下一句, 是FFFF对话指令, 则继续
	//3. 如果下一句, 是0x3C, 0x3D, 即上部显示, 下部显示, 则空格后, 继续, 但不清空对话
	//4. 其它的指令, 必须确认, 必清空
	//5. 另外, 如果不是超过3条, 想清空的, 使用0x8E命令,  如1F75, 敲锅后, 李大娘说: 少跟老娘鬼扯谈, 之后的0x8E
	function checkTalk(callback) {
		if (line > 3) {
			registerBlank(function() {
				updateTalk();
				callback();	
			});
		} else if (Thread.currentThread.isNextTalk()) {
			callback();
		} else if (Thread.currentThread.isNextTalks()) {		//别忘了0x8E00
			registerBlank(function() {
				callback();	
			});
		} else {
			registerBlank(function() {
				resetTalk();
				updateTalk();
				callback();	
			});
		}
	}


	function drawMessage(msgId) {
		var text = loadMsg(msgId);
		var texts = calcText(text);

		var length = texts.length;

		var x = tx - length * 16/2;
		var y = ty;

		drawBack(length, x, y);
		drawLineSync(texts, x, y);
	}
	
	function drawBack(length, x, y) {
		var picLeft = loadPic(45);
		talkContext.drawImage(picLeft, x - 8, y);

		var picMiddle = loadPic(46);

		for(var i = 0; i < length; i++) {
			talkContext.drawImage(picMiddle, x + i * 16, y);
		}

		var picRight = loadPic(47);
		talkContext.drawImage(picRight, x + i * 16, y);
	}

	function drawLineSync(texts, x, y) {
		for(var i = 0; i < texts.length; i++) {
			drawWord(texts[i].charCode, x + i * 16, y + 9, texts[i].color);
		}

		var t = Thread.currentThread;
		t.wait();
		registerBlank(function() {
			resetTalk();
			updateTalk();
			t.notify();
		});

	}

	function drawTips(msgId) {
		var text = loadMsg(msgId);
		var texts = calcText(text);

		var x = tx - length * 16/2;
		var y = ty;

		drawLineSync(texts, x, y);
		
	}

})();



//进行下一指令前, 检查是否有对话
//不在指令执行后检查, 是因为, 对话是异步的, 刷写完对话后, 才




