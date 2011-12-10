ESC.showItem = false;
ESC.onItem = function() {
	var startup = document.getElementById('startup').getContext('2d');

	//ownItems = [100,101,102,103,104,105,106,107];
	ownItems = ownItems || [99];		//[272]  ¾Æ½£ÏÉµÄ¹ð»¨¾Æ

	UI.Panel.createTable(ownItems).skin(10).size(18, 8).show(2, 32).onchange(function(value) {
		//alert(value);
		Script.startItemScript(items[value]);
		document.getElementById('startup').style.display = 'none';
	});
	
	document.getElementById('startup').style.display = 'block';




	/////////////////////////////////////////////////////////////////

/*
	//win98 version 
	//var pic = loadPic(71);			//22x20
	//startup.drawImage(pic, 2, 140);

	function show() {
		var xx = 0;
		var yy = 0;
		for(var k in ownItems) {
			var itemId = ownItems[k];
			var roleId = items[itemId].roleId;
			
			var img = loadBall(roleId);
			startup.drawImage(img, 10, 148);

			var dat = words[itemId];
			//showLine(dat, 70, 150);

			showLine(dat, xx * 100 + 16, yy * 20 + 10);

			xx++;
			if (xx % 3 == 0) {
				xx = 0;
				yy++;
			}
		}
	}

	show();	

	bind(function(ev) {
		switch(ev.keyCode) {
			case 27:			//ESC
			case 69:			//E

				document.getElementById('startup').style.display = 'none';
				unbind();
				break;

			//case 37:			//×ó
			//case 38:			//ÉÏ
			//case 39:			//ÓÒ
			//case 40:			//ÏÂ
			default:
				break;
		}
	});

*/

	

};