# -*- coding: utf-8 -*-
from django.db import models


class VueStatistiques(models.Model):
    """Chiffre d'affaires et marge, regroupés par mois."""
    periode = models.DateField(primary_key=True)
    nombre_ventes = models.IntegerField()
    nombre_clients_distincts = models.IntegerField()
    quantite_totale_vendue = models.DecimalField(max_digits=14, decimal_places=2)
    chiffre_affaires = models.DecimalField(max_digits=14, decimal_places=2)
    panier_moyen = models.DecimalField(max_digits=14, decimal_places=2)
    marge_brute_estimee = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = "vue_statistiques"


class VueTopClients(models.Model):
    id_client = models.IntegerField(primary_key=True)
    client = models.CharField(max_length=200)
    nombre_achats = models.IntegerField()
    chiffre_affaires_genere = models.DecimalField(max_digits=14, decimal_places=2)
    panier_moyen = models.DecimalField(max_digits=14, decimal_places=2)
    derniere_visite = models.DateTimeField()
    rang = models.IntegerField()

    class Meta:
        managed = False
        db_table = "vue_top_clients"


class VueTopProduits(models.Model):
    id_produit = models.IntegerField(primary_key=True)
    produit = models.CharField(max_length=150)
    categorie = models.CharField(max_length=100)
    quantite_vendue = models.DecimalField(max_digits=14, decimal_places=2)
    chiffre_affaires_genere = models.DecimalField(max_digits=14, decimal_places=2)
    rang = models.IntegerField()

    class Meta:
        managed = False
        db_table = "vue_top_produits"