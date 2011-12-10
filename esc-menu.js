ESC.showMenu = false;
ESC.onMenu = function() {
	var startup = document.getElementById('startup').getContext('2d');
	startup.clearRect(0, 0, startup.canvas.width, startup.canvas.height);

	UI.drawLabel(0, 0, 5);
	UI.drawWord(0x15, 10, 8, 0x000000);		//金钱
	
	UI.drawNum(500, 85, 15);

		//状态,仙术,物品,系统
	UI.Panel.createList([3,4,5,6]).show(2, 36).onchange(function(value) {
		switch(value) {
			case 3: 
				ESC.onStatus();
				break;
			case 4: 
				ESC.onMagic();
				break;
			case 5: 
				ESC.onItem();
				break;
			case 6: 
				ESC.onSystem();
				break;

		}		
	});



	document.getElementById('startup').style.display = 'block';



};