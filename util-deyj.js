/*
 *	deyj算法, 目前传入 byteArray
 */


//param:   Uint8Array  src
function deyj(src) {

	if (src.getInt(0) != 0x315F4A59) {			//YJ_1	魔法字符, 用于标识YJ_1压缩
		return src;
	}

	var data = src.toDataView();		
	
	data.skipByte(4);							//YJ_1
	var UncompressedLength = data.nextInt();	//4->8
	var CompressedLength = data.nextInt();		//8->12
	var BlockCount = data.nextShort();			//12->14
	var reserved = data.nextByte();				//15
	var HuffmanTreeLength = data.nextByte();	//16


	var huffmanTreeLen = HuffmanTreeLength * 2;

	var leafView = src.toDataView(16+huffmanTreeLen);

	//构建huffman 树
	var codes = [];		//huffman array
	(function () {
		codes[0] = {
			i : 0,
			leaf : false,
			value : 0,
			left : 1,
			right : 2
		};
		for(var i = 1; i <= huffmanTreeLen; i++) {
			var leaf = !leafView.nextBits(1);
			var value = data.nextByte();
			codes[i] = {
				i : i,
				leaf : leaf,
				value : value,
				left : leaf ? null : (value * 2 + 1),
				right : leaf ? null : (value * 2 + 2)
			};
		}

		for(var i = 0; i <= huffmanTreeLen; i++) {
			codes[i].left = codes[codes[i].left];
			codes[i].right = codes[codes[i].right];
		}

	})();

	var n = ((huffmanTreeLen & 0xf) ? (huffmanTreeLen >> 4) + 1 : (huffmanTreeLen >> 4)) << 1;	//n个字节的huffman标志位
	//var base = 16 + huffmanTreeLen + n;						//去掉头部
	data.skipByte(n);


	var buf = [];

	for(var i = 0; i < BlockCount; i++) {
		var block = data.nextView();

		var bUncompressedLength = block.nextShort();
		var bCompressedLength = block.nextShort();			//
		var LZSSRepeatTable = block.nextShortArray(4);
		var LZSSOffsetCodeLengthTable = block.nextByteArray(4);
		var LZSSRepeatCodeLengthTable = block.nextByteArray(3);
		var CodeCountCodeLengthTable = block.nextByteArray(3);
		var CodeCountTable = block.nextByteArray(2);

		if (bCompressedLength == 0) {
			var temp = data.nextView();
			temp.skipByte(4)
			var buf = [];
			for(var j = 0; j < bUncompressedLength; j++) {
				buf.push( temp.getByte() );
			}
			continue;
		}
		var n = 0;
		while(true) {			//进入循环, 直到结束
			var loop = getLoop(block);
			if (!loop) break;
			//n < 100 && console.log('loop ' + (n++) + ' A ' + loop);
			//console.log('loop ' + (n++) + ' A ' + loop);

			for(var j = 0; j < loop; j++) {
				var node = codes[0];
				while(!node.leaf) {
					var bit = block.nextBits(1);
					node = bit ? node.right : node.left;
				}
				buf[buf.length] = node.value;
			}

			var loop = getLoop(block);
			if (!loop) break;
			//n < 100 && console.log('loop ' + (n++) + ' B '+ loop);
			//console.log('loop ' + (n++) + ' B '+ loop);

			for(var j = 0; j < loop; j++) {
				var count = getCount(block);
				var pos = pos1 = block.nextBits(2);
				var pos = pos2 = block.nextBits(LZSSOffsetCodeLengthTable[pos]);

				for(var k = 0; k < count; k++) {
					buf[buf.length] = buf[buf.length - pos];
				}
			}
			//n < 100 && console.log('loop ' + (n++) + ' C ' + loop + ' ' + count + ' ' + pos1 + ' ' + pos2);
			//console.log('loop ' + (n++) + ' C ' + loop + ' ' + count + ' ' + pos1 + ' ' + pos2);
		}
		data.skipByte(bCompressedLength);

		if (buf.length > 65536) {
			alert('超了 ' + buf.length);
			break;
		}
	}




	function getLoop(block) {
		var temp1 = block.nextBits(1);
		if (temp1) {
			return CodeCountTable[0];
		} else {
			var temp;
			if (temp = block.nextBits(2)) {
				return block.nextBits(CodeCountCodeLengthTable[temp - 1]);
			} else {
				return CodeCountTable[1];
			}
		}	
	}
	function getCount(block) {
		var temp;
		if (temp = block.nextBits(2)){
			if (block.nextBits(1)) {
				return block.nextBits(LZSSRepeatCodeLengthTable[temp - 1]);
			} else {
				return LZSSRepeatTable[temp];
			}
		} else {
			return LZSSRepeatTable[0];
		}
	}

	//return buf;
	return new ByteArray(buf);
}