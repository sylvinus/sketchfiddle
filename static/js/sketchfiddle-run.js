(function() {

	var receiveMessage = function(event) {
		// TODO check origin
		if (event.data && event.data.sketchfiddle) {
			var evt = event.data.sketchfiddle;

			if (evt.type=="run") {

				var listener_code = '\nwindow.addEventListener("message",function(event) {'+
					'if (event.data && event.data.sketchfiddle) {'+
						'var evt = event.data.sketchfiddle;'+
						'if (evt.type=="reload") {'+
							'window.location.reload();'+
						'}'+
					'}'+
				'}, false);';

				// document.write is the most convenient way to execute script tags present in code_html
				document.write(
					'<html style="height:100%;"><body style="margin:0;padding:0;overflow:hidden;height:100%;">' +
					evt.code_html +
					"<script>" + evt.code_js + listener_code + "</script>"+
					'</body></html>'
				);

			} else if (evt.type=="reload") {
				window.location.reload();
			}

		}
	};
	window.addEventListener("message", receiveMessage, false);

	window.parent.postMessage({"sketchfiddle": {"type": "runner-loaded"}}, "*");

})();