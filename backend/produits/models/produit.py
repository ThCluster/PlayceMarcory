# -*- coding: utf-8 -*-
from django.db import models


class Produit(models.Model):
    """Lecture seule : pointe sur la vraie table produits."""
    id_produit = models.AutoField(primary_key=True)
    id_categorie = models.IntegerField()
    code_barre = models.CharField(max_length=50, null=True)
    nom = models.CharField(max_length=150)
    description = models.TextField(null=True)
    unite_mesure = models.CharField(max_length=20)
    prix_achat = models.DecimalField(max_digits=12, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=12, decimal_places=2)
    seuil_alerte = models.DecimalField(max_digits=12, decimal_places=2)
    actif = models.BooleanField()
    date_creation = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "produits"

