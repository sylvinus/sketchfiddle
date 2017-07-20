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
    var editor_js, editor_html;

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
            "theme": "material",
            "lineWrapping": true,
        });
        editor_js.on("blur", run);

        editor_html = CodeMirror($("#editor-code-html")[0], {
            "mode": "htmlmixed",
            "lineNumbers": true,
            "theme": "material",
            "autoRefresh": true,
            "lineWrapping": true,
        });

        // https://codemirror.net/demo/indentwrap.html
        var charWidth = editor_html.defaultCharWidth(), basePadding = 4;
        editor_html.on("renderLine", function(cm, line, elt) {
          var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
          elt.style.textIndent = "-" + off + "px";
          elt.style.paddingLeft = (basePadding + off) + "px";
        });

        editor_html.on("blur", run);

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

    var last_code_js, last_code_html;

    var run = function() {

        var code_js = editor_js.getValue();
        var code_html = editor_html.getValue();

        if (code_js == last_code_js && code_html == last_code_html) return;
        last_code_js = code_js;
        last_code_html = code_html;

        loadedCallbacks.push(function(){
            postMessage({
                "type": "run",
                "code_js": code_js,
                "code_html": code_html
            });
        });

        // The DOM may have been modified and the global JS namespace polluted so we reload.
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
                "code_js": editor_js.getValue(),
                "code_html": editor_html.getValue()
            },
            "success": function(data) {
                if (data.id) {

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
        editor_html.setValue(fiddle.code_html);
        current_fiddle = fiddle;

        $(".js-sketchfiddle-button-embed").prop("href", "https://embed.sketchfiddle.com/embed/"+fiddle.id);
        $(".fiddle-name").html(fiddle.name);
    };

    loadedCallbacks.push(run);
    setup();

    $(".js-sketchfiddle-button-save").show();
    $(".js-sketchfiddle-button-embed").show();

})();