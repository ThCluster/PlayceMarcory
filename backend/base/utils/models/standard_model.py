from django.db import models
from django.utils.translation import gettext_lazy as _ 

class StandardModel(models.Model):
   """
    Model definition for Standard
   """

   class Meta:
      """ Meta definition for Standard """
      abstract = True

   active = models.BooleanField(default=True)
   created_at = models.DateTimeField(auto_now_add=True, verbose_name=("Date de création"))
   last_updated_at = models.DateTimeField(auto_now=True, verbose_name=("Date de dernière modification"))