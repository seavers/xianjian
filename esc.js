ESC = {

	onESC : function() {
		var startup = document.getElementById('startup').getContext('2d');
		var fbp = loadFbp(0);
		startup.drawImage(fbp, 0, 0);
		document.getElementById('startup').style.display = 'block';

		

	},

	ShowStatus : false,

	onStatus : function() {
		if (ESC.ShowStatus) {
			document.getElementById('startup').style.display = 'none';
		} else {
			var startup = document.getElementById('startup').getContext('2d');
			var fbp = loadFbp(0);
			startup.drawImage(fbp, 0, 0);
			document.getElementById('startup').style.display = 'block';
		}
		ESC.ShowStatus = !ESC.ShowStatus;
	},

	showRole : false,
	onRole : function() {
		if (ESC.showRole) {
			document.getElementById('startup').style.display = 'none';
		} else {
			var startup = document.getElementById('startup').getContext('2d');

			var picRight = loadPic(47);
			talkContext.drawImage(picRight, x + i * 16, y);

		}
		ESC.showRole = !ESC.showRole;
	},


}


