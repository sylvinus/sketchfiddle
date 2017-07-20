(function() {

	var loadedCallbacks = [];

	var receiveMessage = function(event) {
		// TODO check origin
		if (event.data && event.data.sketchfiddle) {
			var evt = event.data.sketchfiddle;

			if (evt.type=="runner-loaded") {
				if (loadedCallbacks.length) {
					var cb = loadedCallbacks.pop();
					cb();
				}
			}

		}
	};
	window.addEventListener("message", receiveMessage, false);

	var current_fiddle = {};
	var editor_js;

	var get_fiddle_id_from_url = function() {
		var m = window.location.toString().match("\/edit\/([0-9]+)$");
		if (m) {
			return m[1];
		}
		return "default";
	};

	var setup = function() {

		editor_js = CodeMirror($("#editor-code-js")[0], {
			"mode": "javascript",
			"lineNumbers": true,
			"theme": "material"
		});

		editor_js.on("blur", run);

		$("#editor-iframe")[0].src = "/run/";

		$(".js-sketchfiddle-button-run").on("click", run);
		$(".js-sketchfiddle-button-save").on("click", save);
		$(".js-sketchfiddle-button-embed").on("click", embed);

		get_fiddle(get_fiddle_id_from_url());

	};

	var postMessage = function(data) {

		var iframe = $("#editor-iframe")[0].contentWindow;

		iframe.postMessage({"sketchfiddle": data}, "*");
	};

	var last_code_js;

	var run = function() {

		var code_js = editor_js.getValue();

		if (code_js == last_code_js) return;
		last_code_js = code_js;

		loadedCallbacks.push(function(){
			postMessage({"type": "run", "code_js": code_js});
		});

		// The DOM may have been modified so we reload.
		postMessage({"type": "reload"});

	};

	var save = function() {

		var name = window.prompt("Enter a name for this Sketchfiddle!", current_fiddle.name);
		if (!name) return;

		$.ajax({
			"url": "/api/fiddle/" + current_fiddle.id,
			"method": "POST",
			"dataType": "json",
			"data": {
				"name": name,
				"code_js": editor_js.getValue()
			},
			"success": function(data) {
				if (data.id) {
					console.log(data, current_fiddle);
					// Redirect to the new fiddle URL
					if (current_fiddle.id != data.id) {
						window.location = window.location.toString().replace(/\/?\#?(edit\/[0-9]+)?$/, "/edit/" + data.id)
						return;
					}
					set_current_fiddle(data);
					run();
				} else {
					window.alert("Error while saving: " + data.error);
				}
			}
		});

		return false;
	};

	var embed = function() {

		$("#embed-code").val('<iframe width="640" height="480" src="https://embed.sketchfiddle.com/embed/'+current_fiddle.id+'" frameborder="0" allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe>');
		$("#embed-modal").modal();

		return false;
	};

	var get_fiddle = function(id) {
		$.ajax({
			"url": "/api/fiddle/" + id,
			"method": "GET",
			"dataType": "json",
			"success": function(data) {
				set_current_fiddle(data);
			}
		});
	};

	var set_current_fiddle = function(fiddle) {
		editor_js.setValue(fiddle.code_js);
		current_fiddle = fiddle;

		$(".js-sketchfiddle-button-embed").prop("href", "https://embed.sketchfiddle.com/embed/"+fiddle.id);
	};

	loadedCallbacks.push(run);
	setup();

})();