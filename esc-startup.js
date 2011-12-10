ESC.showItem = false;
ESC.onStartup = function() {
	var startup = document.getElementById('startup').getContext('2d');

	var fbpId = 0x3C;
	var fbp = loadFbp(fbpId);
	startup.drawImage(fbp, 0, 0);
	UI.Panel.create([7,8]).canClose(false).show(124, 96).onchange(function(value) {
		//alert(value);
		startNewStory();

		unbind();
	});
	
	document.getElementById('startup').style.display = 'block';


/*
	bind(function(ev) {
		//ev.preventDefault();
		switch(ev.keyCode) {
			case 32: 
				newStory();
				
				var el = document.getElementById('startup');
				el.style.display = 'none';
				animHide(el);

				document.removeEventListener('keydown', arguments.callee);

				unbind();

				break;
		}
	});
*/

	document.addEventListener('touchend', function(ev) {
		ev.preventDefault();
		newStory();
		
		var el = document.getElementById('startup');
		el.style.display = 'none';
		animHide(el);

		document.removeEventListener('touchend', arguments.callee);
	});

}

function startNewStory() {
	var el = document.getElementById('startup');
	el.style.display = 'none';
	//animHide(el, newStory);

	animHide(el);
	newStory();
}

function animHide(el, callback) {
	el.style.cssText = '-webkit-transition:all 1.5s linear';
	el.style.opacity = 1;
	el.style.opacity = 0;
	setTimeout(function() {
		el.style.display = 'none';
		el.style.opacity = 1;
		//el.parentNode.removeChild(el);
		
		callback && callback();
	}, 2000);
}

function newStory() {
	nextSceneId = 1;
	toggleScene();

}