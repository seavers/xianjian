	var callbackTimer = 0, callbackEfficiency = 0;


	var performance = new Performance();

	// -----------------------------------------------------------------------------------------------------
	function render(callback) 
	{
		// FPS count
		performance.BeginDrawLoop();
	 
		// Callback efficiency; number of frames I have available to do other work
		performance.callbackEfficiency = Math.min(callbackEfficiency, 10);
		performance.callbackInstances++;
		if (callbackTimer != 0) 
		{
			if (window.clearImmediate) window.clearImmediate(callbackTimer);
			else if (window.msClearImmediate) window.msClearImmediate(callbackTimer);
			else if (window.mozClearImmediate) window.mozClearImmediate(callbackTimer);
			else if (window.webkitClearImmediate) window.webKitClearImmediate(callbackTimer);
			else if (window.oClearImmediate) window.oClearImmediate(callbackTimer);
			else window.clearTimeout(callbackTimer);
	 
			// Reset value;
			callbackTimer = 0;
			callbackEfficiency = 0;
		}
	 
		// Drawing functions
		drawCanvasLoop();
		 
		// Use requestAnimationFrame to schedule animations 
		if (window.requestAnimationFrame) window.requestAnimationFrame(render);           
		else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(render);  
		else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(render);
		else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(render);
		else if (window.oRequestAnimationFrame) window.oRequestAnimationFrame(render);
		else setTimeout(render, 16);
	 
		// Determine if there is enough CPU available for 10 callbacks
		if (window.setImmediate) callbackTimer = window.setImmediate(countCallbacks);
		else if (window.msSetImmediate) callbackTimer = window.msSetImmediate(countCallbacks);
		else if (window.mozSetImmediate) callbackTimer = window.mozSetImmediate(countCallbacks);
		else if (window.webkitSetImmediate) callbackTimer = window.webkitSetImmediate(countCallbacks);
		else if (window.oSetImmediate) callbackTimer = window.oSetImmediate(countCallbacks);
		else callbackTimer = window.setTimeout(countCallbacks);
		 
		// Finish drawing score dashboard
		performance.DrawDashboard();
		performance.FinishDrawLoop();
	 
	}

 
	// -----------------------------------------------------------------------------------------------------
	function countCallbacks() {
		callbackEfficiency++;
	 
		// Setup next set of callbacks
		if (window.setImmediate) callbackTimer = window.setImmediate(countCallbacks);
		else if (window.msSetImmediate) callbackTimer = window.msSetImmediate(countCallbacks);
		else if (window.mozSetImmediate) callbackTimer = window.mozSetImmediate(countCallbacks);
		else if (window.webkitSetImmediate) callbackTimer = window.webkitSetImmediate(countCallbacks);
		else if (window.oSetImmediate) callbackTimer = window.oSetImmediate(countCallbacks);
		else callbackTimer = window.setTimeout(countCallbacks);
	}
