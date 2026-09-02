# -*- coding: utf-8 -*-
from django.db import models


class VueCommande(models.Model):
    """Lecture seule : pointe sur vue_commandes (déjà calculée par PostgreSQL)."""

    id_vente = models.IntegerField(primary_key=True)
    date_vente = models.DateTimeField()
    id_client = models.IntegerField()
    client = models.CharField(max_length=200)
    employe = models.CharField(max_length=80)
    statut = models.CharField(max_length=20)
    nombre_produits = models.IntegerField()
    quantite_totale = models.DecimalField(max_digits=12, decimal_places=2)
    montant_total = models.DecimalField(max_digits=14, decimal_places=2)
    montant_paye = models.DecimalField(max_digits=14, decimal_places=2)
    reste_a_payer = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = "vue_commandes"
