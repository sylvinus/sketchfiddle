from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Fiddle


DEFAULT_CODE_JS = """
var iframe = document.getElementById('sketchfab-embed');
var version = '1.0.0';
var modelid = '7w7pAfrCfjovwykkEeRFLGw5SXS';
var client = new Sketchfab(version, iframe);

client.init(modelid, {
    success: function onSuccess(api){
        api.start();
        api.addEventListener('viewerready', function() {

            // API is ready to use
            // Insert your code here
            console.log('Viewer is ready');

        });
    },
    error: function onError() {
        console.log('Viewer error');
    }
});
""".strip()

DEFAULT_CODE_HTML = """
    <iframe src="" style="width:100%;border:0;height:100%;" id="sketchfab-embed" frameborder="0" allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe>
""".strip()


def get_fiddle(_id):
    if _id == "default":
        return Fiddle(code_js=DEFAULT_CODE_JS, code_html=DEFAULT_CODE_HTML, id="default", name="New project")
    else:
        return Fiddle.objects.get(id=_id)


@csrf_exempt
def api_fiddle(request, _id):
    if request.method == 'GET':

        try:
            fiddle = get_fiddle(_id)
        except:
            return JsonResponse({
                "error": "Doesn't exist"
            })
        return JsonResponse(fiddle.dump())

    elif request.method == 'POST':

        fiddle = None
        if _id != "default":
            try:
                fiddle = get_fiddle(_id)
            except:
                return JsonResponse({
                    "error": "Doesn't exist"
                })

            # Fiddles from logged-in users can only be edited by them. If not, saved as a new one.
            if fiddle.user:
                if not request.user.is_authenticated() or fiddle.user != request.user:
                    fiddle = None

        # Create new fiddle
        if not fiddle:
            kwargs = {
                "code_js": request.POST["code_js"],
                "code_html": request.POST["code_html"],
                "name": request.POST["name"],
            }
            if request.user.is_authenticated():
                kwargs["user"] = request.user
            fiddle = Fiddle.objects.create(**kwargs)

        # Save existing
        else:
            fiddle.code_js = request.POST["code_js"]
            fiddle.code_html = request.POST["code_html"]
            fiddle.name = request.POST["name"]
            if request.user.is_authenticated():
                fiddle.user = request.user
            fiddle.save()

        return JsonResponse(fiddle.dump())
