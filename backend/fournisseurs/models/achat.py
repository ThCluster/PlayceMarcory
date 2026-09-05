# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import gettext_lazy as _


class Achat(models.Model):
    """Un bon de commande / réapprovisionnement passé auprès d'un fournisseur."""
    id_achat = models.AutoField(primary_key=True)
    id_fournisseur = models.IntegerField()
    id_employe = models.IntegerField()
    date_achat = models.DateTimeField()
    statut = models.CharField(max_length=20)
    montant_total = models.DecimalField(max_digits=14, decimal_places=2)
    montant_paye = models.DecimalField(max_digits=14, decimal_places=2)
    observation = models.TextField(null=True)

    class Meta:
        managed = False
        db_table = "achats"
        verbose_name = _("Achat")
        verbose_name_plural = _("Achats")

    def __str__(self):
        return f"Achat {self.id_achat} (fournisseur {self.id_fournisseur})"


class LigneAchat(models.Model):
    """Ligne d'un achat : un produit acheté en une certaine quantité."""
    id_ligne_achat = models.AutoField(primary_key=True)
    id_achat = models.IntegerField()
    id_produit = models.IntegerField()
    quantite = models.DecimalField(max_digits=12, decimal_places=2)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)
    montant_ligne = models.DecimalField(max_digits=14, decimal_places=2, null=True)

    class Meta:
        managed = False
        db_table = "lignes_achat"
        verbose_name = _("Ligne d'achat")
        verbose_name_plural = _("Lignes d'achat")