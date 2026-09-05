# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import gettext_lazy as _


class MouvementStock(models.Model):
    """Historique des mouvements de stock (entrées, sorties, ajustements)."""
    id_mouvement = models.AutoField(primary_key=True)
    id_produit = models.IntegerField()
    type_mouvement = models.CharField(max_length=20)
    quantite_mouvement = models.DecimalField(max_digits=12, decimal_places=2)
    quantite_avant = models.DecimalField(max_digits=12, decimal_places=2)
    quantite_apres = models.DecimalField(max_digits=12, decimal_places=2)
    source = models.CharField(max_length=20, null=True)
    id_reference = models.IntegerField(null=True)
    date_mouvement = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "mouvements_stock"
        verbose_name = _("Mouvement de stock")
        verbose_name_plural = _("Mouvements de stock")

    def __str__(self):
        return f"Mouvement {self.id_mouvement} (produit {self.id_produit})"