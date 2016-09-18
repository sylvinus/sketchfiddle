from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Fiddle(models.Model):
    """ A saved fiddle """

    user = models.ForeignKey(User)

    name = models.CharField(max_length=255, blank=True, null=True)

    code_js = models.TextField(blank=True, null=False)

    created = models.DateField(null=False)
    updated = models.DateField(blank=True, null=True)
