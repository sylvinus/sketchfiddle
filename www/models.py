from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Fiddle(models.Model):
    """ A saved fiddle """

    user = models.ForeignKey(User, blank=True, null=True)

    name = models.CharField(max_length=255, blank=True, null=True)

    code_js = models.TextField(blank=True, null=False)
    code_html = models.TextField(blank=True, null=False)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def dump(self):
        data = {
            "id": self.id,
            "name": self.name,
            "code_js": self.code_js,
            "code_html": self.code_html
        }
        if self.user:
            data["username"] = self.user.username

        return data

    def __unicode__(self):
        return self.name
