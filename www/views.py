from django.shortcuts import render
from django.views.generic.base import TemplateView
from .api import get_fiddle


class RunView(TemplateView):

    template_name = "run.html"

    def get_context_data(self, **kwargs):

        context = super(RunView, self).get_context_data(**kwargs)

        return context


class EditView(TemplateView):
    template_name = "edit.html"


class EmbedView(TemplateView):
    template_name = "embed.html"

    def get_context_data(self, **kwargs):

        context = super(EmbedView, self).get_context_data(**kwargs)

        try:
            fiddle = get_fiddle(kwargs["_id"])
        except:
            # TODO
            pass

        context["fiddle"] = fiddle
        return context
