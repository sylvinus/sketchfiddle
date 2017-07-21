from django.http import HttpResponsePermanentRedirect


class RemoveWWW(object):
    def process_request(self, request):
        try:
            if request.META['HTTP_HOST'].lower().find('www.') == 0:
                return HttpResponsePermanentRedirect(request.build_absolute_uri().replace("//www.", "//"))
        except:
            pass
        return None
