(function() {

	var receiveMessage = function(event) {
		// TODO check origin
		if (event.data && event.data.sketchfiddle) {
			var evt = event.data.sketchfiddle;

			if (evt.type=="runner-loaded") {
				run();
			}

		}
	};
	window.addEventListener("message", receiveMessage, false);


	var editor_js;

	var setup = function() {

		editor_js = CodeMirror($("#editor-code-js")[0], {
			"mode": "javascript",
			"lineNumbers": true,
			"theme": "material"
		});

		editor_js.on("blur", run);

		$("#editor-iframe")[0].src = "/run/";

		$(".js-sketchfiddle-button-run").on("click", run);

		get_fiddle();

	};

	var postMessage = function(data) {

		var iframe = $("#editor-iframe")[0].contentWindow;

		iframe.postMessage({"sketchfiddle": data}, "*");
	};

	var run = function() {

		var code_js = editor_js.getValue();

		postMessage({"type": "run", "code_js": code_js});

	};

	var get_fiddle = function(id) {
		$.ajax({
			"url": "/api/fiddle",
			"method": "GET",
			"dataType": "json",
			"success": function(data) {
				editor_js.setValue(data.code_js);
			}
		});
	};


	setup();

})();