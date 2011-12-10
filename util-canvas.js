/*
 *   Canvas 的通用方法, 不拘泥于具体业务
 *
 */


 Canvas = {
	//利用字节数组, 生成canvas对象
	//每个字节, 为一个像素数据
	create : function(data, width, height) {
		//var start = new Date().getTime();

		var c = document.createElement('canvas');
		c.width = width;
		c.height = height;
		var ctx = c.getContext('2d');

		var image = ctx.createImageData(width, height);

		var pixels = image.data;
		for(var i = 0; i < width * height; i++) {
			pixels[i*4 + 2] = (data[i] & 0x000000FF) >> 0;				//red
			pixels[i*4 + 1] = (data[i] & 0x0000FF00) >> 8;				//blue
			pixels[i*4 + 0] = (data[i] & 0x00FF0000) >> 16;				//green
			pixels[i*4 + 3] = ((data[i] & 0xFF000000) >> 24) & 0xFF;		//alpha
			//pixels[i*4 + 3] = 0xFF;
		}

		ctx.putImageData(image, 0, 0);

		//var end = new Date().getTime();
		//console.log('drawCanvas ' + (end-start) + 'ms')

		return c;
	}
	
};