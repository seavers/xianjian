if (DEBUG) {

	document.getElementById('debug').style.display = 'block';

	setInterval(function() {

		var c = calcLength;

		var html = '<pre>';

		html += '[length]: objs:' + eventObjects.length + ' scripts:' + scripts.length + ' scenes:' + scenes.length + '<br/>';

		html += 'WIDTH:' + WIDTH + '  HEIGHT:' + HEIGHT + '<br/>';
		html += 'mx:' + mx + '  my:' + my + '  mhalf:' + mhalf + '<br/>'
		html += 'mapX:' + mapX + '  mapY:' + mapY + '<br/><br/>';

		html += 'sceneId:' + nextSceneId + '  mapId:' + mapId + ' se:' + startEventId + ' ee:' + endEventId + '<br/><br/>';

		html += 'update count: ' + updateCount[0] + ' - ' + updateCount[1] + ' - ' + updateCount[2] + '<br/><br/>';

		html += '[Npcs] length:' + c(Script.all) + '  index:' + Script.total + '<br/>';
		html += '[Anim] length:' + c(Timer.DEBUG.anims) + '  seq:' + Timer.DEBUG.animIndex + '<br/>';
		//html += '[Anim] globalDrawTime:' + globalDrawTime;

		html += '[Cache] file:' + c(file_caches) + '  rle:' + c(caches) + '<br/>';


	var counts = {};
	for(var key in caches) {
		var k = key.split('_')[0];
		var c = counts[k] || 0;
		counts[k] = c + 1;
	}

	for(var key in counts) {
		html += '  -- ' + key + ' : ' + counts[key] + '<br/>';
	}

		html += '<br/><br/>';

		html += '<input type="button" value="toggle debug" onclick="javascript:window.DEBUG=!window.DEBUG">' + ' DEBUG=' + window.DEBUG + '<br/>';
		html += '<input type="button" value="example" onclick="javascript:example()">' + ' example <br/>';

		html += '</pre>';

		document.getElementById('console').innerHTML = html;

		
	}, 1000 / 5);



	function calcLength(obj) {
		var x = 0;
		for(n in obj) {
			x++;
		}
		return x;
	}

	function example() {
		commonEnter();
		Npcs[0].stop();
	}
}