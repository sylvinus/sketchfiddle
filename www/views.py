from django.shortcuts import render
from django.views.generic.base import TemplateView


class RunView(TemplateView):

    template_name = "run.html"

    def get_context_data(self, **kwargs):

        context = super(RunView, self).get_context_data(**kwargs)

        return context


class EditView(TemplateView):
    template_name = "edit.html"
