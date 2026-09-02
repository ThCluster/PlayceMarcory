# -*- coding: utf-8 -*-
from django.db import models


class Client(models.Model):
    
    class Meta:
        managed = False
        db_table = "clients"
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        
    id_client = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=80)
    prenom = models.CharField(max_length=80)
    telephone = models.CharField(max_length=20, null=True)
    email = models.CharField(max_length=150, null=True)
    adresse = models.TextField(null=True)
    date_inscription = models.DateTimeField()
    actif = models.BooleanField()
