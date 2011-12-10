Queue = {};

Queue.create = function(queueLength) {
	return (function() {

		var max = queueLength || 4;		//default is 4;
		var queue = [];
		var all = 0;
		var current = 0;
		var callback = null;

		function reset() {
			queue = [];
			all = 0;
			current = 0;
			callback = null;
		}

		function add(callback) {
			all++;
			queue.push(callback);
			check();
		}

		function remove() {
			current--;
			check();
			if (current == 0) {
				callback();
			}
		}

		function finish(c) {
			callback = c;
		}

		function check() {
			if (queue.length > 0 && current < max) {
				var el = queue.shift();
				current++;
				(el.callback || el)();
			}
		}


		return {
			add : add,
			remove : remove,
			finish : finish
		}

	})();

}