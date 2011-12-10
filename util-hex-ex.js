(function() {
	// debug สนำร
	function showFile(id, url) {
		load(url, function(data) {
			document.getElementById(id).innerHTML = hex(data);
		});
	}

	function showHex(id, data) {
		//alert(hex(data));
		document.getElementById(id).innerHTML = hex(data);
	}

	function hex(data) {
		var out = '';
                for(i=0;i< data.length;i++){
			if (i % 16 == 0) {
				out += '<br/>';
			}
			out += toHex(data[i]) + ' ';
		}		
		return out;		
	}

	function bin(data) {
		showHex('console', data);
	}
});