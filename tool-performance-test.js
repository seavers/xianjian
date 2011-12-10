
	var globalDrawCount = 0;
	var globalDrawTime = 0;
	
	function drawCanvasLoop() {
		var start = new Date().getTime();
		drawCanvas();
		var end = new Date().getTime();
		globalDrawTime = (globalDrawCount++) + '.' + (end - start);
	}

	//render(drawCanvasLoop);
