# -*- coding: utf-8 -*-
from django.db import models

class Fournisseur(models.Model):
    
    class Meta : 
        
        managed = False
        db_table = "fournisseurs"
        verbose_name = "Fournisseur"
        verbose_name_plural = "Fournisseurs"
        
    id_fournisseur = models.AutoField(primary_key=True)
    nom_entreprise = models.CharField(max_length=150)
    contact_nom = models.CharField(max_length=100, null=True)
    telephone = models.CharField(max_length=20, null=True)
    email = models.CharField(max_length=150, null=True)
    adresse = models.TextField(null=True)
    date_creation = models.DateTimeField()
    actif = models.BooleanField()

    
    def __str__(self):
        return f"{self.nom_entreprise} - {self.contact_nom}"