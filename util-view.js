/*
 *  公开了 ByteArray,  ByteView
 *
 *  ByteArray , 目前用于resource.js中,  
 *  ByteView ,  目前用于deyj.js中, 但入口在 ByteArray.toDataView中
 *
 *  Ps: 还是直接用Uint8Array好, 只是名字不好听而已
 *
 */


ByteArray = function(buffer, offset, length) {
	if (buffer.buffer) {
		//console.log('buffer.buffer');
	}
	this.buffer = buffer;
	this.byteOffset = offset || 0;
	this.byteLength = length;

	this.length = length || buffer.length - this.byteOffset;		//wor16.asc时使用
}
//按照short数组来取index个字段
ByteArray.prototype.getByte = function(index) {
	return this.buffer[this.byteOffset + index];
}
ByteArray.prototype.getShort = function(index) {
	var high = this.getByte(index + 0);
	var low = this.getByte(index + 1);
	return low * 256 + high;
}
ByteArray.prototype.getInt = function(index) {
	var b1 = this.getByte(index + 0);
	var b2 = this.getByte(index + 1);
	var b3 = this.getByte(index + 2);
	var b4 = this.getByte(index + 3);
	return b4 * 256 * 256 * 256 + b3 * 256 * 256 + b2 * 256 + b1;
}
ByteArray.prototype.slice = function(start, end) {
	if (end > this.byteLength) {
		console.log('slice : ' + this.byteOffset + ' ' + this.byteLength + ' ' + start + ' ' + end + ' ');
		return;
	}
	if (end == 0) {
		end = this.byteLength;
	}
	try {
		return new ByteArray(this.buffer, this.byteOffset + start, end - start);
	} catch (e) {
		console.warn('[error] : slice ' + this.byteOffset + ' ' + this.byteLength + ' ' + start + ' ' + end + ' ')
	}
}
ByteArray.prototype.toDataView = function(offset) {
	offset = offset || 0;
	//return new ByteView(this., this.byteOffset + offset);
	return new ByteView(this.buffer, this.byteOffset + offset);

}





ByteView = function(buffer, offset, length) {
	if (buffer.buffer) {
		//console.log('byteview buffer.buffer');
	}
	this.buffer = buffer;
	this.byteOffset = offset || 0;
	this.byteLength = length || (buffer.length - offset);

	this.index = 0;
}
ByteView.prototype.skipByte = function(count) {
	this.index += count;
}

ByteView.prototype._getShort = function(index) {			//nextBits内部使用
	//alert(2);
	var high = this.buffer[this.byteOffset + index + 0];
	var low = this.buffer[this.byteOffset + index + 1];
	return low * 256 + high;
}

ByteView.prototype.nextByte = function() {
	var r = this.buffer[this.byteOffset + this.index];

	this.index += 1;
	return r;
}
ByteView.prototype.nextShort = function() {
	var high = this.buffer[this.byteOffset + this.index + 0];
	var low = this.buffer[this.byteOffset + this.index + 1];
	var r = low * 256 + high;

	this.index += 2;
	return r;
}
ByteView.prototype.nextInt = function() {
	var b1 = this.buffer[this.byteOffset + this.index + 0];
	var b2 = this.buffer[this.byteOffset + this.index + 1];
	var b3 = this.buffer[this.byteOffset + this.index + 2];
	var b4 = this.buffer[this.byteOffset + this.index + 3];
	var r = b4 * 256 * 256 * 256 + b3 * 256 * 256 + b2 * 256 + b1;

	this.index += 4;
	return r;

}

ByteView.prototype.nextByteArray = function(count) {
	var arr = [];
	for(var i = 0; i < count; i++) {
		arr[i] = this.nextByte();
	}
	return arr;
}
ByteView.prototype.nextShortArray = function(count) {
	var arr = [];
	for(var i = 0; i < count; i++) {
		arr[i] = this.nextShort();
	}
	return arr;
}
ByteView.prototype.nextBits = function(count) {
	this.index = this.index || 0;
	this.bitptr = this.bitptr || 0;

	var temp = this._getShort(this.index + (this.bitptr >> 4) * 2);
	var bp = this.bitptr & 0xf;

	var ret = 0;
	if (count > 16 - bp) {
		var mask = 0xffff >> bp;
		var temp1 = this._getShort(this.index + (this.bitptr >> 4) * 2 + 2);		//temp1. 这里, 如果使用固定长度数据, 会报越界, 但这时, 并不会用temp1
		ret = ( ((temp & mask) << (count + bp - 16)) | (temp1 >> (32 - count - bp)) ) & 0xFFFF;
	} else {
		ret = ((temp << bp) & 0xFFFF) >> (16 - count);
	}
	//this.bitptr < 200 ?	console.log('bits ' + 0 + ' ' + temp + ' ' + temp1 + ' ' + this.bitptr + ' ' + bp + ' ' + ret) : '';

	this.bitptr += count;
	return ret;
}
ByteView.prototype.nextView = function() {
	return new ByteView(this.buffer, this.byteOffset + this.index);
}
