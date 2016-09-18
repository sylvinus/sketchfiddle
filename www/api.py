from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def api_get_fiddle(request):

    default_fiddle = """
var iframe = document.getElementById( 'api-frame' );
var version = '1.0.0';
var urlid = '7w7pAfrCfjovwykkEeRFLGw5SXS';
var client = new Sketchfab( version, iframe );

client.init( urlid, {
    success: function onSuccess( api ){
        api.start();
        api.addEventListener( 'viewerready', function() {

            // API is ready to use
            // Insert your code here
            console.log( 'Viewer is ready' );

        } );
    },
    error: function onError() {
        console.log( 'Viewer error' );
    }
} );

    """.strip()

    return JsonResponse({"code_js": default_fiddle})
