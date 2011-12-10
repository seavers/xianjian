var kk = 0;

var canvas = [];		//主体数据		320x200;

for(var i = 0; i < 320 * 200; i++) {
	//canvas[i] = 0x00;
}

ImageUtil = {

	drawImage : function(ctx, image, x, y) {
		x = Math.floor(x);
		y = Math.floor(y);

		ctx.drawImage(image, x, y);

	}

}
	

