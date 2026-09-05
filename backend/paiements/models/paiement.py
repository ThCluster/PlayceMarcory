# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import gettext_lazy as _


class Paiement(models.Model):
    id_paiement = models.AutoField(primary_key=True)
    type_paiement = models.CharField(max_length=20)
    mode_paiement = models.CharField(max_length=20)
    montant = models.DecimalField(max_digits=14, decimal_places=2)
    reference_externe = models.CharField(max_length=100, null=True)
    id_employe = models.IntegerField()
    date_paiement = models.DateTimeField()
    observation = models.TextField(null=True)

    class Meta:
        managed = False
        db_table = "paiements"
        verbose_name = _("Paiement")
        verbose_name_plural = _("Paiements")

    def __str__(self):
        return f"{self.mode_paiement} - {self.montant} ({self.date_paiement})"


class PaiementClient(models.Model):
    id_paiement_client = models.AutoField(primary_key=True)
    id_paiement = models.IntegerField()
    id_vente = models.IntegerField()
    id_client = models.IntegerField()
    montant_alloue = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = "paiement_client"
        verbose_name = _("Paiement client")
        verbose_name_plural = _("Paiements clients")


class PaiementFournisseur(models.Model):
    id_paiement_fournisseur = models.AutoField(primary_key=True)
    id_paiement = models.IntegerField()
    id_achat = models.IntegerField()
    id_fournisseur = models.IntegerField()
    montant_alloue = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        managed = False
        db_table = "paiement_fournisseur"
        verbose_name = _("Paiement fournisseur")
        verbose_name_plural = _("Paiements fournisseurs")
