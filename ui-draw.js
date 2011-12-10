(function() {
	UI = {
		drawLabel : drawLabel,
		drawArea : drawArea,
		drawNum : drawNum,
		drawWord : drawWord,
		drawPics : drawPics
	}

	var startup = document.getElementById('startup').getContext('2d');

	function drawLabel(x, y, size) {
		drawPic3(45, x, y, size);
	}

	function drawNum(num, x, y) {
		while(true) {
			x -= 6;
			var n = num % 10;
			drawPic(20+n, x, y);

			num -= n;
			num /= 10;
			if (num == 0) {
				break;
			}
		}
	}

	function drawArea(x, y, width, height, style) {
		style = style || 1;

		width--; height--;		//减1的意思是: width, height是指交叉的地方, 交叉的地方用来输出汉字

		y += drawPic3(style + 0, x, y, width);
		for(var i = 0; i < height; i++) {
			y += drawPic3(style + 3, x, y, width);
		}
		y += drawPic3(style + 6, x, y, width);
	}

	function drawWord(wordId, x, y, color) {
		var word = words[wordId];
		for(var i = 0; i < word.length/2; i++) {
			var charCode = word.getShort(i * 2);
			if (charCode == 0x2020) {		//空格
				continue;
			}
			var img = loadWord(charCode, color);
			img && startup.drawImage(img, x + i * 16, y);
		}
	}

	function drawPics(data, x, y) {
		var rows = data.length;
		var cols = data[0].length;

		var pic = null;
		var dy = 0;
		for(var j = 0; j < rows; j++) {
			var dx = 0;
			for (var i = 0; i < cols; i++) {
				var d = data[j][i];
				pic = loadPic(d);
				startup.drawImage(pic, x+dx, y+dy);
				dx += pic.width;
			}
			dy += pic.height;
		}
	}


	function drawPic(picId, x, y) {
		var pic = loadPic(picId);
		startup.drawImage(pic, x, y);
	}

	function drawPic3(picId, x, y, n) {
		var pic, dx = 0;

		pic = loadPic(picId);
		startup.drawImage(pic, x, y);
		dx += pic.width;

		for(var i = 0; i < n; i++) {
			pic = loadPic(picId + 1);
			startup.drawImage(pic, x + dx, y);
			dx += pic.width;
		}

		pic = loadPic(picId + 2);
		startup.drawImage(pic, x + dx, y);

		return pic.height;
	}

})();