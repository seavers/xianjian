/*
 *  ¹«¿ª:  toHex,  toHex2  toHex4
 *
 */

Hex = (function() {
	
	var code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

	function toHex(dec) {
		var h = (dec & 0xF0) >> 4;
		var l = (dec & 0x0F) >> 0;
		return code[h] + code[l];
	}

	function toHex2(dec) {
		var b0 = (dec & 0x0000000F) >> 0;
		var b1 = (dec & 0x000000F0) >> 4;
		var b2 = (dec & 0x00000F00) >> 8;
		var b3 = (dec & 0x0000F000) >> 12;
		return code[b3] + code[b2] + code[b1] + code[b0];
	}

	function toHex4(dec) {
		var b0 = (dec & 0x0000000F) >> 0;
		var b1 = (dec & 0x000000F0) >> 4;
		var b2 = (dec & 0x00000F00) >> 8;
		var b3 = (dec & 0x0000F000) >> 12;
		var b4 = (dec & 0x000F0000) >> 16;
		var b5 = (dec & 0x00F00000) >> 20;
		var b6 = (dec & 0x0F000000) >> 24;
		var b7 = (dec & 0xF0000000) >> 28;
		return code[b7] + code[b6] + code[b5] + code[b4] + code[b3] + code[b2] + code[b1] + code[b0];
	}

	return {
		toHex : toHex,
		toHex2 : toHex2,
		toHex4 : toHex4
	}
})();


