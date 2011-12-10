PalEvent = {

	events : {};

	on : function(type, callback) {
		var e = events[type] || [];
		e.push(callback);
		events[type] = e;
	}


	fire : function(type, callback) {
		var e = events[type] || [];
		for(var k in e) {
			e[k]();
		}
	}


}