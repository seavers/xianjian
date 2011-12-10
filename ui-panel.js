(function() {

	UI.Panel = {

		//纯文字
		create : function(arr) {
			return new Panel(arr, 0);
		},

		//List UI
		createList : function(arr) {
			return new Panel(arr, 1);
		},

		//Table UI
		createTable : function(arr) {
			return new Panel(arr, 10);
		}

	}


	function Panel(arr, style) {
		this.arr = arr;
		this.style = style;			//如使用的是 10 号 style, 则左上角pic的picId = 10
		this.value = 0;
		this.closable = true;
	}

	Panel.prototype.skin = function(style) {
		this.style = style;
		return this;
	}

	Panel.prototype.canClose = function(bool) {
		this.closable = bool;
		return this;
	}

	Panel.prototype.size = function(width, height) {
		this.width = width;
		this.height = height;
		return this;
	}

	Panel.prototype.show = function(x, y) {
		this.x = x;
		this.y = y;
		this.draw();
		this.listen();
		return this;
	}

	Panel.prototype.draw = function() {
		this.width = this.width || 2;
		this.height = this.height || this.arr.length;

		var x = this.x;
		var y = this.y;
		var height = this.height || this.arr.length;
		var width = this.width || 2;
		var style = this.style;
		var arr = this.arr;
		var xx = 0;
		var yy = 0;

		if (style) {
			UI.drawArea(x, y, width, height, style);
			x += 12;
			y += 12;
		}

		for(var i = 0; i < arr.length; i++) {
			var color = this.value == i ? 0xF4E46C : 0xD4D0C0;

			UI.drawWord(arr[i], x + xx * 100, y + yy * 18, color);		//48,66,84,102//状态

			if (style >= 10) {
				if (++xx >= 3) {
					yy++;
					xx = 0;
				}
			} else {
				yy++;
			}
		}
	}

	Panel.prototype.change = function(n) {
		this.draw();
	}

	Panel.prototype.choose = function(n) {
		this.fire();
	}

	Panel.prototype.listen = function() {

		var n = this.width < 10 ? 1 : 3;

		bind(function(ev) {

			switch(ev.keyCode) {
				case 27:			//ESC
				case 69:			//E

					document.getElementById('startup').style.display = 'none';
					unbind();
					break;

				case 13:			//回车
				case 32:			//空格
					this.choose();
					unbind();
					break;
				case 37:			//左
					this._calc(-1, false);
					this.change();
					break;
				case 38:			//上
					this._calc(-n, true);
					this.change();
					break;
				case 39:			//右
					this._calc(+1, false);
					this.change();
					break;
				case 40:			//下
					this._calc(+n, true);
					this.change();
					break;
				default:
					break;
			}
		}, this);
	}

	//bool 表示是否上下移动
	Panel.prototype._calc = function(add, bool) {
		var value = this.value;
		var total = this.arr.length;
		var n = this.width < 10 ? 1 : 3;

		//lsit 结构
		if (n == 1) {
			if (bool) {		//上下
				value = value + add;
				if (value < 0) {
					value = value + total;
				}
				value = value % total;
			}
		} else {
			if (!bool) {		//左右
				var mod = value % 3;
				if (mod + add >= 0 && mod + add < 3 && value + add < total) {
					value = value + add;
				}
			} else {		//上下
				if (value + add >= 0 && value + add < total) {
					value = value + add;
				}
			}
		}

		this.value = value;
	};

	Panel.prototype.onchange = function(callback) {
		this.listeners = this.listeners || [];
		this.listeners.push(callback);
	}

	//TODO:
	Panel.prototype.onclose = function(callback) {
		this.listeners = this.listeners || [];
		this.listeners.push(callback);
	}

	Panel.prototype.fire = function(callback) {
		this.listeners = this.listeners || [];
		for(var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			listener(this.arr[this.value]);
		}
	}

})();