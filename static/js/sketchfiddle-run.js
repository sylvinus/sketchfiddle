(function() {


	var receiveMessage = function(event) {
		// TODO check origin
		if (event.data && event.data.sketchfiddle) {
			var evt = event.data.sketchfiddle;

			if (evt.type=="run") {
				eval(evt.code_js);
			}

		}
	};
	window.addEventListener("message", receiveMessage, false);

	window.parent.postMessage({"sketchfiddle": {"type": "runner-loaded"}}, "*");

})();